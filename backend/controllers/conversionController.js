const asyncHandler = require('../utils/asyncHandler');
const { validateFile, validateFiles, validateFormat } = require('../utils/validators');
const { safeDelete, safeDeleteMany } = require('../utils/fileHelpers');
const { buildSuccessResponse } = require('../utils/response');
const config = require('../utils/config');

const pdfService = require('../services/pdfService');
const imageService = require('../services/imageService');
const docService = require('../services/docService');

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
const IMAGE_FORMATS = ['png', 'jpg', 'jpeg', 'webp'];

/**
 * POST /api/convert/image-to-pdf
 * file field: "file" (single png/jpg/webp)
 */
const imageToPdf = asyncHandler(async (req, res) => {
  const ext = validateFile(req.file, IMAGE_EXTENSIONS, 'image file');

  let outPath;
  try {
    outPath = await pdfService.imageToPdf(req.file.path, ext);
  } finally {
    await safeDelete(req.file.path);
  }

  res.json(buildSuccessResponse('Conversion successful', outPath));
});

/**
 * POST /api/convert/images-to-pdf
 * file field: "files" (multiple, order preserved as received)
 */
const imagesToPdf = asyncHandler(async (req, res) => {
  validateFiles(req.files, IMAGE_EXTENSIONS, 'image files', config.maxFiles);

  let outPath;
  try {
    outPath = await pdfService.imagesToPdf(req.files);
  } finally {
    await safeDeleteMany(req.files.map((f) => f.path));
  }

  res.json(
    buildSuccessResponse(`Combined ${req.files.length} images into one PDF`, outPath, {
      imageCount: req.files.length,
    })
  );
});

/**
 * POST /api/convert/txt-to-pdf
 */
const txtToPdf = asyncHandler(async (req, res) => {
  validateFile(req.file, ['.txt'], 'TXT file');

  let outPath;
  try {
    outPath = await docService.txtToPdf(req.file.path);
  } finally {
    await safeDelete(req.file.path);
  }

  res.json(buildSuccessResponse('Conversion successful', outPath));
});

/**
 * POST /api/convert/pdf-to-txt
 */
const pdfToTxt = asyncHandler(async (req, res) => {
  validateFile(req.file, ['.pdf'], 'PDF file');

  let outPath;
  try {
    outPath = await docService.pdfToTxt(req.file.path);
  } finally {
    await safeDelete(req.file.path);
  }

  res.json(buildSuccessResponse('Conversion successful', outPath));
});

/**
 * POST /api/convert/image-format
 * body: format=png|jpg|jpeg|webp (target), file field: "file"
 */
const imageFormat = asyncHandler(async (req, res) => {
  validateFile(req.file, IMAGE_EXTENSIONS, 'image file');
  const targetFormat = validateFormat(req.body.format, IMAGE_FORMATS, 'target format');

  let outPath;
  try {
    outPath = await imageService.convertImageFormat(req.file.path, targetFormat);
  } finally {
    await safeDelete(req.file.path);
  }

  res.json(buildSuccessResponse('Conversion successful', outPath));
});

module.exports = {
  imageToPdf,
  imagesToPdf,
  txtToPdf,
  pdfToTxt,
  imageFormat,
};
