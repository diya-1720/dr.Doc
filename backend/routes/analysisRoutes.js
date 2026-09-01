const express = require('express');
const upload = require('../middleware/upload');
const analysisController = require('../controllers/analysisController');

const router = express.Router();

router.post('/', upload.single('file'), analysisController.analyzeDocument);

module.exports = router;
