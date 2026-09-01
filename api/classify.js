const { runClassification } = require('../lib/classify');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: { message: 'Method not allowed.' } });
    return;
  }

  try {
    const result = await runClassification(req.body || {});
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('Gemini SDK error:', err.status || 500, err.message);
    res.status(err.status || 500).json({ success: false, error: { message: err.message } });
  }
};
