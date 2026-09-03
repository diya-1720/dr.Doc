const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

// Create a new 30-minute share session
router.post('/', shareController.createShareSession);

// Retrieve active share session
router.get('/:shareId', shareController.getShareSession);

// Delete / Revoke active share session early
router.delete('/:shareId', shareController.deleteShareSession);

module.exports = router;
