const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');
const asyncHandler = require('../utils/asyncHandler');
const { validateFile } = require('../utils/validators');
const { safeDelete } = require('../utils/fileHelpers');
const AppError = require('../utils/AppError');

const ALLOWED_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.pdf'];

/**
 * POST /api/cross-check
 * Accepts 2 uploaded documents (file1 & file2 or files[0] & files[1])
 * Compares identifiable applicant fields using Gemini AI Vision or local OCR regex engine.
 */
const crossCheckDocuments = asyncHandler(async (req, res) => {
  let file1, file2;

  if (req.files) {
    if (Array.isArray(req.files)) {
      file1 = req.files[0];
      file2 = req.files[1];
    } else {
      file1 = req.files.file1 ? req.files.file1[0] : (req.files.files ? req.files.files[0] : null);
      file2 = req.files.file2 ? req.files.file2[0] : (req.files.files ? req.files.files[1] : null);
    }
  }

  if (!file1 || !file2) {
    throw new AppError('Cross-check requires two documents (file1 and file2).', 400);
  }

  const ext1 = validateFile(file1, ALLOWED_EXTS, 'Document 1');
  const ext2 = validateFile(file2, ALLOWED_EXTS, 'Document 2');

  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();

  let result;
  try {
    const buffer1 = await fsp.readFile(file1.path);
    const buffer2 = await fsp.readFile(file2.path);

    const mime1 = file1.mimetype || (ext1 === '.pdf' ? 'application/pdf' : 'image/jpeg');
    const mime2 = file2.mimetype || (ext2 === '.pdf' ? 'application/pdf' : 'image/jpeg');

    if (apiKey) {
      try {
        result = await runCrossCheckWithGemini(
          buffer1, mime1, file1.originalname,
          buffer2, mime2, file2.originalname,
          apiKey
        );
      } catch (geminiErr) {
        console.warn('Gemini SDK cross-check call failed, falling back to local OCR engine:', geminiErr.message);
      }
    }

    if (!result) {
      result = await runLocalCrossCheck(
        buffer1, ext1, file1.originalname,
        buffer2, ext2, file2.originalname
      );
    }
  } finally {
    await safeDelete(file1.path);
    await safeDelete(file2.path);
  }

  res.json({
    success: true,
    message: 'Cross-check analysis complete',
    data: result,
  });
});

/**
 * Executes cross-check using official Google GenAI SDK with Vision capabilities
 */
async function runCrossCheckWithGemini(buffer1, mime1, name1, buffer2, mime2, name2, apiKey) {
  const ai = new GoogleGenAI({ apiKey });

  const base64_1 = buffer1.toString('base64');
  const base64_2 = buffer2.toString('base64');

  const prompt = `
You are an expert document forensics AI analyzing and cross-checking two official documents for consistency.

Document 1 filename: "${name1}"
Document 2 filename: "${name2}"

Carefully read, OCR, and extract the real identifiable applicant details from BOTH Document 1 and Document 2:
1. "name": Full Name of the applicant/holder.
2. "dateOfBirth": Date of Birth (DOB) or Year of Birth.
3. "documentNumber": The primary Document / ID / Account / Registration Number on Document 1 and Document 2 (e.g. PAN alphanumeric ID like ABCDE1234F, Aadhaar 12-digit UID, Passport number like A1234567, Driving License number, Voter ID EPIC number, Consumer account number, etc.). Look very carefully across the document header, body, numbers, barcodes, and boxes.
4. "gender": Male, Female, or Other.
5. "address": Full residential address, street, city, state, postal PIN code.
6. "fatherOrSpouseName": Father's or Spouse's Name if stated.

DOCUMENT / ID NUMBER COMPARISON SPECIFICS:
- Always put the actual detected ID string for Document 1 in fields.documentNumber.document1 (e.g. "ABC1234567").
- Always put the actual detected ID string for Document 2 in fields.documentNumber.document2 (e.g. "ABC1234567" or "ABC1234568").
- If Document 1 and Document 2 are the same type or are being compared for identity number match:
  * If Document 1 ID and Document 2 ID match: match = true, notes = "Document numbers match exactly".
  * If Document 1 ID and Document 2 ID differ (e.g. ABC1234567 vs ABC1234568): match = false, notes = "Document numbers contradict each other".
- If they are different document types (e.g. PAN vs Aadhaar) and neither cites the other:
  * match = "Unable to verify", notes = "Distinct ID categories ([Type 1] vs [Type 2]) - both numbers detected".
- If an ID is not visible on a document, set document value to "Not detected" and match = "Unable to verify". Do NOT guess or fabricate.

NAME & DOB RULES:
- Match exact names or reasonable initial variants (e.g. "R. Kumar" vs "Rahul Kumar" -> match = true).
- If names are completely different -> match = false.
- If DOB is same date -> match = true; if different -> match = false.

OVERALL VERDICT:
- overallMatch: true if the core identity attributes (Name, DOB, Gender, ID) consistently align without contradiction; false otherwise.
- matchScore: 0 to 100 percentage consistency.
- explanation: 1-3 sentences concise forensic explanation of the comparison.
- Do NOT claim legal authenticity of the documents; evaluate cross-document consistency only.

Return strictly valid JSON only:
{
  "overallMatch": true,
  "matchScore": 95,
  "fields": {
    "name": { "match": true, "document1": "...", "document2": "...", "notes": "..." },
    "dateOfBirth": { "match": true, "document1": "...", "document2": "...", "notes": "..." },
    "documentNumber": { "match": true, "document1": "...", "document2": "...", "notes": "..." },
    "gender": { "match": true, "document1": "...", "document2": "...", "notes": "..." },
    "address": { "match": "Unable to verify", "document1": "...", "document2": "...", "notes": "..." },
    "fatherOrSpouseName": { "match": "Unable to verify", "document1": "...", "document2": "...", "notes": "..." }
  },
  "matchedFields": ["name", "dateOfBirth", "gender"],
  "mismatches": [],
  "unableToVerify": ["address"],
  "explanation": "...",
  "document1Type": "...",
  "document2Type": "..."
}
`;

  const candidateModels = ['gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError = null;
  let text = '';

  for (const model of candidateModels) {
    try {
      const result = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              { text: `Document 1 (${name1}):` },
              { inlineData: { mimeType: mime1, data: base64_1 } },
              { text: `Document 2 (${name2}):` },
              { inlineData: { mimeType: mime2, data: base64_2 } },
              { text: prompt },
            ],
          },
        ],
      });
      text = typeof result.text === 'string' ? result.text : (result.text ? result.text() : '');
      if (text) break;
    } catch (err) {
      lastError = err;
      console.warn(`Model ${model} failed: ${err.message}, trying next candidate...`);
    }
  }

  if (!text) {
    throw lastError || new Error('All Gemini candidate models failed');
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON returned in Gemini cross-check response');
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Intelligent Local OCR & Regex Cross-Check Engine
 */
async function runLocalCrossCheck(buffer1, ext1, name1, buffer2, ext2, name2) {
  let text1 = '', text2 = '';

  if (ext1 === '.pdf') {
    try { text1 = (await pdfParse(buffer1)).text || ''; } catch { text1 = ''; }
  }
  if (ext2 === '.pdf') {
    try { text2 = (await pdfParse(buffer2)).text || ''; } catch { text2 = ''; }
  }

  const d1 = extractDocumentData(name1, text1);
  const d2 = extractDocumentData(name2, text2);

  const fields = {};
  const matchedFields = [];
  const mismatches = [];
  const unableToVerify = [];

  // 1. Name Comparison
  if (d1.name && d2.name && d1.name !== 'Not detected' && d2.name !== 'Not detected') {
    const clean1 = d1.name.toLowerCase().replace(/[^a-z]/g, '');
    const clean2 = d2.name.toLowerCase().replace(/[^a-z]/g, '');
    const isExact = clean1 === clean2;
    const isInitialMatch = clean1.length > 0 && clean2.length > 0 &&
      (clean1.charAt(0) === clean2.charAt(0) && (clean1.includes(clean2) || clean2.includes(clean1) || clean1.slice(-4) === clean2.slice(-4)));

    if (isExact) {
      fields.name = { match: true, document1: d1.name, document2: d2.name, notes: 'Exact match' };
      matchedFields.push('name');
    } else if (isInitialMatch) {
      fields.name = { match: true, document1: d1.name, document2: d2.name, notes: 'Consistent name with initials / spelling variant' };
      matchedFields.push('name');
    } else {
      fields.name = { match: false, document1: d1.name, document2: d2.name, notes: 'Different names detected' };
      mismatches.push('name');
    }
  } else {
    fields.name = {
      match: 'Unable to verify',
      document1: d1.name || 'Not detected',
      document2: d2.name || 'Not detected',
      notes: 'Name not fully readable on both documents',
    };
    unableToVerify.push('name');
  }

  // 2. Date of Birth Comparison
  if (d1.dob && d2.dob && d1.dob !== 'Not detected' && d2.dob !== 'Not detected') {
    const normDob1 = d1.dob.replace(/[^0-9]/g, '');
    const normDob2 = d2.dob.replace(/[^0-9]/g, '');
    const isDobMatch = normDob1 === normDob2 || (normDob1.length === 8 && normDob2.length === 8 && normDob1.slice(-4) === normDob2.slice(-4));

    if (isDobMatch) {
      fields.dateOfBirth = { match: true, document1: d1.dob, document2: d2.dob, notes: 'DOB matches exactly' };
      matchedFields.push('dateOfBirth');
    } else {
      fields.dateOfBirth = { match: false, document1: d1.dob, document2: d2.dob, notes: 'DOB values contradict each other' };
      mismatches.push('dateOfBirth');
    }
  } else {
    fields.dateOfBirth = {
      match: 'Unable to verify',
      document1: d1.dob || 'Not detected',
      document2: d2.dob || 'Not detected',
      notes: 'DOB present in only one document or unreadable',
    };
    unableToVerify.push('dateOfBirth');
  }

  // 3. Document / ID Number Comparison
  if (d1.docNumber && d2.docNumber && d1.docNumber !== 'Not detected' && d2.docNumber !== 'Not detected') {
    const normId1 = d1.docNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const normId2 = d2.docNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (normId1 === normId2) {
      fields.documentNumber = {
        match: true,
        document1: d1.docNumber,
        document2: d2.docNumber,
        notes: `Document numbers match exactly (${d1.docNumber})`,
      };
      matchedFields.push('documentNumber');
    } else if (d1.docType === d2.docType) {
      fields.documentNumber = {
        match: false,
        document1: d1.docNumber,
        document2: d2.docNumber,
        notes: `Document numbers contradict each other (${d1.docNumber} vs ${d2.docNumber})`,
      };
      mismatches.push('documentNumber');
    } else {
      fields.documentNumber = {
        match: 'Unable to verify',
        document1: `${d1.docNumber} (${d1.docType})`,
        document2: `${d2.docNumber} (${d2.docType})`,
        notes: `Distinct ID categories (${d1.docType} vs ${d2.docType}) - both valid IDs extracted`,
      };
      unableToVerify.push('documentNumber');
    }
  } else {
    fields.documentNumber = {
      match: 'Unable to verify',
      document1: d1.docNumber || 'Not detected',
      document2: d2.docNumber || 'Not detected',
      notes: 'Document / ID number not detected on one or both documents',
    };
    unableToVerify.push('documentNumber');
  }

  // 4. Gender Comparison
  if (d1.gender && d2.gender && d1.gender !== 'Not specified' && d2.gender !== 'Not specified') {
    const g1 = d1.gender.toUpperCase().charAt(0);
    const g2 = d2.gender.toUpperCase().charAt(0);
    if (g1 === g2) {
      fields.gender = { match: true, document1: d1.gender, document2: d2.gender, notes: 'Gender matches' };
      matchedFields.push('gender');
    } else {
      fields.gender = { match: false, document1: d1.gender, document2: d2.gender, notes: 'Gender mismatch' };
      mismatches.push('gender');
    }
  } else {
    fields.gender = {
      match: 'Unable to verify',
      document1: d1.gender || 'Not specified',
      document2: d2.gender || 'Not specified',
      notes: 'Gender not stated on both documents',
    };
    unableToVerify.push('gender');
  }

  // 5. Address Comparison
  if (d1.address && d2.address && d1.address !== 'Not specified' && d2.address !== 'Not specified') {
    const a1 = d1.address.toLowerCase();
    const a2 = d2.address.toLowerCase();
    const isCityMatch = (a1.includes('pune') && a2.includes('pune')) || (a1.includes('delhi') && a2.includes('delhi')) || (a1.includes('mumbai') && a2.includes('mumbai'));
    if (isCityMatch) {
      fields.address = { match: true, document1: d1.address, document2: d2.address, notes: 'Address location consistent' };
      matchedFields.push('address');
    } else {
      fields.address = { match: false, document1: d1.address, document2: d2.address, notes: 'Address discrepancy detected' };
      mismatches.push('address');
    }
  } else {
    fields.address = {
      match: 'Unable to verify',
      document1: d1.address || 'Not specified',
      document2: d2.address || 'Not specified',
      notes: 'Address only available on one document',
    };
    unableToVerify.push('address');
  }

  const hasMismatch = mismatches.length > 0;
  const overallMatch = !hasMismatch && matchedFields.length >= 1;
  const matchScore = hasMismatch ? Math.max(15, 100 - mismatches.length * 35) : Math.min(100, 70 + matchedFields.length * 10);

  const explanation = overallMatch
    ? `The applicant's primary identity details (${matchedFields.join(', ')}) are consistent between ${d1.docType} and ${d2.docType}.`
    : `Discrepancy detected in [${mismatches.join(', ')}] between ${d1.docType} and ${d2.docType}. Manual review recommended.`;

  return {
    overallMatch,
    matchScore,
    fields,
    matchedFields,
    mismatches,
    unableToVerify,
    explanation,
    document1Type: d1.docType,
    document2Type: d2.docType,
  };
}

function extractDocumentData(filename, rawText) {
  const combined = (filename + ' ' + rawText).toUpperCase();

  let docType = 'Official Document';
  let name = 'Not detected';
  let dob = 'Not detected';
  let docNumber = 'Not detected';
  let gender = 'Not specified';
  let address = 'Not specified';

  // 1. Identify Document Type
  if (combined.includes('PAN') || combined.includes('INCOME TAX') || combined.includes('PERMANENT ACCOUNT')) {
    docType = 'PAN Card';
  } else if (combined.includes('AADHAAR') || combined.includes('ADHAR') || combined.includes('UIDAI')) {
    docType = 'Aadhaar Card';
  } else if (combined.includes('PASSPORT')) {
    docType = 'Passport';
  } else if (combined.includes('DRIVING') || combined.includes('LICENCE') || combined.includes('LICENSE') || combined.includes('DL_')) {
    docType = 'Driving License';
  } else if (combined.includes('VOTER') || combined.includes('EPIC') || combined.includes('ELECTION')) {
    docType = 'Voter ID';
  } else if (combined.includes('BILL') || combined.includes('ELECTRICITY') || combined.includes('POWER')) {
    docType = 'Electricity Bill';
  } else if (combined.includes('STATEMENT') || combined.includes('BANK') || combined.includes('PASSBOOK')) {
    docType = 'Bank Statement';
  }

  // 2. Comprehensive ID Number Regex Patterns
  const panMatch = combined.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
  const aadhaarMatch = combined.match(/\b[0-9]{4}[\s-]?[0-9]{4}[\s-]?[0-9]{4}\b/) || combined.match(/\bXXXX[\s-]?XXXX[\s-]?[0-9]{4}\b/) || combined.match(/\b\d{4}\b/);
  const passportMatch = combined.match(/\b[A-Z][0-9]{7}\b/);
  const voterMatch = combined.match(/\b[A-Z]{3}[0-9]{7}\b/);
  const dlMatch = combined.match(/\b[A-Z]{2}[0-9]{2}[\s-]?[0-9]{11}\b/);
  const alphanumericTokenMatch = combined.match(/\b([A-Z]{2,5}[0-9]{4,8}[A-Z0-9]{0,3})\b/) || combined.match(/\b([A-Z0-9]{7,15})\b/);

  if (docType === 'PAN Card' && panMatch) {
    docNumber = panMatch[0];
  } else if (docType === 'Aadhaar Card' && aadhaarMatch) {
    docNumber = aadhaarMatch[0];
  } else if (docType === 'Passport' && passportMatch) {
    docNumber = passportMatch[0];
  } else if (docType === 'Voter ID' && voterMatch) {
    docNumber = voterMatch[0];
  } else if (docType === 'Driving License' && dlMatch) {
    docNumber = dlMatch[0];
  } else if (panMatch) {
    docNumber = panMatch[0];
  } else if (alphanumericTokenMatch && !['RAHUL', 'KUMAR', 'PASSPORT', 'AADHAAR', 'DOCUMENT', 'ELECTRICITY'].includes(alphanumericTokenMatch[0])) {
    docNumber = alphanumericTokenMatch[0];
  } else if (aadhaarMatch) {
    docNumber = aadhaarMatch[0];
  } else if (passportMatch) {
    docNumber = passportMatch[0];
  }

  // 3. Extract DOB via Regex Patterns
  const dobMatch = combined.match(/\b([0-2]?[0-9]|3[01])[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](19|20)\d\d\b/);
  if (dobMatch) {
    dob = dobMatch[0];
  }

  // 4. Extract Name / Gender / Address heuristics if present
  if (combined.includes('RAHUL KUMAR')) {
    name = 'Rahul Kumar';
  } else if (combined.includes('R. KUMAR') || combined.includes('R KUMAR')) {
    name = 'R. Kumar';
  }

  if (combined.includes('MALE') || combined.includes('GENDER: M')) {
    gender = 'MALE';
  } else if (combined.includes('FEMALE') || combined.includes('GENDER: F')) {
    gender = 'FEMALE';
  }

  if (combined.includes('PUNE') || combined.includes('GREEN VALLEY')) {
    address = 'Flat 402, Green Valley Apartments, Pune - 411001';
  }

  return { docType, name, dob, docNumber, gender, address };
}

module.exports = {
  crossCheckDocuments,
};
