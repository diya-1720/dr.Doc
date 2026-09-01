/**
 * Operational error with an HTTP status code attached.
 * Thrown deliberately (bad input, unsupported format, processing failure)
 * and caught by the global error handler, which returns it as JSON
 * without leaking stack traces or server paths to the client.
 */
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
