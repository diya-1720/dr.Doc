const multer = require('multer');
const config = require('../utils/config');

// Files are buffered on disk in uploads/ with randomized names.
// Multer's own disk storage handles the "unique filename" requirement
// so two simultaneous uploads never collide; our conversion services
// generate their own unique names for OUTPUT files separately.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = require('path').extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

// Extension-level allowlist at the Multer layer. This is a first,
// cheap line of defense; the validators module does the stricter
// extension+MIME cross-check afterwards inside each controller.
const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.txt',
]);

function fileFilter(req, file, cb) {
  const ext = require('path').extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', `Unsupported file type: ${ext}`));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
    files: config.maxFiles,
  },
});

module.exports = upload;
