const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const config = require('../utils/config');
const { ensureDir } = require('../utils/fileHelpers');

// In-memory registry with TTL
// Map<token, { caseId, applicationName, createdAt, expiresAt, files: Array<{ id, name, mimeType, sizeBytes, category, filePath, buffer }> }>
const shareRegistry = new Map();

const DEFAULT_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// Periodically clean up expired shares
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of shareRegistry.entries()) {
    if (session.expiresAt && now > session.expiresAt) {
      shareRegistry.delete(token);
    }
  }
}, 30 * 60 * 1000); // every 30 mins

/**
 * POST /api/share
 * Creates a secure share bundle
 */
async function createShareSession(req, res, next) {
  try {
    const { caseId, applicationName, expiryHours, files } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No files provided to create a share link.' },
      });
    }

    const token = crypto.randomBytes(16).toString('hex');
    const now = Date.now();
    const hours = Math.min(Math.max(parseInt(expiryHours, 10) || 24, 1), 72);
    const expiresAt = now + hours * 60 * 60 * 1000;

    const sharesDir = path.join(config.outputsDir, 'shares', token);
    await ensureDir(sharesDir);

    const storedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const fileId = f.id || `file_${i + 1}_${crypto.randomBytes(4).toString('hex')}`;
      const safeName = (f.name || `document_${i + 1}`).replace(/[^a-zA-Z0-9._\-\s]/g, '_');
      const mimeType = f.mimeType || 'application/octet-stream';
      const category = f.category || 'DOCUMENT';

      let filePath = null;
      let sizeBytes = f.sizeBytes || 0;

      if (f.base64Data) {
        const base64Clean = f.base64Data.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Clean, 'base64');
        filePath = path.join(sharesDir, safeName);
        await fsp.writeFile(filePath, buffer);
        sizeBytes = buffer.length;
      } else if (f.existingOutputFilename) {
        // Link to existing backend output file
        const srcPath = path.join(config.outputsDir, path.basename(f.existingOutputFilename));
        if (fs.existsSync(srcPath)) {
          filePath = srcPath;
          const stats = await fsp.stat(srcPath);
          sizeBytes = stats.size;
        }
      }

      storedFiles.push({
        id: fileId,
        name: safeName,
        mimeType,
        sizeBytes,
        category,
        filePath,
      });
    }

    shareRegistry.set(token, {
      caseId: caseId || 'CASE-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
      applicationName: applicationName || 'Document Verification Package',
      createdAt: now,
      expiresAt,
      files: storedFiles,
    });

    res.status(201).json({
      success: true,
      token,
      expiresAt: new Date(expiresAt).toISOString(),
      fileCount: storedFiles.length,
      caseId,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/share/:token
 * Returns metadata of files available in the share session
 */
async function getShareSession(req, res) {
  const { token } = req.params;

  if (!token || !shareRegistry.has(token)) {
    return res.status(404).json({
      success: false,
      error: { code: 'SHARE_NOT_FOUND', message: 'Share link not found or has expired.' },
    });
  }

  const session = shareRegistry.get(token);
  const now = Date.now();

  if (session.expiresAt && now > session.expiresAt) {
    shareRegistry.delete(token);
    return res.status(410).json({
      success: false,
      error: { code: 'SHARE_EXPIRED', message: 'This document share link has expired.' },
    });
  }

  // Public sanitized metadata only - NEVER expose filesystem paths or secrets
  const publicFiles = session.files.map((f) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    sizeBytes: f.sizeBytes,
    category: f.category,
    downloadUrl: `/api/share/${token}/download/${f.id}`,
  }));

  res.json({
    success: true,
    data: {
      token,
      caseId: session.caseId,
      applicationName: session.applicationName,
      createdAt: new Date(session.createdAt).toISOString(),
      expiresAt: new Date(session.expiresAt).toISOString(),
      files: publicFiles,
    },
  });
}

/**
 * GET /api/share/:token/download/:fileId
 * Streams a specific file for download
 */
async function downloadShareFile(req, res, next) {
  const { token, fileId } = req.params;

  if (!token || !shareRegistry.has(token)) {
    return res.status(404).send('Share link not found or expired.');
  }

  const session = shareRegistry.get(token);
  if (session.expiresAt && Date.now() > session.expiresAt) {
    shareRegistry.delete(token);
    return res.status(410).send('This share link has expired.');
  }

  const targetFile = session.files.find((f) => f.id === fileId);
  if (!targetFile || !targetFile.filePath || !fs.existsSync(targetFile.filePath)) {
    return res.status(404).send('File not found in this share package.');
  }

  res.setHeader('Content-Type', targetFile.mimeType || 'application/octet-stream');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${encodeURIComponent(targetFile.name)}"`
  );

  const stream = fs.createReadStream(targetFile.filePath);
  stream.on('error', next);
  stream.pipe(res);
}

module.exports = {
  createShareSession,
  getShareSession,
  downloadShareFile,
};
