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
You are an expert document forensics AI analyzing and cross-checking two official credentials for identity consistency.

CRITICAL CROSS-VERIFICATION RULE:
ONLY COMPARE FIELDS THAT ARE CONFIDENTLY DETECTED AND AVAILABLE IN BOTH DOCUMENTS.
- If a field exists in BOTH documents -> compare it (match: true or match: false).
- If a field exists in only ONE document or NEITHER document -> OMIT / DO NOT INCLUDE that field in the "fields" object at all.
- NEVER flag a mismatch because one document simply lacks a field.
- Do NOT compare different document types' ID numbers (e.g. Driving License number vs Aadhaar number are different types -> omit from "fields"). Only compare document numbers if BOTH documents are the exact same type (e.g. two Aadhaar cards).

NAME MATCHING RULES:
- Middle Name / Father Name Addition: e.g. "FIRST LAST" vs "FIRST MIDDLE LAST" -> match = true, notes = "Compatible name variant: includes middle/father's name. Core identity aligned."
- Exact Match: -> match = true, notes = "Full name matches exactly."
- Initial Variant: e.g. "F. LAST" vs "FIRST LAST" -> match = true, notes = "Compatible name variant: initials expand to full name."
- Surname-First Order: e.g. "LAST FIRST" vs "FIRST LAST" -> match = true, notes = "Compatible name variant: surname-first order."
- Contradictory Names: e.g. different first/last names -> match = false, notes = "Name discrepancy: different individuals."

DATE OF BIRTH MATCHING RULES:
- Normalize date formats (DD/MM/YYYY vs YYYY-MM-DD vs DD Month YYYY): if they represent the same day/month/year -> match: true.
- Year-only match: if one document contains only year (e.g. YOB 2008) and matches birth year of full DOB -> match: true.
- Conflicting dates -> match: false.
- If DOB is missing in one/both -> omit from "fields".

GENDER:
- If Gender is present in BOTH documents: matching -> match: true; conflicting -> match: false.
- If missing in one/both -> omit from "fields".

ADDRESS:
- If Address is present in BOTH documents: matching postal PIN code / locality -> match: true; conflicting -> match: false.
- If missing in one/both -> omit from "fields".

PHOTO & AGE CHECK:
- If photos are present on both documents: verified -> match: true.

Return strictly valid JSON only:
{
  "overallMatch": true,
  "matchScore": 100,
  "fields": {
    "name": { "match": true, "document1": "<DOC1_NAME>", "document2": "<DOC2_NAME>", "notes": "Compatible name variant" },
    "dateOfBirth": { "match": true, "document1": "<DOC1_DOB>", "document2": "<DOC2_DOB>", "notes": "DOB matches exactly" }
  },
  "matchedFields": ["name", "dateOfBirth"],
  "mismatches": [],
  "explanation": "Primary identity details are consistent between the two documents.",
  "document1Type": "<DETECTED_TYPE_1>",
  "document2Type": "<DETECTED_TYPE_2>"
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
              { text: prompt },
              {
                inlineData: {
                  mimeType: mime1 || 'image/jpeg',
                  data: base64_1,
                },
              },
              {
                inlineData: {
                  mimeType: mime2 || 'image/jpeg',
                  data: base64_2,
                },
              },
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
 * Intelligent Local OCR & Normalized Cross-Check Engine
 */
async function runLocalCrossCheck(buffer1, ext1, name1, buffer2, ext2, name2) {
  const { 
    performMultiPassOcr, 
    compareNormalizedNames, 
    compareNormalizedDobs, 
    compareNormalizedGenders, 
    compareNormalizedAddresses, 
    compareNormalizedDocNumbers 
  } = require('../utils/ocrExtractor');

  // Both documents scanned independently
  const res1 = await performMultiPassOcr(buffer1, ext1);
  const res2 = await performMultiPassOcr(buffer2, ext2);

  const e1 = res1.parsedFields;
  const e2 = res2.parsedFields;

  const nameVal1 = e1.extractedFields.find(f => f.key === 'applicantName')?.value || 'Not detected';
  const nameVal2 = e2.extractedFields.find(f => f.key === 'applicantName')?.value || 'Not detected';

  const d1 = {
    docType: e1.documentType || 'Document 1',
    name: nameVal1,
    docNumber: e1.extractedFields.find(f => f.key === 'documentNumber')?.value || 'Not detected',
    dob: e1.extractedFields.find(f => f.key === 'dob')?.value || 'Not detected',
    gender: e1.extractedFields.find(f => f.key === 'gender')?.value || 'Not detected',
    address: e1.extractedFields.find(f => f.key === 'address')?.value || 'Not detected',
    photoAudit: e1.photoAudit,
  };

  const d2 = {
    docType: e2.documentType || 'Document 2',
    name: nameVal2,
    docNumber: e2.extractedFields.find(f => f.key === 'documentNumber')?.value || 'Not detected',
    dob: e2.extractedFields.find(f => f.key === 'dob')?.value || 'Not detected',
    gender: e2.extractedFields.find(f => f.key === 'gender')?.value || 'Not detected',
    address: e2.extractedFields.find(f => f.key === 'address')?.value || 'Not detected',
    photoAudit: e2.photoAudit,
  };

  const fields = {};
  const matchedFields = [];
  const mismatches = [];

  // 1. Name Comparison (ONLY IF PRESENT IN BOTH DOCUMENTS)
  const isNamePresent1 = d1.name && d1.name !== 'Not detected' && d1.name !== 'Not specified';
  const isNamePresent2 = d2.name && d2.name !== 'Not detected' && d2.name !== 'Not specified';
  if (isNamePresent1 && isNamePresent2) {
    const nameComparison = compareNormalizedNames(d1.name, d2.name);
    if (nameComparison.match === true) {
      fields.name = { match: true, document1: d1.name, document2: d2.name, notes: nameComparison.notes };
      matchedFields.push('name');
    } else if (nameComparison.match === false) {
      fields.name = { match: false, document1: d1.name, document2: d2.name, notes: nameComparison.notes };
      mismatches.push('name');
    }
  }

  // 2. Date of Birth Comparison (ONLY IF PRESENT IN BOTH DOCUMENTS)
  const isDobPresent1 = d1.dob && d1.dob !== 'Not detected' && d1.dob !== 'Not specified';
  const isDobPresent2 = d2.dob && d2.dob !== 'Not detected' && d2.dob !== 'Not specified';
  if (isDobPresent1 && isDobPresent2) {
    const dobComparison = compareNormalizedDobs(d1.dob, d2.dob);
    if (dobComparison.match === true) {
      fields.dateOfBirth = { match: true, document1: d1.dob, document2: d2.dob, notes: dobComparison.notes };
      matchedFields.push('dateOfBirth');
    } else if (dobComparison.match === false) {
      fields.dateOfBirth = { match: false, document1: d1.dob, document2: d2.dob, notes: dobComparison.notes };
      mismatches.push('dateOfBirth');
    }
  }

  // 3. Document / ID Number Comparison (ONLY IF BOTH ARE THE SAME DOCUMENT TYPE)
  const isDocNumPresent1 = d1.docNumber && d1.docNumber !== 'Not detected' && d1.docNumber !== 'Not specified';
  const isDocNumPresent2 = d2.docNumber && d2.docNumber !== 'Not detected' && d2.docNumber !== 'Not specified';
  if (d1.docType === d2.docType && isDocNumPresent1 && isDocNumPresent2) {
    const docNumComp = compareNormalizedDocNumbers(d1.docType, d1.docNumber, d2.docType, d2.docNumber);
    if (docNumComp.match === true) {
      fields.documentNumber = {
        match: true,
        document1: d1.docNumber,
        document2: d2.docNumber,
        notes: docNumComp.notes,
      };
      matchedFields.push('documentNumber');
    } else if (docNumComp.match === false) {
      fields.documentNumber = {
        match: false,
        document1: d1.docNumber,
        document2: d2.docNumber,
        notes: docNumComp.notes,
      };
      mismatches.push('documentNumber');
    }
  }

  // 4. Gender Comparison (ONLY IF PRESENT IN BOTH DOCUMENTS)
  const isGenderPresent1 = d1.gender && d1.gender !== 'Not detected' && d1.gender !== 'Not specified';
  const isGenderPresent2 = d2.gender && d2.gender !== 'Not detected' && d2.gender !== 'Not specified';
  if (isGenderPresent1 && isGenderPresent2) {
    const genderComp = compareNormalizedGenders(d1.gender, d2.gender);
    if (genderComp.match === true) {
      fields.gender = { match: true, document1: d1.gender, document2: d2.gender, notes: genderComp.notes };
      matchedFields.push('gender');
    } else if (genderComp.match === false) {
      fields.gender = { match: false, document1: d1.gender, document2: d2.gender, notes: genderComp.notes };
      mismatches.push('gender');
    }
  }

  // 5. Address Comparison (ONLY IF PRESENT IN BOTH DOCUMENTS)
  const isAddrPresent1 = d1.address && d1.address !== 'Not detected' && d1.address !== 'Not specified' && d1.address.trim().length >= 8;
  const isAddrPresent2 = d2.address && d2.address !== 'Not detected' && d2.address !== 'Not specified' && d2.address.trim().length >= 8;
  if (isAddrPresent1 && isAddrPresent2) {
    const addrComparison = compareNormalizedAddresses(d1.address, d2.address);
    if (addrComparison.match === true) {
      fields.address = { match: true, document1: d1.address, document2: d2.address, notes: addrComparison.notes };
      matchedFields.push('address');
    } else if (addrComparison.match === false) {
      fields.address = { match: false, document1: d1.address, document2: d2.address, notes: addrComparison.notes };
      mismatches.push('address');
    }
  }

  // 6. Photo & Age Audit (ONLY IF BOTH REQUIRE/HAVE PHOTO)
  const p1 = d1.photoAudit;
  const p2 = d2.photoAudit;
  if (p1?.hasPhoto && p2?.hasPhoto) {
    if (p1.photoStatus === 'OUTDATED_RECOMMEND_UPDATE' || p2.photoStatus === 'OUTDATED_RECOMMEND_UPDATE') {
      fields.photoAgeAudit = {
        match: false,
        document1: p1.photoStatus || 'N/A',
        document2: p2.photoStatus || 'N/A',
        notes: 'Outdated photo detected relative to calculated age.'
      };
      mismatches.push('photoAgeAudit');
    } else {
      fields.photoAgeAudit = {
        match: true,
        document1: 'VERIFIED_CURRENT',
        document2: 'VERIFIED_CURRENT',
        notes: 'Both document photos verified as current and age-appropriate.'
      };
      matchedFields.push('photoAgeAudit');
    }
  }

  const hasMismatch = mismatches.length > 0;
  const overallMatch = !hasMismatch && matchedFields.length >= 1;
  const matchScore = hasMismatch ? Math.max(20, 100 - mismatches.length * 35) : 100;

  const explanation = overallMatch
    ? `The applicant's primary identity details (${matchedFields.join(', ')}) are consistent between ${d1.docType} and ${d2.docType}.`
    : `Discrepancy detected in [${mismatches.join(', ')}] between ${d1.docType} and ${d2.docType}. Manual review recommended.`;

  return {
    overallMatch,
    matchScore,
    fields,
    matchedFields,
    mismatches,
    unableToVerify: [],
    explanation,
    document1Type: d1.docType,
    document2Type: d2.docType,
  };
}

module.exports = {
  crossCheckDocuments,
  runCrossCheckWithGemini,
  runLocalCrossCheck,
};
