require('dotenv').config();
const path = require('path');
const os = require('os');

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  frontendUrl: process.env.FRONTEND_URL || '*',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 25 * 1024 * 1024, // 25MB
  maxFiles: parseInt(process.env.MAX_FILES, 10) || 20,
  uploadsDir: isServerless
    ? path.join(os.tmpdir(), 'dr-doc-uploads')
    : path.join(__dirname, '..', 'uploads'),
  outputsDir: isServerless
    ? path.join(os.tmpdir(), 'dr-doc-outputs')
    : path.join(__dirname, '..', 'outputs'),
};

module.exports = config;
