const assert = require('assert');
const {
  compareNormalizedNames,
  compareNormalizedAddresses,
  compareNormalizedDobs,
  compareNormalizedGenders,
  compareNormalizedDocNumbers
} = require('./backend/utils/ocrExtractor');

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
console.log('DR. DOC // SMART CROSS-CHECK INTELLIGENCE TEST SUITE');
console.log('====================================================');

console.log('\n[SECTION 1: Smart Name Comparison]');

test('Exact match: "Ved Nishad Gharat" vs "Ved Nishad Gharat"', () => {
  const res = compareNormalizedNames('Ved Nishad Gharat', 'Ved Nishad Gharat');
  assert.strictEqual(res.match, true);
});

test('Case and spacing normalization: "VED  NISHAD   GHARAT" vs "ved nishad gharat"', () => {
  const res = compareNormalizedNames('VED  NISHAD   GHARAT', 'ved nishad gharat');
  assert.strictEqual(res.match, true);
});

test('Middle name addition: "Ved Gharat" vs "Ved Nishad Gharat"', () => {
  const res = compareNormalizedNames('Ved Gharat', 'Ved Nishad Gharat');
  assert.strictEqual(res.match, true);
});

test('Initials expansion: "V. N. Gharat" vs "Ved Nishad Gharat"', () => {
  const res = compareNormalizedNames('V. N. Gharat', 'Ved Nishad Gharat');
  assert.strictEqual(res.match, true);
});

test('Single initial expansion: "V. Gharat" vs "Ved Gharat"', () => {
  const res = compareNormalizedNames('V. Gharat', 'Ved Gharat');
  assert.strictEqual(res.match, true);
});

test('Surname first order: "Gharat Ved" vs "Ved Gharat"', () => {
  const res = compareNormalizedNames('Gharat Ved', 'Ved Gharat');
  assert.strictEqual(res.match, true);
});

test('Surname first 3-word order: "Gharat Ved Nishad" vs "Ved Nishad Gharat"', () => {
  const res = compareNormalizedNames('Gharat Ved Nishad', 'Ved Nishad Gharat');
  assert.strictEqual(res.match, true);
});

test('Honorific prefix normalization: "Mr. Ved Gharat" vs "Ved Gharat"', () => {
  const res = compareNormalizedNames('Mr. Ved Gharat', 'Ved Gharat');
  assert.strictEqual(res.match, true);
});

test('OCR single character typo tolerance: "Ved Nishad Gharat" vs "Ved Nishad Gharatt"', () => {
  const res = compareNormalizedNames('Ved Nishad Gharat', 'Ved Nishad Gharatt');
  assert.strictEqual(res.match, true);
});

test('Contradictory names are correctly identified as MISMATCH: "Ved Gharat" vs "Rahul Sharma"', () => {
  const res = compareNormalizedNames('Ved Gharat', 'Rahul Sharma');
  assert.strictEqual(res.match, false);
});

test('Missing name on one document is "Unable to verify": "Ved Gharat" vs "Not detected"', () => {
  const res = compareNormalizedNames('Ved Gharat', 'Not detected');
  assert.strictEqual(res.match, 'Unable to verify');
});

console.log('\n[SECTION 2: Smart Address Comparison]');

test('Exact PIN match: Full Address vs Short Address with PIN 401404', () => {
  const addr1 = '80 A Kamare Road Near Govt Boys Hostel Gram Navali Palghar 401404 Maharashtra';
  const addr2 = 'Palghar 401404, Maharashtra';
  const res = compareNormalizedAddresses(addr1, addr2);
  assert.strictEqual(res.match, true);
});

test('Abbreviation normalization (Rd -> Road, Nr -> Near)', () => {
  const addr1 = '80 A Kamare Rd Nr Boys Hostel Palghar 401404';
  const addr2 = '80 A Kamare Road Near Boys Hostel Palghar 401404';
  const res = compareNormalizedAddresses(addr1, addr2);
  assert.strictEqual(res.match, true);
});

test('Locality and city token overlap without PIN', () => {
  const addr1 = 'Kamare Road, Palghar, Maharashtra';
  const addr2 = 'Near Govt Boys Hostel, Kamare Road, Palghar';
  const res = compareNormalizedAddresses(addr1, addr2);
  assert.strictEqual(res.match, true);
});

test('Concise address subset match: "Palghar, Maharashtra" vs "80 Kamare Rd, Navali, Palghar, Maharashtra"', () => {
  const addr1 = 'Palghar, Maharashtra';
  const addr2 = '80 Kamare Rd, Navali, Palghar, Maharashtra';
  const res = compareNormalizedAddresses(addr1, addr2);
  assert.strictEqual(res.match, true);
});

test('Contradictory PIN codes are correctly identified as MISMATCH', () => {
  const addr1 = 'Palghar 401404, Maharashtra';
  const addr2 = 'Connaught Place 110001, New Delhi';
  const res = compareNormalizedAddresses(addr1, addr2);
  assert.strictEqual(res.match, false);
});

test('Missing address on single-sided document is "Unable to verify"', () => {
  const addr1 = '80 Kamare Road, Palghar 401404';
  const addr2 = 'Not detected';
  const res = compareNormalizedAddresses(addr1, addr2);
  assert.strictEqual(res.match, 'Unable to verify');
});

console.log('\n[SECTION 3: Date of Birth & Gender Cross-Checks]');

test('Normalized date format match: "29/03/2008" vs "29-03-2008"', () => {
  const res = compareNormalizedDobs('29/03/2008', '29-03-2008');
  assert.strictEqual(res.match, true);
});

test('Year-only match compatibility: "29/03/2008" vs "2008"', () => {
  const res = compareNormalizedDobs('29/03/2008', '2008');
  assert.strictEqual(res.match, true);
});

test('Multilingual gender match: "MALE" vs "पुरुष"', () => {
  const res = compareNormalizedGenders('MALE', 'पुरुष');
  assert.strictEqual(res.match, true);
});

test('Multilingual gender match: "FEMALE" vs "महिला"', () => {
  const res = compareNormalizedGenders('FEMALE', 'महिला');
  assert.strictEqual(res.match, true);
});

test('Different document types do not compare ID numbers (Prevent False Mismatch)', () => {
  const res = compareNormalizedDocNumbers('Driving License', 'MH48 20260023357', 'Aadhaar Card', '2500 6999 1814');
  assert.strictEqual(res.match, 'Unable to verify');
});

console.log('\n====================================================');
console.log(`SUMMARY: ${passCount} Passed, ${failCount} Failed`);
console.log('====================================================');

if (failCount > 0) {
  process.exitCode = 1;
} else {
  process.exitCode = 0;
}
