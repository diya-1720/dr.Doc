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

STRICT FORENSIC & ZERO-HALLUCINATION RULES:
1. Extract information EXCLUSIVELY from the actual text optically visible on THIS specific document.
2. NEVER guess, assume, fabricate, or hallucinate any field values.
3. If a field (Full Name, Date of Birth, Document ID Number, Gender, Address) is NOT clearly readable on the document, set its value to "Not detected".
4. Do NOT use filename, metadata, or previous document values.

SPATIAL & POSITIONAL PARAMETER RECOGNITION:
Many official credentials (such as Indian Aadhaar, Driving License, PAN Card, Passport) DO NOT have explicit labels like "Name:" or "Address:" printed next to the data. Recognize parameters based on visual placement:

1. PERSON FULL NAME ("applicantName"):
   - Locate and extract the primary holder's full name exactly as printed on the document.
   - Position: Prominently printed below government/state header banners, adjacent to the portrait photograph, or directly above Date of Birth.
   - CRITICAL: NEVER extract the residential address, street name, house number, village, taluka, district, state, or PIN code as the person's full name. On Driving Licenses, the name is printed next to or below DL No and BEFORE Father/Spouse name (S/W/D) or DOB. The multi-line address at the bottom belongs to the 'address' field, NEVER 'applicantName'.
   - Do NOT extract department headers, issuing authority names, or footer disclaimers as the person's name.

2. DATE OF BIRTH ("dob") & AGE ("calculatedAge"):
   - Read the EXACT digits printed for the Date of Birth (DOB) field or adjacent to the DOB / birth label.
   - CRITICAL: Never guess, alter, or hallucinate date digits. Read '20' as '20', '29' as '29', '0' as '0', '9' as '9' strictly as rendered on the document image.
   - Distinguish Date of Birth (DOB) from Date of Issue (DOI) or Validity/Expiry dates by reading the specific label and field position.
   - Extract Date of Birth in DD/MM/YYYY format as printed.
   - Compute applicant's current age in years based on ${currentYear} if birth year is present.

3. RESIDENTIAL ADDRESS ("address"):
   - Extract complete residential address text when present (e.g. house/flat no, street, landmark, locality/village, city/district, state, and 6-digit postal PIN code).
   - If address is absent on single-sided credentials, set to "Not detected".

4. GENDER ("gender"):
   - Extract "MALE", "FEMALE", or "TRANSGENDER" (including regional language indicators like "पुरुष" -> MALE, "महिला" -> FEMALE, or "M" / "F").

5. BLOOD GROUP ("bloodGroup"):
   - If printed (e.g. on Driving License: "O+", "A+", "B+", "AB+", etc.), extract it. Otherwise omit or set to "Not detected".

6. DOCUMENT / ID NUMBER ("documentNumber"):
   - Extract exact alphanumeric identifier as printed:
     * Driving License: State code + RTO + Year + Digits
     * Aadhaar Card: 12-digit number or VID
     * PAN Card: 10-digit alphanumeric
     * Passport: Passport number
     * Voter ID: EPIC number
     * Utility/Bank: Account/Consumer number

7. ORIENTATION & DESKEW:
   - If the image is photographed sideways or rotated, accurately read all text regardless of orientation.

Return strictly valid JSON only:
{
  "category": "IDENTITY" | "ADDRESS" | "BUSINESS" | "PERSONAL" | "UNKNOWN",
  "documentType": "Driving License" | "Aadhaar Card" | "PAN Card" | "Passport" | "Voter ID" | "Electricity Bill" | "Bank Statement" | "GST Certificate" | "Identity Document",
  "confidence": 95,
  "calculatedAge": 25,
  "photoAudit": {
    "hasPhoto": true,
    "estimatedPhotoAge": "adult",
    "ageMatch": true,
    "photoStatus": "VERIFIED_CURRENT" | "OUTDATED_RECOMMEND_UPDATE" | "NOT_APPLICABLE",
    "photoFeedback": "Photo appearance is current and matches calculated age."
  },
  "suggestedFilename": "STANDARDIZED_FILENAME.pdf",
  "quality": {
    "sharpness": 90,
    "textVisibility": 90,
    "lighting": 88,
    "cropping": 90,
    "overallScore": 90,
    "status": "GOOD",
    "feedbackLines": ["High legibility text", "Critical identity credentials detected"]
  },
  "extractedFields": [
    { "key": "applicantName", "label": "Full Name", "value": "<EXTRACTED_FULL_NAME_OR_NOT_DETECTED>", "confidence": 95 },
    { "key": "documentNumber", "label": "Document Number", "value": "<EXTRACTED_DOC_NUMBER_OR_NOT_DETECTED>", "confidence": 95 },
    { "key": "dob", "label": "Date of Birth", "value": "<EXTRACTED_DOB_OR_NOT_DETECTED>", "confidence": 95 },
    { "key": "gender", "label": "Gender", "value": "<EXTRACTED_GENDER_OR_NOT_DETECTED>", "confidence": 95 },
    { "key": "address", "label": "Address", "value": "<EXTRACTED_ADDRESS_OR_NOT_DETECTED>", "confidence": 90 }
  ],
  "rawOcrText": "<EXTRACTED_RAW_OCR_TEXT>",
  "verificationStatus": "VERIFIED" | "NEEDS REVIEW" | "REJECTED" | "UNIDENTIFIED",
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
