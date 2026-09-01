const asyncHandler = require('../utils/asyncHandler');
const { validateFile } = require('../utils/validators');
const { safeDelete, getFileSize, buildCompressionStats } = require('../utils/fileHelpers');
const { buildSuccessResponse } = require('../utils/response');
const AppError = require('../utils/AppError');

const pdfService = require('../services/pdfService');
const imageService = require('../services/imageService');

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

/**
 * POST /api/compress/pdf
 * body: level=low|medium|high (optional, default medium)
 */
const compressPdf = asyncHandler(async (req, res) => {
  validateFile(req.file, ['.pdf'], 'PDF file');
  const level = (req.body.level || 'medium').toLowerCase();
  if (!['low', 'medium', 'high'].includes(level)) {
    throw new AppError('level must be one of: low, medium, high', 400);
  }

  const originalSize = await getFileSize(req.file.path);

  let outPath;
  try {
    outPath = await pdfService.compressPdf(req.file.path, level);
  } finally {
    await safeDelete(req.file.path);
  }

  const compressedSize = await getFileSize(outPath);
  const stats = buildCompressionStats(originalSize, compressedSize);

  res.json(buildSuccessResponse('Compression successful', outPath, stats));
});

/**
 * POST /api/compress/image
 * body: quality=1-100 (optional, default 80)
 */
const compressImage = asyncHandler(async (req, res) => {
  const ext = validateFile(req.file, IMAGE_EXTENSIONS, 'image file');
  const quality = req.body.quality;

  const originalSize = await getFileSize(req.file.path);

  let outPath;
  try {
    outPath = await imageService.compressImage(req.file.path, ext, quality);
  } finally {
    await safeDelete(req.file.path);
  }

  const compressedSize = await getFileSize(outPath);
  const stats = buildCompressionStats(originalSize, compressedSize);

  res.json(buildSuccessResponse('Compression successful', outPath, stats));
});

module.exports = { compressPdf, compressImage };
