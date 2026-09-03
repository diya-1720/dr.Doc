const {
  parseAndNormalizeDate,
  compareDates,
  compareNames,
  compareAddresses,
} = require('./controllers/crossCheckController');
const { extractFieldsFromText } = require('./utils/ocrExtractor');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('====================================================');
console.log('TEST SUITE 1: CANONICAL DOB NORMALIZATION & COMPARISON');
console.log('====================================================');

// 1. DD/MM/YYYY vs YYYY-MM-DD
const r1 = compareDates('29/03/2008', '2008-03-29');
assert(r1.match === true, '29/03/2008 vs 2008-03-29 should MATCH');

// 2. DD-MM-YYYY vs DD.MM.YYYY
const r2 = compareDates('29-03-2008', '29.03.2008');
assert(r2.match === true, '29-03-2008 vs 29.03.2008 should MATCH');

// 3. Textual month format vs ISO format
const r3 = compareDates('29 March 2008', '2008-03-29');
assert(r3.match === true, '29 March 2008 vs 2008-03-29 should MATCH');

// 4. Short textual month vs DD/MM/YYYY
const r4 = compareDates('29 Mar 2008', '29/03/2008');
assert(r4.match === true, '29 Mar 2008 vs 29/03/2008 should MATCH');

// 5. Month name first vs DD/MM/YYYY
const r5 = compareDates('March 29, 2008', '29/03/2008');
assert(r5.match === true, 'March 29, 2008 vs 29/03/2008 should MATCH');

// 6. Year only vs full DOB
const r6 = compareDates('2008', '29/03/2008');
assert(r6.match === true, 'Year-only 2008 vs 29/03/2008 should MATCH (year match)');

// 7. Genuine DOB mismatch
const r7 = compareDates('29/03/2008', '15/08/1999');
assert(r7.match === false, '29/03/2008 vs 15/08/1999 should MISMATCH');

// 8. Missing DOB in one document
const r8 = compareDates('29/03/2008', 'Not detected');
assert(r8.match === 'Unable to verify', '29/03/2008 vs Not detected should NOT create a false mismatch');

console.log('\n====================================================');
console.log('TEST SUITE 2: SMART NAME NORMALIZATION & MATCHING');
console.log('====================================================');

// 1. Exact match with case difference
const n1 = compareNames('Ved Gharat', 'ved gharat');
assert(n1.match === true, 'Ved Gharat vs ved gharat should MATCH');

// 2. Middle name addition (Indian father name format)
const n2 = compareNames('Ved Gharat', 'Ved Nishad Gharat');
assert(n2.match === true, 'Ved Gharat vs Ved Nishad Gharat should MATCH (middle name variant)');

// 3. Middle name addition (reverse order of documents)
const n3 = compareNames('Ved Nishad Gharat', 'Ved Gharat');
assert(n3.match === true, 'Ved Nishad Gharat vs Ved Gharat should MATCH (middle name variant)');

// 4. Initial variant
const n4 = compareNames('V. Gharat', 'Ved Gharat');
assert(n4.match === true, 'V. Gharat vs Ved Gharat should MATCH (initial variant)');

// 5. Surname first order
const n5 = compareNames('Gharat Ved', 'Ved Gharat');
assert(n5.match === true, 'Gharat Ved vs Ved Gharat should MATCH (surname first)');

// 6. Honorifics handling
const n6 = compareNames('Mr. Ved Gharat', 'Shri Ved Nishad Gharat');
assert(n6.match === true, 'Mr. Ved Gharat vs Shri Ved Nishad Gharat should MATCH');

// 7. Genuine Name Discrepancy
const n7 = compareNames('Ved Gharat', 'Rahul Sharma');
assert(n7.match === false, 'Ved Gharat vs Rahul Sharma should MISMATCH');

// 8. Missing Name in one document
const n8 = compareNames('Ved Gharat', 'Not detected');
assert(n8.match === 'Unable to verify', 'Ved Gharat vs Not detected should NOT create a false mismatch');

console.log('\n====================================================');
console.log('TEST SUITE 3: ADDRESS & PIN CODE COMPARISON');
console.log('====================================================');

// 1. Same address with different formatting & matching PIN
const a1 = compareAddresses(
  '80 A Kamare Road Near Govt Boys Hostel Gram Navali Palghar, Maharashtra 401404',
  '80-A, Kamare Rd, Gram Navali, Palghar - 401404'
);
assert(a1.match === true, 'Matching PIN code address should MATCH');

// 2. Different addresses with different PIN codes
const a2 = compareAddresses(
  '80 A Kamare Road Palghar 401404',
  '120 MG Road Bandra Mumbai 400050'
);
assert(a2.match === false, 'Different PIN codes address should MISMATCH');

// 3. Address missing in one document
const a3 = compareAddresses(
  '80 A Kamare Road Palghar 401404',
  'Not detected'
);
assert(a3.match === 'Unable to verify', 'Address present vs Not detected should NOT create a false mismatch');

console.log('\n====================================================');
console.log('TEST SUITE 4: OCR TEXT EXTRACTION (ZERO FILENAME BIAS)');
console.log('====================================================');

// Driving License mock text
const dlText = `
INDIAN UNION DRIVING LICENCE
MAHARASHTRA STATE
DL NO: MH48 20260023357
NAME: VED NISHAD GHARAT
DOB: 29/03/2008
BLOOD GROUP: O+
VALIDITY: 28/03/2048
ADDRESS: 80 A KAMARE ROAD NEAR GOVT BOYS HOSTEL GRAM NAVALI PALGHAR 401404
`;

const dlFields = extractFieldsFromText(dlText);
assert(dlFields.documentType === 'Driving License', 'DL classified as Driving License');
assert(dlFields.extractedFields.find(f => f.key === 'applicantName')?.value === 'Ved Nishad Gharat', 'DL applicantName is Ved Nishad Gharat');
assert(dlFields.extractedFields.find(f => f.key === 'dob')?.value === '29/03/2008', 'DL dob is 29/03/2008');
assert(dlFields.extractedFields.find(f => f.key === 'documentNumber')?.value.includes('MH48'), 'DL documentNumber extracted');
assert(dlFields.extractedFields.find(f => f.key === 'bloodGroup')?.value === 'O+', 'DL bloodGroup is O+');

// Aadhaar Card mock text (spatial layout without Name: label)
const aadhaarText = `
GOVERNMENT OF INDIA
भारत सरकार
वेद निषाद घरात
Ved Nishad Gharat
DOB: 29/03/2008
Male / पुरुष
2500 6999 1814
`;

const aadhaarFields = extractFieldsFromText(aadhaarText);
assert(aadhaarFields.documentType === 'Aadhaar Card', 'Aadhaar classified as Aadhaar Card');
assert(aadhaarFields.extractedFields.find(f => f.key === 'applicantName')?.value === 'Ved Nishad Gharat', 'Aadhaar applicantName extracted without "Name:" label');
assert(aadhaarFields.extractedFields.find(f => f.key === 'dob')?.value === '29/03/2008', 'Aadhaar dob is 29/03/2008');
assert(aadhaarFields.extractedFields.find(f => f.key === 'gender')?.value === 'MALE', 'Aadhaar gender is MALE');
assert(aadhaarFields.extractedFields.find(f => f.key === 'documentNumber')?.value === '2500 6999 1814', 'Aadhaar number is 2500 6999 1814');

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passedTests}/${totalTests} PASSED, ${failedTests} FAILED`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
