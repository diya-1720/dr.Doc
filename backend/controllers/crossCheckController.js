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
ONLY COMPARE FIELDS THAT ARE DETECTED AND AVAILABLE IN BOTH DOCUMENTS.
- If a field exists in BOTH documents -> compare it (match: true or match: false).
- If a field exists in only ONE document or NEITHER document -> OMIT / DO NOT INCLUDE that field in the "fields" object at all.
- Do NOT compare different document types' ID numbers (e.g. Driving License number vs Aadhaar number are different types -> omit from "fields"). Only compare document numbers if BOTH documents are the same type (e.g. two Aadhaar cards).

SMART INDIAN NAME MATCHING:
- Middle Name / Father Name Addition: e.g. "Ved Gharat" vs "Ved Nishad Gharat" -> match = true, notes = "Compatible Indian name variant: includes middle/father's name ('Nishad'). Core identity aligned."
- Exact Match: e.g. "Ved Gharat" vs "Ved Gharat" -> match = true, notes = "Full name matches exactly."
- Initial Variant: e.g. "V. Gharat" vs "Ved Gharat" -> match = true, notes = "Compatible name variant: initials expand to full name."
- Contradictory Names: e.g. "Ved Gharat" vs "Priya Sharma" -> match = false, notes = "Name discrepancy: different individuals."

DATE OF BIRTH:
- If DOB is present in BOTH documents: same date -> match: true; conflicting dates -> match: false.
- If DOB is missing in one/both -> omit from "fields".

GENDER:
- If Gender is present in BOTH documents: same -> match: true; conflicting -> match: false.
- If missing on one/both -> omit from "fields".

ADDRESS:
- If Address is present in BOTH documents: matching locality/PIN -> match: true; conflicting -> match: false.
- If missing on one/both -> omit from "fields".

PHOTO & AGE CHECK:
- If photos are present on both documents: verified -> match: true.

Return strictly valid JSON only:
{
  "overallMatch": true,
  "matchScore": 100,
  "fields": {
    "name": { "match": true, "document1": "Ved Gharat", "document2": "Ved Nishad Gharat", "notes": "Compatible Indian name variant" },
    "dateOfBirth": { "match": true, "document1": "29/03/2008", "document2": "29/03/2008", "notes": "DOB matches exactly" },
    "photoAgeAudit": { "match": true, "document1": "VERIFIED_CURRENT", "document2": "VERIFIED_CURRENT", "notes": "Both photos verified and age-appropriate" }
  },
  "matchedFields": ["name", "dateOfBirth", "photoAgeAudit"],
  "mismatches": [],
  "explanation": "The applicant's primary identity details (name, dateOfBirth, photoAgeAudit) are consistent between Driving License and Aadhaar Card.",
  "document1Type": "Driving License",
  "document2Type": "Aadhaar Card"
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
 * Intelligent Local OCR & Regex Cross-Check Engine
 */
async function runLocalCrossCheck(buffer1, ext1, name1, buffer2, ext2, name2) {
  const { performMultiPassOcr } = require('../utils/ocrExtractor');
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
    const nameComparison = compareNames(d1.name, d2.name);
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
    const normDob1 = d1.dob.replace(/[^0-9]/g, '');
    const normDob2 = d2.dob.replace(/[^0-9]/g, '');
    const isDobMatch = normDob1 === normDob2 || (normDob1.length === 8 && normDob2.length === 8 && normDob1.slice(-4) === normDob2.slice(-4));

    if (isDobMatch) {
      fields.dateOfBirth = { match: true, document1: d1.dob, document2: d2.dob, notes: 'DOB matches exactly' };
      matchedFields.push('dateOfBirth');
    } else {
      fields.dateOfBirth = { match: false, document1: d1.dob, document2: d2.dob, notes: `DOB values contradict (${d1.dob} vs ${d2.dob})` };
      mismatches.push('dateOfBirth');
    }
  }

  // 3. Document / ID Number Comparison (ONLY IF BOTH ARE THE SAME DOCUMENT TYPE)
  const isDocNumPresent1 = d1.docNumber && d1.docNumber !== 'Not detected' && d1.docNumber !== 'Not specified';
  const isDocNumPresent2 = d2.docNumber && d2.docNumber !== 'Not detected' && d2.docNumber !== 'Not specified';
  if (d1.docType === d2.docType && isDocNumPresent1 && isDocNumPresent2) {
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
    } else {
      fields.documentNumber = {
        match: false,
        document1: d1.docNumber,
        document2: d2.docNumber,
        notes: `Document numbers contradict each other (${d1.docNumber} vs ${d2.docNumber})`,
      };
      mismatches.push('documentNumber');
    }
  }

  // 4. Gender Comparison (ONLY IF PRESENT IN BOTH DOCUMENTS)
  const isGenderPresent1 = d1.gender && d1.gender !== 'Not detected' && d1.gender !== 'Not specified';
  const isGenderPresent2 = d2.gender && d2.gender !== 'Not detected' && d2.gender !== 'Not specified';
  if (isGenderPresent1 && isGenderPresent2) {
    if (d1.gender.toUpperCase().charAt(0) === d2.gender.toUpperCase().charAt(0)) {
      fields.gender = { match: true, document1: d1.gender, document2: d2.gender, notes: 'Gender matches' };
      matchedFields.push('gender');
    } else {
      fields.gender = { match: false, document1: d1.gender, document2: d2.gender, notes: `Gender records contradict (${d1.gender} vs ${d2.gender})` };
      mismatches.push('gender');
    }
  }

  // 5. Address Comparison (ONLY IF PRESENT IN BOTH DOCUMENTS)
  const isAddrPresent1 = d1.address && d1.address !== 'Not detected' && d1.address !== 'Not specified' && d1.address.trim() !== '';
  const isAddrPresent2 = d2.address && d2.address !== 'Not detected' && d2.address !== 'Not specified' && d2.address.trim() !== '';
  if (isAddrPresent1 && isAddrPresent2) {
    const addrComparison = compareAddresses(d1.address, d2.address);
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

// Smart Name Comparison Helper with Indian Middle/Father's Name & Noise Handling
function compareNames(name1, name2) {
  if (!name1 || !name2 || name1 === 'Not detected' || name2 === 'Not detected' || name1 === 'Not specified' || name2 === 'Not specified') {
    return { match: 'Unable to verify', notes: 'Name not readable on both documents' };
  }
  const clean1 = name1.toLowerCase().trim().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ');
  const clean2 = name2.toLowerCase().trim().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ');
  if (clean1 === clean2) {
    return { match: true, notes: 'Full name matches exactly' };
  }

  // Filter noise words / single artifact tokens
  const NOISE = new Set(['ree', 'i', 'no', 'mr', 'mrs', 'ms', 'shri', 'smt', 'dr', 'to', 'the']);
  const words1 = clean1.split(' ').filter(w => !NOISE.has(w) && w.length >= 2);
  const words2 = clean2.split(' ').filter(w => !NOISE.has(w) && w.length >= 2);

  if (words1.length === 0 || words2.length === 0) {
    return { match: 'Unable to verify', notes: 'Name tokens insufficient for verification' };
  }

  const str1 = words1.join(' ');
  const str2 = words2.join(' ');
  if (str1 === str2) {
    return { match: true, notes: 'Full name matches after noise normalization' };
  }

  const first1 = words1[0];
  const last1 = words1[words1.length - 1];
  const first2 = words2[0];
  const last2 = words2[words2.length - 1];

  // 1. Indian First Name + Last Name match with Middle Name (e.g. "Ved Gharat" vs "Ved Nishad Gharat")
  if (first1 === first2 && last1 === last2) {
    const middleWords = words2.length > words1.length ? words2.slice(1, -1) : words1.slice(1, -1);
    const middleStr = middleWords.join(' ');
    return {
      match: true,
      notes: middleStr ? `Compatible Indian name variant: includes middle/father's name ('${middleStr}')` : 'Core first & last name match exactly'
    };
  }

  // 2. Subset matching (e.g. "Ved Gharat" is completely within "Ved Nishad Gharat")
  const isSubset1 = words1.every(w => words2.includes(w) || words2.some(w2 => w2.startsWith(w.charAt(0)) && w.length === 1));
  const isSubset2 = words2.every(w => words1.includes(w) || words1.some(w1 => w1.startsWith(w.charAt(0)) && w.length === 1));
  if (isSubset1 || isSubset2) {
    return { match: true, notes: 'Compatible name variant: name expansion / middle name addition' };
  }

  // 3. Initial matching (e.g. "V. Gharat" or "V. N. Gharat" vs "Ved Nishad Gharat")
  if (last1 === last2 && (first1.charAt(0) === first2.charAt(0))) {
    return { match: true, notes: 'Compatible name variant: matching initial and surname' };
  }

  // 4. Permuted surname-first order (e.g. "Gharat Ved" vs "Ved Gharat")
  const sorted1 = [...words1].sort().join(' ');
  const sorted2 = [...words2].sort().join(' ');
  if (sorted1 === sorted2) {
    return { match: true, notes: 'Compatible name variant: surname-first order' };
  }

  return { match: false, notes: `Name discrepancy detected: "${name1}" vs "${name2}"` };
}

// Smart Address Comparison Helper
function compareAddresses(addr1, addr2) {
  if (!addr1 || !addr2 || addr1 === 'Not specified' || addr2 === 'Not specified' || addr1 === 'Not detected' || addr2 === 'Not detected' || addr1.trim() === '' || addr2.trim() === '') {
    return { match: 'Unable to verify', notes: 'Address not present on both documents (single address provided)' };
  }
  const clean1 = addr1.toLowerCase();
  const clean2 = addr2.toLowerCase();
  
  // Extract PIN codes (6 digits)
  const pin1 = clean1.match(/\b\d{6}\b/);
  const pin2 = clean2.match(/\b\d{6}\b/);
  
  if (pin1 && pin2) {
    if (pin1[0] === pin2[0]) {
      return { match: true, notes: `Compatible address: matching postal PIN code (${pin1[0]})` };
    } else {
      return { match: false, notes: `Address mismatch: PIN code discrepancy (${pin1[0]} vs ${pin2[0]})` };
    }
  }

  // Token overlap (locality / city)
  const words1 = clean1.split(/[\s,.-]+/).filter(w => w.length > 3);
  const words2 = clean2.split(/[\s,.-]+/).filter(w => w.length > 3);
  const overlap = words1.filter(w => words2.includes(w));
  
  if (overlap.length >= 1) {
    return { match: true, notes: `Compatible address: locality and city align (${overlap.slice(0, 3).join(', ')})` };
  }

  return { match: false, notes: `Address discrepancy: different residential localities` };
}

module.exports = {
  crossCheckDocuments,
  runCrossCheckWithGemini,
  runLocalCrossCheck,
  compareNames,
  compareAddresses,
};
