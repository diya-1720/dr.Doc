const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const sharp = require('sharp');
const { PDFDocument, PDFName, PDFRawStream, PDFNumber } = require('pdf-lib');
const { generateUniqueFilename } = require('../utils/fileHelpers');
const config = require('../utils/config');
const AppError = require('../utils/AppError');

/**
 * Embed a single image file into a new single-page PDF, sized to the
 * image's own dimensions. Handles png/jpg/jpeg natively via pdf-lib;
 * webp is converted to PNG first since pdf-lib cannot embed webp.
 */
async function imageToPdf(imagePath, ext) {
  const pdfDoc = await PDFDocument.create();
  await embedImagePage(pdfDoc, imagePath, ext);

  const outName = generateUniqueFilename('.pdf');
  const outPath = path.join(config.outputsDir, outName);
  const bytes = await pdfDoc.save();
  await fsp.writeFile(outPath, bytes);
  return outPath;
}

/**
 * Combine multiple images (in the given order) into a single multi-page PDF.
 * Each image becomes one page, sized to that image's dimensions.
 */
async function imagesToPdf(files) {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    await embedImagePage(pdfDoc, file.path, ext);
  }

  const outName = generateUniqueFilename('.pdf');
  const outPath = path.join(config.outputsDir, outName);
  const bytes = await pdfDoc.save();
  await fsp.writeFile(outPath, bytes);
  return outPath;
}

/**
 * Helper: embed one image as a new page in an existing PDFDocument.
 */
async function embedImagePage(pdfDoc, imagePath, ext) {
  let imageBytes = await fsp.readFile(imagePath);
  let embedded;

  if (ext === '.png') {
    embedded = await pdfDoc.embedPng(imageBytes);
  } else if (ext === '.jpg' || ext === '.jpeg') {
    embedded = await pdfDoc.embedJpg(imageBytes);
  } else if (ext === '.webp') {
    // pdf-lib has no webp support - normalize to PNG first.
    const pngBuffer = await sharp(imageBytes).png().toBuffer();
    embedded = await pdfDoc.embedPng(pngBuffer);
  } else {
    throw new AppError(`Unsupported image type for PDF embedding: ${ext}`, 400);
  }

  const page = pdfDoc.addPage([embedded.width, embedded.height]);
  page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
}

/**
 * Per-level settings for the JPEG re-encode pass below. "low" = smallest
 * output / most aggressive (matches the old Ghostscript /screen preset),
 * "high" = largest output / least aggressive (old /printer preset).
 */
const LEVEL_SETTINGS = {
  low: { jpegQuality: 35, maxDimension: 900 },
  medium: { jpegQuality: 55, maxDimension: 1500 },
  high: { jpegQuality: 75, maxDimension: 2200 },
};

/**
 * Compress a PDF using a pure Node.js/npm pipeline - no Ghostscript or any
 * other system binary required, so this works on any OS (including
 * Windows) immediately after `npm install`.
 *
 * How it actually reduces size:
 *  1. Walks every indirect object in the PDF looking for image XObjects
 *     encoded as JPEG (Filter=DCTDecode) - by far the dominant contributor
 *     to file size in scanned/photographic PDFs - and re-encodes each one
 *     with sharp at a level-appropriate quality and (if larger than the
 *     level's cap) a reduced pixel size, exactly like Ghostscript's
 *     DPI-downsampling presets did. A re-encoded image only replaces the
 *     original if it's actually smaller; nothing is ever made bigger.
 *  2. Skips CMYK images (4-channel) to avoid the colour-shift risk of a
 *     lossy RGB round-trip, and skips anything that isn't a plain
 *     DCTDecode-filtered stream, so non-JPEG image data is left untouched
 *     rather than risking corruption.
 *  3. Re-saves the whole document with object streams enabled, which
 *     compresses the PDF's internal object/cross-reference structure -
 *     this alone still helps even on text-only, image-free PDFs.
 *
 * This does not attempt to touch fonts, vector content, or non-JPEG
 * (Flate-encoded raw raster) images - the biggest wins are on
 * image-heavy PDFs, same as it was with Ghostscript.
 */
async function compressPdf(inputPath, level = 'medium') {
  const settings = LEVEL_SETTINGS[level] || LEVEL_SETTINGS.medium;

  const inputBytes = await fsp.readFile(inputPath);

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(inputBytes, {
      updateMetadata: false,
      ignoreEncryption: true,
    });
  } catch (err) {
    throw new AppError('Failed to read PDF. Is the file a valid PDF?', 422);
  }

  const context = pdfDoc.context;
  const SubtypeKey = PDFName.of('Subtype');
  const FilterKey = PDFName.of('Filter');
  const ImageName = PDFName.of('Image');
  const DCTDecodeName = PDFName.of('DCTDecode');
  const WidthKey = PDFName.of('Width');
  const HeightKey = PDFName.of('Height');

  const entries = context.enumerateIndirectObjects();

  for (const [ref, obj] of entries) {
    if (!(obj instanceof PDFRawStream)) continue;

    const dict = obj.dict;
    if (dict.lookup(SubtypeKey) !== ImageName) continue;
    if (dict.lookup(FilterKey) !== DCTDecodeName) continue;

    try {
      const original = obj.getContents();
      const originalBuffer = Buffer.from(original);

      let pipeline = sharp(originalBuffer);
      const meta = await pipeline.metadata();

      // Skip CMYK (4-channel) images - re-encoding through sharp's RGB
      // pipeline risks a visible colour shift on print-oriented PDFs.
      if (meta.channels === 4) continue;

      const longestSide = Math.max(meta.width || 0, meta.height || 0);
      if (longestSide > settings.maxDimension) {
        pipeline =
          (meta.width || 0) >= (meta.height || 0)
            ? pipeline.resize({ width: settings.maxDimension, withoutEnlargement: true })
            : pipeline.resize({ height: settings.maxDimension, withoutEnlargement: true });
      }

      const recompressed = await pipeline
        .jpeg({ quality: settings.jpegQuality, mozjpeg: true })
        .toBuffer();

      if (recompressed.length >= originalBuffer.length) continue;

      const newMeta = await sharp(recompressed).metadata();
      dict.set(WidthKey, PDFNumber.of(newMeta.width));
      dict.set(HeightKey, PDFNumber.of(newMeta.height));

      const newStream = PDFRawStream.of(dict, recompressed);
      context.assign(ref, newStream);
    } catch (err) {
      // A single unreadable/unusual image shouldn't fail the whole
      // request - just leave that one object untouched.
      continue;
    }
  }

  const outName = generateUniqueFilename('.pdf');
  const outPath = path.join(config.outputsDir, outName);

  const outBytes = await pdfDoc.save({ useObjectStreams: true });
  await fsp.writeFile(outPath, outBytes);

  return outPath;
}

module.exports = {
  imageToPdf,
  imagesToPdf,
  compressPdf,
};
