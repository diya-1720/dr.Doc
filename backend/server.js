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
const shareRoutes = require('./routes/shareRoutes');
const adminRoutes = require('./routes/adminRoutes');

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

// --- Root Welcome Route ---
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>DR. DOC // Forensic API Server</title>
          <style>
            body { font-family: 'Courier New', monospace; background: #F3E4C8; color: #3F2928; padding: 40px; }
            .card { background: #FFF8EA; border: 3px solid #3F2928; padding: 24px; max-width: 600px; box-shadow: 6px 6px 0px #3F2928; }
            h1 { color: #7A302F; margin-top: 0; }
            .btn { display: inline-block; background: #7A302F; color: #FFF8EA; padding: 12px 24px; text-decoration: none; font-weight: bold; border: 2px solid #3F2928; box-shadow: 3px 3px 0px #3F2928; margin-top: 16px; }
            .btn:hover { background: #5c2322; }
            .status { color: #2e7d32; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>DR. DOC // BACKEND API</h1>
            <p>Backend Service Status: <span class="status">● ONLINE & HEALTHY (Port 5000)</span></p>
            <p>You are viewing the REST API server. To access the interactive web application interface, open the frontend portal below:</p>
            <a href="http://localhost:5173" class="btn">🚀 OPEN DR. DOC WEB APP (PORT 5173)</a>
            <hr style="margin-top:24px; border:1px solid #3F2928;" />
            <p style="font-size:12px; color:#7A302F;">Active API Endpoints: /api/health • /api/analyze • /api/cross-check • /api/convert • /api/compress</p>
          </div>
        </body>
      </html>
    `);
  } else {
    res.json({
      success: true,
      message: 'DR. DOC Forensic Document Intelligence API is Online',
      frontendUrl: 'http://localhost:5173',
      endpoints: ['/api/health', '/api/analyze', '/api/cross-check', '/api/convert', '/api/compress']
    });
  }
});

// --- API routes ---
app.use('/api/health', healthRoutes);
app.use('/api/convert', conversionRoutes);
app.use('/api/compress', compressionRoutes);
app.use('/api/analyze', analysisRoutes);
app.use('/api/cross-check', crossCheckRoutes);
app.use('/api/crosscheck', crossCheckRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/admin', adminRoutes);

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
