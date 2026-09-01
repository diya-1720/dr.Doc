const express = require('express');
const upload = require('../middleware/upload');
const crossCheckController = require('../controllers/crossCheckController');

const router = express.Router();

// Accepts either { file1, file2 } or array of files under { files }
router.post(
  '/',
  upload.fields([
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 1 },
    { name: 'files', maxCount: 2 },
  ]),
  crossCheckController.crossCheckDocuments
);

module.exports = router;
