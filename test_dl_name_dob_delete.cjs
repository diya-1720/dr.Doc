const assert = require('assert');
const { extractFieldsFromText } = require('./backend/utils/ocrExtractor');

async function runTests() {
  console.log('====================================================');
  console.log('DR. DOC // TESTING DL NAME, DOB 29/20, & EARLY DELETE');
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

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passCount++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    -> ${err.message}`);
      failCount++;
    }
  }

  // 1. Driving License Name vs Address Extraction Test
  test('Driving License: extracts name "Ved Nishad Gharat" instead of address line', () => {
    const rawOcrText = `
INDIAN UNION DRIVING LICENCE
MAHARASHTRA MOTOR VEHICLES DEPT
DL No: MH48 20260023357
Name: VED NISHAD GHARAT
S/W/D of: NISHAD GHARAT
DOB: 29/03/2008
Blood Group: O+
DOI: 20/05/2024
Valid Till: 20/03/2028
Address: 80 A KAMARE ROAD NEAR GOVT BOYS HOSTEL
GRAM NAVALI PALGHAR 401404
`;
    const result = extractFieldsFromText(rawOcrText);
    assert.strictEqual(result.documentType, 'Driving License');
    assert.strictEqual(result.applicantName, 'Ved Nishad Gharat');
    assert.notStrictEqual(result.applicantName, 'Kamare Road Near Govt Boys Hostel Gram Navali Palghar');
  });

  // 2. Unlabeled Driving License (spatial scan between DL NO and S/W/D or DOB)
  test('Driving License (Unlabeled): extracts name and ignores multi-word address at bottom', () => {
    const rawOcrText = `
UNION OF INDIA
DRIVING LICENCE
MH48-20260023357
VED NISHAD GHARAT
S/W/D NISHAD GHARAT
DOB 29-03-2008
BG O+
80 A KAMARE ROAD NEAR GOVT BOYS HOSTEL GRAM NAVALI PALGHAR 401404
`;
    const result = extractFieldsFromText(rawOcrText);
    assert.strictEqual(result.applicantName, 'Ved Nishad Gharat');
    assert.ok(!result.applicantName.toLowerCase().includes('kamare'));
    assert.ok(!result.applicantName.toLowerCase().includes('hostel'));
    assert.ok(!result.applicantName.toLowerCase().includes('palghar'));
  });

  // 3. Date of Birth Extraction: 29 vs 20 (DOI / Validity interference)
  test('DOB Extraction: extracts day 29/03/2008 and does not pick issue date 20/05/2024', () => {
    const rawOcrText = `
DRIVING LICENCE
DL No: MH48 20260023357
Name: VED NISHAD GHARAT
DOI: 20/05/2024
DOB: 29/03/2008
Valid Till: 20/03/2028
`;
    const result = extractFieldsFromText(rawOcrText);
    assert.strictEqual(result.dob, '29/03/2008');
    assert.notStrictEqual(result.dob, '20/05/2024');
    assert.notStrictEqual(result.dob, '20/03/2028');
  });

  // 4. DOB Extraction with hyphen or dot formatting
  test('DOB Extraction: correctly extracts "29-03-2008" as "29/03/2008"', () => {
    const rawOcrText = `
Name: VED NISHAD GHARAT
Date of Birth: 29-03-2008
Issue Date: 20-05-2024
`;
    const result = extractFieldsFromText(rawOcrText);
    assert.strictEqual(result.dob, '29/03/2008');
  });

  // 5. Early QR Code Deletion & Revocation API Test
  await testAsync('DELETE /api/share/:shareId immediately destroys share session', async () => {
    // A. Create session
    const createRes = await fetch('http://localhost:5000/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantName: 'Ved Nishad Gharat',
        documents: []
      })
    });
    assert.strictEqual(createRes.status, 201);
    const createJson = await createRes.json();
    const shareId = createJson.data.shareId;

    // B. Verify active session exists
    const getRes1 = await fetch(`http://localhost:5000/api/share/${shareId}`);
    assert.strictEqual(getRes1.status, 200);

    // C. Early Delete Session
    const delRes = await fetch(`http://localhost:5000/api/share/${shareId}`, {
      method: 'DELETE'
    });
    assert.strictEqual(delRes.status, 200);
    const delJson = await delRes.json();
    assert.strictEqual(delJson.success, true);
    assert.strictEqual(delJson.deleted, true);

    // D. Verify session is now revoked / 404
    const getRes2 = await fetch(`http://localhost:5000/api/share/${shareId}`);
    assert.strictEqual(getRes2.status, 404);
    const getJson2 = await getRes2.json();
    assert.strictEqual(getJson2.expired, true);
  });

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
  console.log('====================================================');

  if (failCount > 0) {
    process.exitCode = 1;
  } else {
    process.exitCode = 0;
  }
}

runTests();
