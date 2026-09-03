const assert = require('assert');

async function runTests() {
  console.log('====================================================');
  console.log('DR. DOC // TESTING 30-MINUTE QR CODE & SHARE SERVICE');
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

  // 1. Backend API: POST /api/share
  await testAsync('Backend API creates 30-minute share session with correct expiresAt', async () => {
    const res = await fetch('http://localhost:5000/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseId: 'DR-TEST-001',
        applicantName: 'Rohan Ramesh Patil',
        readinessScore: 98,
        documents: [
          {
            id: 'doc-1',
            originalFilename: 'aadhaar_scan.jpg',
            classifiedFilename: 'AADHAAR_CARD_ROHAN_RAMESH_PATIL.pdf',
            documentType: 'Aadhaar Card',
            format: 'pdf',
            mimeType: 'application/pdf',
            dataUrl: 'data:application/pdf;base64,JVBERi0xLjQK...',
            fileSizeBytes: 204800,
            qualityScore: 96,
            verificationStatus: 'VERIFIED'
          }
        ],
        hasMergedPdf: true,
        mergedPdfDataUrl: 'data:application/pdf;base64,JVBERi0xLjQK...',
        hasReport: true
      })
    });

    assert.strictEqual(res.status, 201, `Expected status 201, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.shareId, 'shareId must be returned');
    assert.strictEqual(json.data.ttlMinutes, 30);
    assert.ok(json.data.expiresAt > Date.now() + 29 * 60 * 1000, 'expiresAt must be ~30 minutes in future');

    // 2. Backend API: GET /api/share/:shareId
    const getRes = await fetch(`http://localhost:5000/api/share/${json.data.shareId}`);
    assert.strictEqual(getRes.status, 200);
    const getJson = await getRes.json();
    assert.strictEqual(getJson.success, true);
    assert.strictEqual(getJson.data.applicantName, 'Rohan Ramesh Patil');
    assert.strictEqual(getJson.data.documents.length, 1);
    assert.strictEqual(getJson.data.documents[0].classifiedFilename, 'AADHAAR_CARD_ROHAN_RAMESH_PATIL.pdf');
    assert.ok(getJson.data.remainingSeconds > 1750, 'remainingSeconds should be close to 1800');
  });

  // 3. Non-existent / Expired Session Check
  await testAsync('Backend API returns 404 / expired for invalid shareId', async () => {
    const res = await fetch('http://localhost:5000/api/share/invalid_session_id_12345');
    assert.strictEqual(res.status, 404);
    const json = await res.json();
    assert.strictEqual(json.expired, true);
  });

  console.log('\n====================================================');
  console.log(`SHARE FEATURE TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
  console.log('====================================================');

  if (failCount > 0) {
    process.exitCode = 1;
  } else {
    process.exitCode = 0;
  }
}

runTests();
