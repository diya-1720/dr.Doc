const assert = require('assert');
const {
  normalizeDob,
  compareNormalizedDobs,
  compareNormalizedNames,
  compareNormalizedGenders,
  compareNormalizedAddresses,
  compareNormalizedDocNumbers,
  extractFieldsFromText,
} = require('./backend/utils/ocrExtractor');

console.log('====================================================');
console.log('DR. DOC // VERIFYING OCR & COMPARISON ACCURACY');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    -> ${err.message}`);
    failCount++;
  }
}

// ----------------------------------------------------
// 1. DATE OF BIRTH (DOB) NORMALIZATION & COMPARISON
// ----------------------------------------------------
console.log('[SECTION 1: DOB Normalization & Comparison]');

test('normalizeDob handles DD/MM/YYYY', () => {
  const res = normalizeDob('29/03/2008');
  assert.strictEqual(res.year, 2008);
  assert.strictEqual(res.month, 3);
  assert.strictEqual(res.day, 29);
  assert.strictEqual(res.isoString, '2008-03-29');
});

test('normalizeDob handles YYYY-MM-DD', () => {
  const res = normalizeDob('2008-03-29');
  assert.strictEqual(res.year, 2008);
  assert.strictEqual(res.month, 3);
  assert.strictEqual(res.day, 29);
  assert.strictEqual(res.isoString, '2008-03-29');
});

test('normalizeDob handles DD-MM-YYYY', () => {
  const res = normalizeDob('29-03-2008');
  assert.strictEqual(res.isoString, '2008-03-29');
});

test('normalizeDob handles DD.MM.YYYY', () => {
  const res = normalizeDob('29.03.2008');
  assert.strictEqual(res.isoString, '2008-03-29');
});

test('normalizeDob handles "29 March 2008"', () => {
  const res = normalizeDob('29 March 2008');
  assert.strictEqual(res.isoString, '2008-03-29');
});

test('normalizeDob handles "29 Mar 2008"', () => {
  const res = normalizeDob('29 Mar 2008');
  assert.strictEqual(res.isoString, '2008-03-29');
});

test('normalizeDob handles Year Only (e.g. YOB: 2008)', () => {
  const res = normalizeDob('YOB 2008');
  assert.strictEqual(res.year, 2008);
  assert.strictEqual(res.isYearOnly, true);
});

test('compareNormalizedDobs matches 29/03/2008 vs 2008-03-29', () => {
  const res = compareNormalizedDobs('29/03/2008', '2008-03-29');
  assert.strictEqual(res.match, true, `Expected match=true, got ${res.match}`);
});

test('compareNormalizedDobs matches 29-03-2008 vs 29.03.2008', () => {
  const res = compareNormalizedDobs('29-03-2008', '29.03.2008');
  assert.strictEqual(res.match, true);
});

test('compareNormalizedDobs matches "29 March 2008" vs "2008/03/29"', () => {
  const res = compareNormalizedDobs('29 March 2008', '2008/03/29');
  assert.strictEqual(res.match, true);
});

test('compareNormalizedDobs matches Year-only "2008" vs "29/03/2008"', () => {
  const res = compareNormalizedDobs('2008', '29/03/2008');
  assert.strictEqual(res.match, true);
});

test('compareNormalizedDobs fails true mismatch 29/03/2008 vs 15/08/1995', () => {
  const res = compareNormalizedDobs('29/03/2008', '15/08/1995');
  assert.strictEqual(res.match, false);
});

test('compareNormalizedDobs ignores missing DOB (Not detected)', () => {
  const res = compareNormalizedDobs('29/03/2008', 'Not detected');
  assert.strictEqual(res.match, 'Unable to verify');
});

// ----------------------------------------------------
// 2. NAME NORMALIZATION & COMPARISON
// ----------------------------------------------------
console.log('\n[SECTION 2: Name Normalization & Comparison]');

test('Exact Name Match: "Ved Gharat" vs "Ved Gharat"', () => {
  const res = compareNormalizedNames('Ved Gharat', 'Ved Gharat');
  assert.strictEqual(res.match, true);
});

test('Middle Name Addition: "Ved Gharat" vs "Ved Nishad Gharat"', () => {
  const res = compareNormalizedNames('Ved Gharat', 'Ved Nishad Gharat');
  assert.strictEqual(res.match, true);
});

test('Middle Name Addition (reverse): "Ved Nishad Gharat" vs "Ved Gharat"', () => {
  const res = compareNormalizedNames('Ved Nishad Gharat', 'Ved Gharat');
  assert.strictEqual(res.match, true);
});

test('Initial expansion: "V. Gharat" vs "Ved Gharat"', () => {
  const res = compareNormalizedNames('V. Gharat', 'Ved Gharat');
  assert.strictEqual(res.match, true);
});

test('Surname First Order: "Gharat Ved" vs "Ved Gharat"', () => {
  const res = compareNormalizedNames('Gharat Ved', 'Ved Gharat');
  assert.strictEqual(res.match, true);
});

test('Title prefix stripped: "Mr. Ved Gharat" vs "Ved Gharat"', () => {
  const res = compareNormalizedNames('Mr. Ved Gharat', 'Ved Gharat');
  assert.strictEqual(res.match, true);
});

test('True Mismatch: "Ved Gharat" vs "Rahul Sharma"', () => {
  const res = compareNormalizedNames('Ved Gharat', 'Rahul Sharma');
  assert.strictEqual(res.match, false);
});

test('Surname mismatch: "Ved Gharat" vs "Ved Sharma"', () => {
  const res = compareNormalizedNames('Ved Gharat', 'Ved Sharma');
  assert.strictEqual(res.match, false);
});

test('First name mismatch: "Rahul Gharat" vs "Ved Gharat"', () => {
  const res = compareNormalizedNames('Rahul Gharat', 'Ved Gharat');
  assert.strictEqual(res.match, false);
});

test('Missing Name: "Ved Gharat" vs "Not detected"', () => {
  const res = compareNormalizedNames('Ved Gharat', 'Not detected');
  assert.strictEqual(res.match, 'Unable to verify');
});

// ----------------------------------------------------
// 3. GENDER COMPARISON
// ----------------------------------------------------
console.log('\n[SECTION 3: Gender Comparison]');

test('Matching gender: "Male" vs "MALE"', () => {
  const res = compareNormalizedGenders('Male', 'MALE');
  assert.strictEqual(res.match, true);
});

test('Matching gender with regional script: "Male" vs "पुरुष"', () => {
  const res = compareNormalizedGenders('Male', 'पुरुष');
  assert.strictEqual(res.match, true);
});

test('Conflicting gender: "Male" vs "Female"', () => {
  const res = compareNormalizedGenders('Male', 'Female');
  assert.strictEqual(res.match, false);
});

test('Missing gender in one document: "Male" vs "Not detected"', () => {
  const res = compareNormalizedGenders('Male', 'Not detected');
  assert.strictEqual(res.match, 'Unable to verify');
});

// ----------------------------------------------------
// 4. ADDRESS COMPARISON
// ----------------------------------------------------
console.log('\n[SECTION 4: Address Comparison]');

test('Matching PIN Code address comparison', () => {
  const addr1 = '80 A Kamare Road Near Govt Boys Hostel Gram Navali Palghar 401404';
  const addr2 = 'Flat 80A, Near Govt Boys Hostel, Palghar, Maharashtra 401404';
  const res = compareNormalizedAddresses(addr1, addr2);
  assert.strictEqual(res.match, true);
});

test('Mismatched PIN Code address comparison', () => {
  const addr1 = 'Palghar Maharashtra 401404';
  const addr2 = 'Andheri West, Mumbai Maharashtra 400058';
  const res = compareNormalizedAddresses(addr1, addr2);
  assert.strictEqual(res.match, false);
});

test('Missing address in one document', () => {
  const addr1 = 'Palghar Maharashtra 401404';
  const addr2 = 'Not detected';
  const res = compareNormalizedAddresses(addr1, addr2);
  assert.strictEqual(res.match, 'Unable to verify');
});

// ----------------------------------------------------
// 5. DOCUMENT NUMBERS COMPARISON
// ----------------------------------------------------
console.log('\n[SECTION 5: Document Numbers Comparison]');

test('Different document types are NEVER compared: DL vs Aadhaar', () => {
  const res = compareNormalizedDocNumbers('Driving License', 'MH48 20260023357', 'Aadhaar Card', '2500 6999 1814');
  assert.strictEqual(res.match, 'Unable to verify');
});

test('Same document type matches: Aadhaar vs Aadhaar', () => {
  const res = compareNormalizedDocNumbers('Aadhaar Card', '2500 6999 1814', 'Aadhaar Card', '2500-6999-1814');
  assert.strictEqual(res.match, true);
});

test('Same document type contradicts: Aadhaar vs Aadhaar', () => {
  const res = compareNormalizedDocNumbers('Aadhaar Card', '2500 6999 1814', 'Aadhaar Card', '1111 2222 3333');
  assert.strictEqual(res.match, false);
});

// ----------------------------------------------------
// 6. ZERO HALLUCINATION & INDEPENDENT EXTRACTION TEST
// ----------------------------------------------------
console.log('\n[SECTION 6: Independent Optical Extraction]');

test('Blank / Non-credential text produces "Not detected" (zero hallucination)', () => {
  const fields = extractFieldsFromText('Terms and conditions apply. Visit www.example.com for more info.');
  const name = fields.extractedFields.find(f => f.key === 'applicantName')?.value;
  const dob = fields.extractedFields.find(f => f.key === 'dob')?.value;
  assert.strictEqual(name, 'Not detected');
  assert.strictEqual(dob, 'Not detected');
});

test('Aadhaar OCR text extracts name and DOB accurately without header noise', () => {
  const sampleOcr = `
    GOVERNMENT OF INDIA
    UNIQUE IDENTIFICATION AUTHORITY OF INDIA
    Mera Aadhaar, Meri Pehchan
    Rohan Ramesh Patil
    DOB: 14/07/1998
    MALE
    9876 5432 1098
    Address: 12 Shivaji Nagar, Pune, Maharashtra 411005
  `;
  const fields = extractFieldsFromText(sampleOcr);
  const name = fields.extractedFields.find(f => f.key === 'applicantName')?.value;
  const dob = fields.extractedFields.find(f => f.key === 'dob')?.value;
  const gender = fields.extractedFields.find(f => f.key === 'gender')?.value;
  const docNum = fields.extractedFields.find(f => f.key === 'documentNumber')?.value;
  
  assert.strictEqual(name, 'Rohan Ramesh Patil');
  assert.strictEqual(dob, '14/07/1998');
  assert.strictEqual(gender, 'MALE');
  assert.strictEqual(docNum, '9876 5432 1098');
});

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
