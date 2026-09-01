const multer = require('multer');
const AppError = require('../utils/AppError');

/**
 * Central error handler. Every error - whether an AppError thrown
 * deliberately, a MulterError, or an unexpected exception from a
 * conversion library - ends up here and is returned as the same
 * { success: false, message } JSON shape, with no stack traces or
 * filesystem paths ever sent to the client.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Multer-specific errors (file too large, too many files, bad type, etc.)
  if (err instanceof multer.MulterError) {
    let message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File exceeds the maximum allowed size';
    } else if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = err.message || 'Too many files, or an unsupported file type was included';
    }
    return res.status(400).json({ success: false, message });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Unexpected/unhandled errors - log server-side, but never leak
  // internals (stack traces, absolute paths) to the client.
  console.error('[Unhandled Error]', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong while processing your request',
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

module.exports = { errorHandler, notFoundHandler };
