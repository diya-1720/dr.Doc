const express = require('express');
const router = express.Router();
const {
  createShareSession,
  getShareSession,
  downloadShareFile,
} = require('../controllers/shareController');

// Create a new secure share bundle
router.post('/', createShareSession);

// Get public metadata for a share token
router.get('/:token', getShareSession);

// Download an individual file from the share bundle
router.get('/:token/download/:fileId', downloadShareFile);

module.exports = router;
