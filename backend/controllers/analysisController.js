const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const asyncHandler = require('../utils/asyncHandler');
const { validateFile } = require('../utils/validators');
const { safeDelete } = require('../utils/fileHelpers');
const { performOcr, extractFieldsFromText } = require('../utils/ocrExtractor');

const ALLOWED_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.pdf'];

/**
 * POST /api/analyze
 * field: "file" (single image or PDF)
 * Performs document classification, deep OCR extraction, photo aging audit, and quality inspection.
 * Uses strict optical extraction with zero filename hallucination.
 */
const analyzeDocument = asyncHandler(async (req, res) => {
  const ext = validateFile(req.file, ALLOWED_EXTS, 'document file');
  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();

  let result;
  try {
    const fileBuffer = await fsp.readFile(req.file.path);
    const mimeType = req.file.mimetype || (ext === '.pdf' ? 'application/pdf' : 'image/jpeg');

    if (apiKey) {
      try {
        result = await analyzeWithGemini(fileBuffer, mimeType, apiKey);
      } catch (geminiErr) {
        console.warn('Gemini backend analysis failed, falling back to local OCR analysis:', geminiErr.message);
      }
    }

    if (!result) {
      result = await analyzeLocally(fileBuffer, ext, mimeType);
    }
  } finally {
    await safeDelete(req.file.path);
  }

  res.json({
    success: true,
    message: 'Document analysis complete',
    data: result,
  });
});

async function analyzeWithGemini(buffer, mimeType, apiKey) {
  const ai = new GoogleGenAI({ apiKey });
  const base64Data = buffer.toString('base64');
  const currentYear = new Date().getFullYear();

  const prompt = `
You are an expert document forensics and optical character recognition (OCR) engine examining an official credential or document image.
Current Year: ${currentYear}

CRITICAL SPATIAL & POSITIONAL PARAMETER RECOGNITION RULES:
Many official credentials (such as Indian Aadhaar, Driving License, PAN Card, Passport) DO NOT have explicit labels like "Name:" or "Address:" printed next to the data. You MUST recognize parameters based on their visual spatial placement and format:

1. PERSON FULL NAME ("applicantName"):
   - Locate the primary holder's full name (e.g. "Ved Nishad Gharat" or "Ved Gharat").
   - Position: Printed prominently below government/state header banners, adjacent to the portrait photograph, or directly above the Date of Birth line.
   - Extract the full name accurately even if no "Name:" label is present. Do NOT extract department headers or footer disclaimers as the name.

2. DATE OF BIRTH ("dob") & AGE ("calculatedAge"):
   - Extract Date of Birth in DD/MM/YYYY or DD-MM-YYYY format (e.g. "29/03/2008").
   - Distinguish DOB from Issue Date, Date of Application, or License Validity/Expiry dates.
   - Compute applicant's current age in years based on ${currentYear} (e.g. 18 years for 2008 birth year).

3. RESIDENTIAL ADDRESS ("address"):
   - Extract the complete multi-line address text even if no "Address:" label is present (e.g. "80 A Kamare Road Near Govt Boys Hostel Gram Navali Palghar, MH, 401404").
   - Recognize address by house/plot no, street, landmark, village/locality, district/city, state, and 6-digit postal PIN code.
   - If address is absent on single-sided credentials (e.g. front of Aadhaar), set to "Not detected".

4. GENDER ("gender"):
   - Extract "MALE", "FEMALE", or "TRANSGENDER" (including Devanagari "पुरुष" -> MALE, "महिला" -> FEMALE, or "M" / "F").

5. BLOOD GROUP ("bloodGroup"):
   - On Driving Licenses, extract the blood group (e.g. "O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"). If not applicable, omit or set to "Not detected".

6. DOCUMENT / ID NUMBER ("documentNumber"):
   - Extract the exact alphanumeric identifier:
     * Driving License: State code + RTO + Year + Digits (e.g. "MH48 20260023357" or "MH-4820260023357")
     * Aadhaar Card: 12-digit number (e.g. "2500 6999 1014")
     * PAN Card: 10-digit alphanumeric (e.g. "ABCDE1234F")
     * Passport: 8-digit passport number

7. ORIENTATION & DESKEW:
   - If the image is photographed sideways, rotated by 90°, 180°, or 270°, accurately read all text regardless of orientation.

Return strictly valid JSON only:
{
  "category": "IDENTITY" | "ADDRESS" | "BUSINESS" | "PERSONAL" | "UNKNOWN",
  "documentType": "Driving License" | "Aadhaar Card" | "PAN Card" | "Passport" | "Voter ID" | "Electricity Bill" | "Bank Statement" | "GST Certificate" | "Identity Document",
  "confidence": 95,
  "calculatedAge": 18,
  "photoAudit": {
    "hasPhoto": true,
    "estimatedPhotoAge": "young adult (18 years)",
    "ageMatch": true,
    "photoStatus": "VERIFIED_CURRENT",
    "photoFeedback": "Photo appearance is current and matches calculated age of 18 years."
  },
  "suggestedFilename": "DRIVING_LICENSE_VED_GHARAT.pdf",
  "quality": {
    "sharpness": 92,
    "textVisibility": 90,
    "lighting": 88,
    "cropping": 92,
    "overallScore": 91,
    "status": "GOOD",
    "feedbackLines": ["High legibility text", "All critical identity credentials detected"]
  },
  "extractedFields": [
    { "key": "applicantName", "label": "Full Name", "value": "Ved Nishad Gharat", "confidence": 96 },
    { "key": "documentNumber", "label": "Document Number", "value": "MH48 20260023357", "confidence": 98 },
    { "key": "dob", "label": "Date of Birth", "value": "29/03/2008", "confidence": 96 },
    { "key": "gender", "label": "Gender", "value": "MALE", "confidence": 95 },
    { "key": "bloodGroup", "label": "Blood Group", "value": "O+", "confidence": 95 },
    { "key": "address", "label": "Address", "value": "80 A Kamare Road Near Govt Boys Hostel Gram Navali Palghar, MH, 401404", "confidence": 92 }
  ],
  "rawOcrText": "...",
  "verificationStatus": "VERIFIED",
  "issues": []
}
`;

  const candidateModels = ['gemini-3-flash-preview', 'gemini-3.6-flash', 'gemini-3.1-pro-preview'];
  let lastError = null;
  let text = '';

  for (const model of candidateModels) {
    try {
      const apiCall = ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { mimeType, data: base64Data } },
              { text: prompt },
            ],
          },
        ],
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Timeout after 25000ms on ${model}`)), 25000)
      );

      const response = await Promise.race([apiCall, timeoutPromise]);
      text = typeof response.text === 'string' ? response.text : (response.text ? response.text() : '');
      if (text) break;
    } catch (err) {
      lastError = err;
      console.warn(`Analysis model ${model} failed: ${err.message}, trying next...`);
    }
  }

  if (!text) {
    throw lastError || new Error('All Gemini candidate models failed');
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No valid JSON in Gemini response');

  return JSON.parse(jsonMatch[0]);
}

async function analyzeLocally(buffer, ext, mimeType) {
  const { performMultiPassOcr } = require('../utils/ocrExtractor');
  
  // 1. Run multi-pass preprocessing, optical character recognition & physical auto-rotation
  const ocrRes = await performMultiPassOcr(buffer, ext, mimeType);
  const parsed = ocrRes.parsedFields;
  
  return {
    ...parsed,
    detectedOrientation: ocrRes.detectedOrientation,
    orientationAngle: ocrRes.orientationAngle,
    orientationLabel: ocrRes.orientationLabel,
    correctedPreviewUrl: ocrRes.correctedBase64,
  };
}

module.exports = {
  analyzeDocument,
};
