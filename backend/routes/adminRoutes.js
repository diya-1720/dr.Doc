const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin Authentication
router.post('/login', adminController.login);

// Get API Key Status
router.get('/api-key', adminController.getApiKeyStatus);

// Update API Key
router.post('/api-key', adminController.updateApiKey);

// Test API Key Connectivity & Quota
router.post('/api-key/test', adminController.testApiKey);

module.exports = router;
