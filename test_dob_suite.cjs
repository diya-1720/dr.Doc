const assert = require('assert');
const { 
  normalizeDob, 
  compareNormalizedDobs, 
  extractFieldsFromText 
} = require('./backend/utils/ocrExtractor');

console.log('====================================================');
console.log('DR. DOC // COMPREHENSIVE DOB-ONLY TEST SUITE');
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
// SECTION 1: Robust DOB Label Detection
// ----------------------------------------------------
console.log('[SECTION 1: Robust DOB Label Detection]');

test('Label: "Date of Birth: 29/03/2008"', () => {
  const res = extractFieldsFromText('Date of Birth: 29/03/2008');
  assert.strictEqual(res.dob, '29/03/2008');
});

test('Label: "DOB: 29-03-2008"', () => {
  const res = extractFieldsFromText('DOB: 29-03-2008');
  assert.strictEqual(res.dob, '29/03/2008');
});

test('Label: "D.O.B: 29.03.2008"', () => {
  const res = extractFieldsFromText('D.O.B: 29.03.2008');
  assert.strictEqual(res.dob, '29/03/2008');
});

test('Label: "D.O.B.: 29/03/2008"', () => {
  const res = extractFieldsFromText('D.O.B.: 29/03/2008');
  assert.strictEqual(res.dob, '29/03/2008');
});

test('Label: "Birth Date: 29/03/2008"', () => {
  const res = extractFieldsFromText('Birth Date: 29/03/2008');
  assert.strictEqual(res.dob, '29/03/2008');
});

test('Label: "Date Of Birth: 29/03/2008"', () => {
  const res = extractFieldsFromText('Date Of Birth: 29/03/2008');
  assert.strictEqual(res.dob, '29/03/2008');
});

test('Label Devanagari: "जन्म तारीख: 29/03/2008"', () => {
  const res = extractFieldsFromText('जन्म तारीख: 29/03/2008');
  assert.strictEqual(res.dob, '29/03/2008');
});

test('Label Devanagari: "जन्म दिनांक: 29-03-2008"', () => {
  const res = extractFieldsFromText('जन्म दिनांक: 29-03-2008');
  assert.strictEqual(res.dob, '29/03/2008');
});

test('Label Devanagari: "जन्मतारीख: 29.03.2008"', () => {
  const res = extractFieldsFromText('जन्मतारीख: 29.03.2008');
  assert.strictEqual(res.dob, '29/03/2008');
});

test('Label Bilingual: "जन्म दिनांक / DOB: 29/03/2008"', () => {
  const res = extractFieldsFromText('जन्म दिनांक / DOB: 29/03/2008');
  assert.strictEqual(res.dob, '29/03/2008');
});

test('Label Year only: "Year of Birth: 2008"', () => {
  const res = extractFieldsFromText('Year of Birth: 2008');
  assert.strictEqual(res.dob, '2008');
});

// ----------------------------------------------------
// SECTION 2: Support All Common Date Formats
// ----------------------------------------------------
console.log('\n[SECTION 2: Support All Common Date Formats]');

test('Format: DD/MM/YYYY ("29/03/2008") -> canonical "29/03/2008"', () => {
  const n = normalizeDob('29/03/2008');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

test('Format: DD-MM-YYYY ("29-03-2008") -> canonical "29/03/2008"', () => {
  const n = normalizeDob('29-03-2008');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

test('Format: DD.MM.YYYY ("29.03.2008") -> canonical "29/03/2008"', () => {
  const n = normalizeDob('29.03.2008');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

test('Format: DD MM YYYY ("29 03 2008") -> canonical "29/03/2008"', () => {
  const n = normalizeDob('29 03 2008');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

test('Format: D/M/YYYY ("9/3/2008") -> canonical "09/03/2008"', () => {
  const n = normalizeDob('9/3/2008');
  assert.strictEqual(n.canonicalDob, '09/03/2008');
});

test('Format: YYYY/MM/DD ("2008/03/29") -> canonical "29/03/2008"', () => {
  const n = normalizeDob('2008/03/29');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

test('Format: YYYY-MM-DD ("2008-03-29") -> canonical "29/03/2008"', () => {
  const n = normalizeDob('2008-03-29');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

test('Format: YYYY.MM.DD ("2008.03.29") -> canonical "29/03/2008"', () => {
  const n = normalizeDob('2008.03.29');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

test('Format: DD/MM/YY ("29/03/08") -> canonical "29/03/2008"', () => {
  const n = normalizeDob('29/03/08');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

test('Format: DD Month YYYY ("29 March 2008") -> canonical "29/03/2008"', () => {
  const n = normalizeDob('29 March 2008');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

// ----------------------------------------------------
// SECTION 3: OCR Character Confusion
// ----------------------------------------------------
console.log('\n[SECTION 3: OCR Character Confusion]');

test('OCR Noise: "29/O3/2OO8" (O vs 0) -> "29/03/2008"', () => {
  const n = normalizeDob('29/O3/2OO8');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

test('OCR Noise: "2g/03/2008" (g vs 9) -> "29/03/2008"', () => {
  const n = normalizeDob('2g/03/2008');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

test('OCR Noise: "I5/08/I995" (I vs 1) -> "15/08/1995"', () => {
  const n = normalizeDob('I5/08/I995');
  assert.strictEqual(n.canonicalDob, '15/08/1995');
});

test('OCR Noise: "29/03/200B" (B vs 8) -> "29/03/2008"', () => {
  const n = normalizeDob('29/03/200B');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

test('OCR Noise: "Z9/03/2008" (Z vs 2) -> "29/03/2008"', () => {
  const n = normalizeDob('Z9/03/2008');
  assert.strictEqual(n.canonicalDob, '29/03/2008');
});

// ----------------------------------------------------
// SECTION 4: DOB-Specific Validation
// ----------------------------------------------------
console.log('\n[SECTION 4: DOB-Specific Validation]');

test('Validation: Rejects impossible date "31/02/2008" (Feb only has 28/29 days)', () => {
  const n = normalizeDob('31/02/2008');
  assert.strictEqual(n, null);
});

test('Validation: Rejects impossible date "31/04/2008" (April has 30 days)', () => {
  const n = normalizeDob('31/04/2008');
  assert.strictEqual(n, null);
});

test('Validation: Rejects impossible date "32/01/2008"', () => {
  const n = normalizeDob('32/01/2008');
  assert.strictEqual(n, null);
});

test('Validation: Rejects impossible year "29/03/2099"', () => {
  const n = normalizeDob('29/03/2099');
  assert.strictEqual(n, null);
});

// ----------------------------------------------------
// SECTION 5: Cross-Check / Comparison Normalization
// ----------------------------------------------------
console.log('\n[SECTION 5: Cross-Check / Comparison Normalization]');

test('Comparison: "29/03/2008" vs "29-03-2008" is MATCH', () => {
  const res = compareNormalizedDobs('29/03/2008', '29-03-2008');
  assert.strictEqual(res.match, true);
});

test('Comparison: "29.03.2008" vs "2008-03-29" is MATCH', () => {
  const res = compareNormalizedDobs('29.03.2008', '2008-03-29');
  assert.strictEqual(res.match, true);
});

test('Comparison: "29/03/2008" vs "29 March 2008" is MATCH', () => {
  const res = compareNormalizedDobs('29/03/2008', '29 March 2008');
  assert.strictEqual(res.match, true);
});

test('Comparison: "29/03/2008" vs "2008" (Year only) is MATCH (Compatible)', () => {
  const res = compareNormalizedDobs('29/03/2008', '2008');
  assert.strictEqual(res.match, true);
});

test('Comparison: "29/03/2008" vs "15/08/1995" is MISMATCH', () => {
  const res = compareNormalizedDobs('29/03/2008', '15/08/1995');
  assert.strictEqual(res.match, false);
});

// ----------------------------------------------------
// SECTION 6: The Real-Document Case (29 vs 20)
// ----------------------------------------------------
console.log('\n[SECTION 6: Real Document Verification (29 vs 20)]');

test('Document OCR: "DOB: 29/03/2008" with "DOI: 20/05/2024" extracts "29/03/2008"', () => {
  const docText = `
INDIAN UNION DRIVING LICENCE
DL No: MH48 20260023357
Name: VED NISHAD GHARAT
DOI: 20/05/2024
DOB: 29/03/2008
Valid Till: 20/03/2028
Address: 80 A Kamare Road Near Govt Boys Hostel Palghar 401404
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.dob, '29/03/2008');
});

test('Document OCR: Driving License with "DOB: 20-03-2008" extracts "20/03/2008" (NOT 29)', () => {
  const docText = `
INDIAN UNION DRIVING LICENCE
MAHARASHTRA MOTOR VEHICLES DEPT
DL No: MH48 20260023357
Name: VED NISHAD GHARAT
S/W/D of: NISHAD GHARAT
DOB: 20-03-2008
Blood Group: O+
DOI: 20-05-2024
Valid Till: 20-03-2028
Address: 80 A KAMARE ROAD NEAR GOVT BOYS HOSTEL GRAM NAVALI PALGHAR 401404
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.dob, '20/03/2008');
  assert.notStrictEqual(res.dob, '29/03/2008');
});

test('Document OCR: Aadhaar Card with "जन्म तारीख / DOB : 20/03/2008" extracts "20/03/2008"', () => {
  const docText = `
GOVERNMENT OF INDIA
वेद निशाद घरत
Ved Nishad Gharat
जन्म तारीख / DOB : 20/03/2008
पुरुष / MALE
2500 6999 1814
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.dob, '20/03/2008');
  assert.strictEqual(res.applicantName, 'Ved Nishad Gharat');
});

test('Cross-Check: Driving License ("20-03-2008") and Aadhaar ("20/03/2008") MATCH exactly', () => {
  const dlRes = extractFieldsFromText('DOB: 20-03-2008');
  const aadhaarRes = extractFieldsFromText('जन्म तारीख / DOB: 20/03/2008');
  const comp = compareNormalizedDobs(dlRes.dob, aadhaarRes.dob);
  assert.strictEqual(comp.match, true);
  assert.ok(comp.notes.includes('20/03/2008'));
});

console.log('\n====================================================');
console.log(`DOB TEST SUITE SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('====================================================');

if (failCount > 0) {
  process.exitCode = 1;
} else {
  process.exitCode = 0;
}
