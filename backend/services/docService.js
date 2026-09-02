const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const PDFDocument = require('pdfkit');
const pdfParse = require('pdf-parse');
const { generateUniqueFilename } = require('../utils/fileHelpers');
const config = require('../utils/config');
const AppError = require('../utils/AppError');

/**
 * Render a plain text file into a paginated PDF using PDFKit.
 * PDFKit's text() call handles word-wrapping and automatic page breaks.
 */
async function txtToPdf(inputPath) {
  const text = await fsp.readFile(inputPath, 'utf-8');
  const outName = generateUniqueFilename('.pdf');
  const outPath = path.join(config.outputsDir, outName);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(outPath);

    doc.pipe(stream);
    doc.font('Helvetica').fontSize(11).text(text, {
      align: 'left',
      lineGap: 2,
    });
    doc.end();

    stream.on('finish', resolve);
    stream.on('error', reject);
    doc.on('error', reject);
  });

  return outPath;
}

/**
 * Extract text from a PDF using pdf-parse (pure JS, no system dependency).
 */
async function pdfToTxt(inputPath) {
  const dataBuffer = await fsp.readFile(inputPath);

  let extractedText = '';
  try {
    const data = await pdfParse(dataBuffer);
    extractedText = (data && data.text) ? data.text : '';
  } catch (err) {
    console.warn('pdfParse extraction note:', err.message);
  }

  const outName = generateUniqueFilename('.txt');
  const outPath = path.join(config.outputsDir, outName);
  await fsp.writeFile(outPath, extractedText || 'No text extracted from PDF.', 'utf-8');
  return { outPath, text: extractedText };
}

module.exports = {
  txtToPdf,
  pdfToTxt,
};
