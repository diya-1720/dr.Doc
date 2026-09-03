const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

// Admin Credentials as specified by user
const ADMIN_USER = 'admin@1234';
const ADMIN_PASS = '12345678';
const ADMIN_TOKEN = 'dr_doc_sec_adm_' + Buffer.from('admin@1234:12345678').toString('base64');

/**
 * Path helpers for .env files
 */
const rootEnvPath = path.resolve(__dirname, '../../.env');
const backendEnvPath = path.resolve(__dirname, '../.env');

/**
 * Mask API Key for safe display (e.g. AIzaSy...9A2Z)
 */
function maskKey(key) {
  if (!key || key.length < 8) return 'Not configured';
  const first4 = key.substring(0, 6);
  const last4 = key.substring(key.length - 4);
  return `${first4}...${last4}`;
}

/**
 * Saves/updates key in a .env file
 */
function updateEnvFile(filePath, newKey) {
  try {
    let content = '';
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf-8');
    }

    // Update or add GEMINI_API_KEY
    if (/^GEMINI_API_KEY=.*$/m.test(content)) {
      content = content.replace(/^GEMINI_API_KEY=.*$/m, `GEMINI_API_KEY=${newKey}`);
    } else {
      content += (content.endsWith('\n') || content === '' ? '' : '\n') + `GEMINI_API_KEY=${newKey}\n`;
    }

    // Update or add VITE_GEMINI_API_KEY
    if (/^VITE_GEMINI_API_KEY=.*$/m.test(content)) {
      content = content.replace(/^VITE_GEMINI_API_KEY=.*$/m, `VITE_GEMINI_API_KEY=${newKey}`);
    } else {
      content += (content.endsWith('\n') ? '' : '\n') + `VITE_GEMINI_API_KEY=${newKey}\n`;
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (err) {
    console.warn(`Could not update .env file at ${filePath}:`, err.message);
    return false;
  }
}

/**
 * Authenticates Admin
 * POST /api/admin/login
 */
exports.login = (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return res.status(200).json({
        success: true,
        message: 'Admin authenticated successfully',
        token: ADMIN_TOKEN
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid admin username or password'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Gets Current API Key Status
 * GET /api/admin/api-key
 */
exports.getApiKeyStatus = (req, res) => {
  try {
    const key = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
    const isConfigured = Boolean(key && key.length > 5);

    return res.status(200).json({
      success: true,
      data: {
        isConfigured,
        maskedKey: maskKey(key),
        source: process.env.GEMINI_API_KEY ? 'Environment / .env' : 'Unset'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Updates Gemini API Key in runtime & .env files
 * POST /api/admin/api-key
 */
exports.updateApiKey = (req, res) => {
  try {
    const { apiKey } = req.body || {};

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid Gemini API Key string'
      });
    }

    const cleanKey = apiKey.trim();

    // 1. Update runtime Node.js process environment
    process.env.GEMINI_API_KEY = cleanKey;
    process.env.VITE_GEMINI_API_KEY = cleanKey;

    // 2. Persist to root .env and backend/.env
    const savedRoot = updateEnvFile(rootEnvPath, cleanKey);
    const savedBackend = updateEnvFile(backendEnvPath, cleanKey);

    return res.status(200).json({
      success: true,
      message: 'Gemini API Key updated successfully in runtime and persistent configuration',
      data: {
        maskedKey: maskKey(cleanKey),
        persisted: savedRoot || savedBackend
      }
    });
  } catch (err) {
    console.error('Error updating Gemini API Key:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Tests Key against Google GenAI models for connectivity & quota
 * POST /api/admin/api-key/test
 */
exports.testApiKey = async (req, res) => {
  try {
    const keyToTest = (req.body?.apiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();

    if (!keyToTest) {
      return res.status(400).json({
        success: false,
        error: 'No API key provided or configured to test'
      });
    }

    const ai = new GoogleGenAI({ apiKey: keyToTest });
    const candidateModels = ['gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-1.5-flash'];
    let successfulModel = null;
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: 'Respond strictly with the word: OK'
        });
        if (response && response.text) {
          successfulModel = model;
          break;
        }
      } catch (err) {
        lastError = err;
      }
    }

    if (successfulModel) {
      return res.status(200).json({
        success: true,
        message: `Gemini API Key verified and active! Responded via ${successfulModel}.`,
        model: successfulModel,
        status: 'HEALTHY'
      });
    }

    const errMsg = lastError?.message || 'Gemini API call failed';
    const isQuotaError = errMsg.includes('429') || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate limit') || errMsg.toLowerCase().includes('resource_exhausted');

    return res.status(400).json({
      success: false,
      error: isQuotaError ? 'Gemini Quota Exceeded (HTTP 429) - Please provide a new API key.' : `Gemini Error: ${errMsg}`,
      isQuotaError
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
