/**
 * Dr. Doc Share & Mobile Transfer Controller
 * Manages 30-minute self-expiring share packages
 * Supports cross-lambda serverless & persistent disk caching
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// In-memory session store with 30-minute TTL
const shareSessions = new Map();

// Session TTL: 30 minutes in milliseconds
const SESSION_TTL_MS = 30 * 60 * 1000;

// Disk persistence directory for cross-request / serverless lambda caching
const SHARES_DIR = path.join(os.tmpdir(), 'dr_doc_shares');
try {
  if (!fs.existsSync(SHARES_DIR)) {
    fs.mkdirSync(SHARES_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not initialize shares dir:', e);
}

// Periodic cleanup of expired sessions
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of shareSessions.entries()) {
    if (now > session.expiresAt) {
      shareSessions.delete(id);
      try {
        const filePath = path.join(SHARES_DIR, `${id}.json`);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {}
    }
  }
}, 60 * 1000);

/**
 * Creates a new 30-minute share session
 * POST /api/share
 */
exports.createShareSession = (req, res) => {
  try {
    const { 
      shareId: incomingShareId,
      caseId = 'DR-DOC-CASE',
      applicantName = 'Applicant',
      readinessScore = 100,
      documents = [],
      hasMergedPdf = false,
      mergedPdfDataUrl = null,
      hasReport = false,
      reportData = null,
      customSettings = {},
      createdAt: incomingCreatedAt,
      expiresAt: incomingExpiresAt
    } = req.body;

    const shareId = incomingShareId || ('drshare_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36));
    const createdAt = incomingCreatedAt || Date.now();
    const expiresAt = incomingExpiresAt || (createdAt + SESSION_TTL_MS);

    const sessionData = {
      shareId,
      caseId,
      applicantName,
      readinessScore,
      documents,
      hasMergedPdf,
      mergedPdfDataUrl,
      hasReport,
      reportData,
      customSettings,
      createdAt,
      expiresAt
    };

    // Store in memory
    shareSessions.set(shareId, sessionData);

    // Persist to disk for serverless persistence across lambda instances
    try {
      if (!fs.existsSync(SHARES_DIR)) {
        fs.mkdirSync(SHARES_DIR, { recursive: true });
      }
      const filePath = path.join(SHARES_DIR, `${shareId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(sessionData), 'utf8');
    } catch (fsErr) {
      console.warn('Could not write share session to disk:', fsErr);
    }

    return res.status(201).json({
      success: true,
      data: {
        shareId,
        expiresAt,
        ttlMinutes: 30,
        documentCount: documents.length,
        hasMergedPdf,
        hasReport
      }
    });
  } catch (err) {
    console.error('Error creating share session:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to create share session' });
  }
};

/**
 * Retrieves an active share session by ID
 * GET /api/share/:shareId
 */
exports.getShareSession = (req, res) => {
  try {
    const { shareId } = req.params;
    let session = shareSessions.get(shareId);

    // If not in memory, try loading from disk (for Vercel serverless / cross-instance requests)
    if (!session) {
      try {
        const filePath = path.join(SHARES_DIR, `${shareId}.json`);
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf8');
          session = JSON.parse(raw);
          shareSessions.set(shareId, session);
        }
      } catch (fsErr) {
        console.warn('Could not read share session from disk:', fsErr);
      }
    }

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Share session not found or has expired',
        expired: true
      });
    }

    const now = Date.now();
    if (now > session.expiresAt) {
      shareSessions.delete(shareId);
      try {
        const filePath = path.join(SHARES_DIR, `${shareId}.json`);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {}
      return res.status(410).json({
        success: false,
        error: 'Share session expired. For security, Dr. Doc transfer QR codes are valid for 30 minutes.',
        expired: true
      });
    }

    const remainingSeconds = Math.max(0, Math.floor((session.expiresAt - now) / 1000));

    return res.status(200).json({
      success: true,
      data: {
        ...session,
        remainingSeconds,
        isExpired: false
      }
    });
  } catch (err) {
    console.error('Error fetching share session:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to retrieve share session' });
  }
};

/**
 * Deletes and revokes an active share session early
 * DELETE /api/share/:shareId
 */
exports.deleteShareSession = (req, res) => {
  try {
    const { shareId } = req.params;
    const existed = shareSessions.has(shareId);
    shareSessions.delete(shareId);

    try {
      const filePath = path.join(SHARES_DIR, `${shareId}.json`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (e) {}

    return res.status(200).json({
      success: true,
      message: 'Share session revoked and deleted successfully for security.',
      deleted: existed
    });
  } catch (err) {
    console.error('Error deleting share session:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to delete share session' });
  }
};


