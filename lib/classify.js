const { GoogleGenAI } = require('@google/genai');

const PRIVACY_INFO = {
  storage: 'None. Documents are processed in memory and temporary buffers, never stored in a database or disk permanently.',
  logging: 'No document text, images, or API keys are logged.',
  thirdParties: 'Sent only to Google Gemini API when configured.',
  retention: '0 days. Ephemeral request lifecycle only.',
};

/**
 * Execute document classification and extraction via official Gemini SDK
 */
async function runClassification({ apiKey, model = 'gemini-3.6-flash', systemInstruction, contents, generationConfig }) {
  const effectiveKey = (apiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();
  if (!effectiveKey) {
    const err = new Error('Missing Gemini API key. Please configure GEMINI_API_KEY in environment variables.');
    err.status = 400;
    throw err;
  }
  if (!contents) {
    const err = new Error('Missing contents in classification request.');
    err.status = 400;
    throw err;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: effectiveKey });
    const result = await ai.models.generateContent({
      model: model || 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: generationConfig && generationConfig.temperature,
        responseMimeType: generationConfig && generationConfig.responseMimeType,
        responseSchema: generationConfig && generationConfig.responseSchema,
      },
    });

    const text = typeof result.text === 'string' ? result.text : (result.text ? result.text() : '');
    return { text };
  } catch (err) {
    const status = (err && (err.status || err.httpStatus)) || 500;
    const message = (err && err.message) ? err.message : 'Error calling Gemini via SDK.';
    const wrapped = new Error(message);
    wrapped.status = status;
    throw wrapped;
  }
}

module.exports = {
  runClassification,
  PRIVACY_INFO,
};
