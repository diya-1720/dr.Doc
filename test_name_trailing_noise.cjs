const assert = require('assert');
const { extractFieldsFromText } = require('./backend/utils/ocrExtractor');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

console.log('====================================================');
console.log('DR. DOC // NAME EXTRACTION & TRAILING NOISE TEST');
console.log('====================================================');

console.log('\n[SECTION 1: User Required Cases]');

test('Case 1: Aadhaar "VED NISHAD GHARAT" remains completely intact', () => {
  const docText = `
GOVERNMENT OF INDIA
वेद निशाद घरत
VED NISHAD GHARAT
DOB: 29/03/2008
MALE
2500 6999 1814
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.applicantName, 'Ved Nishad Gharat');
});

test('Case 2: Driving Licence OCR candidate "VED GHARAT EE" -> "Ved Gharat"', () => {
  const docText = `
INDIAN UNION DRIVING LICENCE
MAHARASHTRA MOTOR VEHICLES DEPT
DL No: MH48 20260023357
Name: VED GHARAT EE
DOB: 29/03/2008
DOI: 20/05/2024
Address: 80 A Kamare Road Palghar 401404
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.applicantName, 'Ved Gharat');
});

test('Case 3: Driving Licence OCR candidate "VED GHARAT E" -> "Ved Gharat"', () => {
  const docText = `
INDIAN UNION DRIVING LICENCE
MAHARASHTRA MOTOR VEHICLES DEPT
DL No: MH48 20260023357
Name: VED GHARAT E
DOB: 29/03/2008
DOI: 20/05/2024
Address: 80 A Kamare Road Palghar 401404
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.applicantName, 'Ved Gharat');
});

test('Case 4: Legitimate name ending in E/EE: "RAJEE" is NOT truncated', () => {
  const docText = `
GOVERNMENT OF INDIA
Name: RAJEE
DOB: 15/08/1995
MALE
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.applicantName, 'Rajee');
});

test('Case 4b: Legitimate full name: "ANJALI RAJEE" is NOT truncated', () => {
  const docText = `
GOVERNMENT OF INDIA
Name: ANJALI RAJEE
DOB: 15/08/1995
FEMALE
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.applicantName, 'Anjali Rajee');
});

test('Case 4c: Legitimate name: "DEEPIKA" is NOT truncated', () => {
  const docText = `
GOVERNMENT OF INDIA
Name: DEEPIKA
DOB: 15/08/1995
FEMALE
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.applicantName, 'Deepika');
});

test('Case 5: Name with middle name: "VED NISHAD GHARAT" -> "Ved Nishad Gharat"', () => {
  const docText = `
INDIAN UNION DRIVING LICENCE
Name: VED NISHAD GHARAT
DOB: 29/03/2008
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.applicantName, 'Ved Nishad Gharat');
});

test('Case 6: Name without middle name: "VED GHARAT" -> "Ved Gharat"', () => {
  const docText = `
INDIAN UNION DRIVING LICENCE
Name: VED GHARAT
DOB: 29/03/2008
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.applicantName, 'Ved Gharat');
});

test('Case 7: DL with chip noise "VED GHARAT REE" -> "Ved Gharat"', () => {
  const docText = `
INDIAN UNION DRIVING LICENCE
Name: VED GHARAT REE
DOB: 29/03/2008
`;
  const res = extractFieldsFromText(docText);
  assert.strictEqual(res.applicantName, 'Ved Gharat');
});

console.log('\n====================================================');
console.log(`SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('====================================================');

if (failCount > 0) {
  process.exitCode = 1;
} else {
  process.exitCode = 0;
}
