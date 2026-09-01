const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const crypto = require('crypto');

/**
 * Generate a unique filename while preserving the original extension.
 * Uses timestamp + random hex to avoid collisions without exposing
 * anything about the original filename or server paths.
 */
function generateUniqueFilename(originalExt) {
  const ext = originalExt.startsWith('.') ? originalExt : `.${originalExt}`;
  const unique = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
  return `${unique}${ext}`;
}

/**
 * Get file size in bytes. Returns 0 if the file does not exist.
 */
async function getFileSize(filePath) {
  try {
    const stats = await fsp.stat(filePath);
    return stats.size;
  } catch (err) {
    return 0;
  }
}

/**
 * Delete a file if it exists. Never throws - cleanup is best-effort.
 */
async function safeDelete(filePath) {
  if (!filePath) return;
  try {
    await fsp.unlink(filePath);
  } catch (err) {
    // Ignore - file may already be gone, cleanup is best-effort
  }
}

/**
 * Delete multiple files, ignoring individual failures.
 */
async function safeDeleteMany(filePaths = []) {
  await Promise.all(filePaths.map((p) => safeDelete(p)));
}

/**
 * Ensure a directory exists.
 */
async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

/**
 * Build a compression stats object.
 */
function buildCompressionStats(originalSize, compressedSize) {
  const bytesSaved = Math.max(originalSize - compressedSize, 0);
  const percentageReduction =
    originalSize > 0 ? Number(((bytesSaved / originalSize) * 100).toFixed(2)) : 0;

  return {
    originalSize,
    compressedSize,
    bytesSaved,
    percentageReduction,
  };
}

/**
 * Return only the basename of a path - used any time we need to expose
 * a "filename" to the client without leaking full server-side paths.
 */
function toPublicFilename(filePath) {
  return path.basename(filePath);
}

module.exports = {
  generateUniqueFilename,
  getFileSize,
  safeDelete,
  safeDeleteMany,
  ensureDir,
  buildCompressionStats,
  toPublicFilename,
};
