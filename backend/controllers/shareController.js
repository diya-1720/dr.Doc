/**
 * Dr. Doc Share & Mobile Transfer Controller
 * Manages 30-minute self-expiring share packages
 */

// In-memory session store with 30-minute TTL
const shareSessions = new Map();

// Session TTL: 30 minutes in milliseconds
const SESSION_TTL_MS = 30 * 60 * 1000;

// Periodic cleanup of expired sessions
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of shareSessions.entries()) {
    if (now > session.expiresAt) {
      shareSessions.delete(id);
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
      caseId = 'DR-DOC-CASE',
      applicantName = 'Applicant',
      readinessScore = 100,
      documents = [],
      hasMergedPdf = false,
      mergedPdfDataUrl = null,
      hasReport = false,
      reportData = null,
      customSettings = {}
    } = req.body;

    const shareId = 'drshare_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const createdAt = Date.now();
    const expiresAt = createdAt + SESSION_TTL_MS;

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

    shareSessions.set(shareId, sessionData);

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
    const session = shareSessions.get(shareId);

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

