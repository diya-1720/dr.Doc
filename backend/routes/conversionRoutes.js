const express = require('express');
const upload = require('../middleware/upload');
const config = require('../utils/config');
const conversionController = require('../controllers/conversionController');

const router = express.Router();

router.post('/image-to-pdf', upload.single('file'), conversionController.imageToPdf);
router.post(
  '/images-to-pdf',
  upload.array('files', config.maxFiles),
  conversionController.imagesToPdf
);
router.post('/txt-to-pdf', upload.single('file'), conversionController.txtToPdf);
router.post('/pdf-to-txt', upload.single('file'), conversionController.pdfToTxt);
router.post('/image-format', upload.single('file'), conversionController.imageFormat);

module.exports = router;
