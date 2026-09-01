const express = require('express');
const upload = require('../middleware/upload');
const compressionController = require('../controllers/compressionController');

const router = express.Router();

router.post('/pdf', upload.single('file'), compressionController.compressPdf);
router.post('/image', upload.single('file'), compressionController.compressImage);

module.exports = router;
