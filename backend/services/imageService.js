const fsp = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { generateUniqueFilename } = require('../utils/fileHelpers');
const config = require('../utils/config');
const AppError = require('../utils/AppError');

const SUPPORTED_FORMATS = ['png', 'jpg', 'jpeg', 'webp'];

/**
 * Convert an image file to a target format (png/jpg/jpeg/webp) using sharp.
 * Returns the absolute path to the newly created file.
 */
async function convertImageFormat(inputPath, targetFormat) {
  const fmt = targetFormat.toLowerCase();
  if (!SUPPORTED_FORMATS.includes(fmt)) {
    throw new AppError(`Unsupported target image format: ${targetFormat}`, 400);
  }

  const sharpFormat = fmt === 'jpg' ? 'jpeg' : fmt;
  const outExt = fmt === 'jpeg' ? '.jpg' : `.${fmt}`;
  const outName = generateUniqueFilename(outExt);
  const outPath = path.join(config.outputsDir, outName);

  try {
    let pipeline = sharp(inputPath);
    // Flatten transparency onto white when converting into JPEG, which
    // has no alpha channel - otherwise sharp would error or produce
    // unexpected black backgrounds for PNG/WEBP sources with transparency.
    if (sharpFormat === 'jpeg') {
      pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
    }
    await pipeline.toFormat(sharpFormat).toFile(outPath);
  } catch (err) {
    throw new AppError(`Image conversion failed: ${err.message}`, 422);
  }

  return outPath;
}

/**
 * Compress an image in-place-equivalent (new output file) using a quality
 * parameter (1-100). Behavior per format:
 *  - jpeg: standard lossy quality control
 *  - webp: standard lossy quality control
 *  - png: lossy palette-based compression (libimagequant) driven by quality,
 *         which is where PNG file-size reduction actually comes from
 */
async function compressImage(inputPath, ext, quality = 80) {
  const q = Math.min(Math.max(parseInt(quality, 10) || 80, 1), 100);
  const normalizedExt = ext.toLowerCase();

  const outExt = normalizedExt === '.jpeg' ? '.jpg' : normalizedExt;
  const outName = generateUniqueFilename(outExt);
  const outPath = path.join(config.outputsDir, outName);

  try {
    const image = sharp(inputPath);

    if (normalizedExt === '.jpg' || normalizedExt === '.jpeg') {
      await image.jpeg({ quality: q, mozjpeg: true }).toFile(outPath);
    } else if (normalizedExt === '.webp') {
      await image.webp({ quality: q }).toFile(outPath);
    } else if (normalizedExt === '.png') {
      await image
        .png({ quality: q, palette: true, compressionLevel: 9, effort: 8 })
        .toFile(outPath);
    } else {
      throw new AppError(`Unsupported image type for compression: ${ext}`, 400);
    }
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(`Image compression failed: ${err.message}`, 422);
  }

  return outPath;
}

module.exports = {
  convertImageFormat,
  compressImage,
  SUPPORTED_FORMATS,
};
