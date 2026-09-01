/**
 * Wraps an async route/controller function so rejected promises are
 * forwarded to Express's error-handling middleware via next(err),
 * instead of needing a try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
