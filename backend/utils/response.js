const { toPublicFilename } = require('./fileHelpers');

/**
 * Build the standard success JSON shape. `outputPath` is an absolute
 * server path - only its basename is ever exposed to the client, via
 * the /downloads/ static route, so no server filesystem paths leak out.
 */
function buildSuccessResponse(message, outputPath, extra = {}) {
  return {
    success: true,
    message,
    filename: toPublicFilename(outputPath),
    downloadUrl: `/downloads/${toPublicFilename(outputPath)}`,
    ...extra,
  };
}

module.exports = { buildSuccessResponse };
