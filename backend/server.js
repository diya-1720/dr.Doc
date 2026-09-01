const express = require('express');
const cors = require('cors');
const path = require('path');

const config = require('./utils/config');
const { ensureDir } = require('./utils/fileHelpers');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { runClassification, PRIVACY_INFO } = require('../lib/classify');

const healthRoutes = require('./routes/healthRoutes');
const conversionRoutes = require('./routes/conversionRoutes');
const compressionRoutes = require('./routes/compressionRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const crossCheckRoutes = require('./routes/crossCheckRoutes');

const app = express();

// --- Middleware ---
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, serverless) or any matching configured origin
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// --- Static download route for processed outputs ---
app.use('/downloads', express.static(config.outputsDir));

// --- API routes ---
app.use('/api/health', healthRoutes);
app.use('/api/convert', conversionRoutes);
app.use('/api/compress', compressionRoutes);
app.use('/api/analyze', analysisRoutes);
app.use('/api/cross-check', crossCheckRoutes);
app.use('/api/crosscheck', crossCheckRoutes);

// --- Gemini Proxy & Privacy routes ---
app.get('/api/privacy', (_req, res) => {
  res.json({ success: true, ...PRIVACY_INFO });
});

app.post('/api/classify', async (req, res) => {
  try {
    const result = await runClassification(req.body || {});
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('Gemini SDK error:', err.status || 500, err.message);
    res.status(err.status || 500).json({ success: false, error: { message: err.message } });
  }
});

// --- 404 + error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await ensureDir(config.uploadsDir);
  await ensureDir(config.outputsDir);

  if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    app.listen(config.port, () => {
      console.log(`DR. DOC Backend listening at http://localhost:${config.port}`);
      console.log(`Allowed CORS: ${config.frontendUrl}`);
    });
  }
}

start();

module.exports = app;
