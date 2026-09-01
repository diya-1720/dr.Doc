const path = require('path');
const AppError = require('./AppError');

// Canonical mapping of extension -> accepted MIME types.
// Browsers/OSes are inconsistent about image/jpg vs image/jpeg etc,
// so each extension accepts a small set of equivalent MIME types.
const MIME_MAP = {
  '.pdf': ['application/pdf'],
  '.png': ['image/png'],
  '.jpg': ['image/jpeg', 'image/jpg'],
  '.jpeg': ['image/jpeg', 'image/jpg'],
  '.webp': ['image/webp'],
  '.txt': ['text/plain'],
};

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

/**
 * Validate that a Multer file's extension and MIME type are both present
 * in `allowedExtensions`, and that they're mutually consistent.
 * Throws AppError (400) on any mismatch.
 */
function validateFile(file, allowedExtensions, label = 'file') {
  if (!file) {
    throw new AppError(`No ${label} was uploaded`, 400);
  }

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    throw new AppError(
      `Unsupported file extension "${ext || '(none)'}" for ${label}. Allowed: ${allowedExtensions.join(', ')}`,
      400
    );
  }

  // Some clients/tools (curl, some non-browser HTTP libraries) send a
  // generic "application/octet-stream" MIME type instead of a specific
  // one, especially for less common types like webp. We tolerate that
  // generic value but still reject a MISMATCHED specific MIME type
  // (e.g. a .pdf upload whose browser-reported type is text/plain),
  // which is what actually indicates a wrong/renamed file.
  const acceptedMimes = MIME_MAP[ext] || [];
  const isGenericBinary = file.mimetype === 'application/octet-stream';
  if (acceptedMimes.length && !isGenericBinary && !acceptedMimes.includes(file.mimetype)) {
    throw new AppError(
      `File extension "${ext}" does not match its detected MIME type "${file.mimetype}"`,
      400
    );
  }

  return ext;
}

/**
 * Validate an array of files (e.g. multiple images -> PDF).
 */
function validateFiles(files, allowedExtensions, label = 'files', maxFiles = 20) {
  if (!files || files.length === 0) {
    throw new AppError(`No ${label} were uploaded`, 400);
  }
  if (files.length > maxFiles) {
    throw new AppError(`Too many files. Maximum allowed is ${maxFiles}`, 400);
  }
  files.forEach((file) => validateFile(file, allowedExtensions, label));
}

/**
 * Validate a requested output/target format string against a whitelist.
 */
function validateFormat(format, allowedFormats, label = 'format') {
  if (!format || !allowedFormats.includes(format.toLowerCase())) {
    throw new AppError(
      `Invalid or missing ${label}. Allowed: ${allowedFormats.join(', ')}`,
      400
    );
  }
  return format.toLowerCase();
}

module.exports = {
  MIME_MAP,
  IMAGE_EXTENSIONS,
  validateFile,
  validateFiles,
  validateFormat,
};
