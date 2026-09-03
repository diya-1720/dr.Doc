const http = require('http');

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

function request(options, bodyData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (_) {}
        resolve({ status: res.statusCode, headers: res.headers, raw: data, json });
      });
    });
    req.on('error', reject);
    if (bodyData) {
      req.write(typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData));
    }
    req.end();
  });
}

async function runShareTests() {
  console.log('====================================================');
  console.log('TEST SUITE: QR SECURE SHARE & DOWNLOAD API');
  console.log('====================================================');

  const sampleFileContent = Buffer.from('DR. DOC VERIFIED CASE FILE TEST CONTENT').toString('base64');

  // 1. Create Share Session
  const createPayload = {
    caseId: 'CASE-TEST-2026',
    applicationName: 'Passport Renewal Verification',
    expiryHours: 24,
    files: [
      {
        id: 'file_pdf_1',
        name: 'CONSOLIDATED_APPLICATION_CASE-TEST-2026.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1024,
        category: 'BUNDLE',
        base64Data: `data:application/pdf;base64,${sampleFileContent}`,
      },
      {
        id: 'file_txt_2',
        name: 'OCR_EXTRACTED_DATA.txt',
        mimeType: 'text/plain',
        sizeBytes: 512,
        category: 'OCR',
        base64Data: `data:text/plain;base64,${sampleFileContent}`,
      },
    ],
  };

  const createRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/share',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    createPayload
  );

  assert(createRes.status === 201, `POST /api/share returned HTTP 201 (got ${createRes.status})`);
  assert(createRes.json && createRes.json.success === true, 'Response contains success: true');
  assert(createRes.json && typeof createRes.json.token === 'string', 'Generated token is a string');
  assert(createRes.json && createRes.json.fileCount === 2, 'Reported file count is 2');

  const token = createRes.json.token;

  // 2. Fetch Share Metadata
  const getRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/share/${token}`,
    method: 'GET',
  });

  assert(getRes.status === 200, `GET /api/share/:token returned HTTP 200 (got ${getRes.status})`);
  assert(getRes.json && getRes.json.success === true, 'Public metadata response success: true');
  assert(getRes.json && getRes.json.data.caseId === 'CASE-TEST-2026', 'Case ID matches CASE-TEST-2026');
  assert(getRes.json && getRes.json.data.files.length === 2, 'Files list contains 2 public items');
  assert(!getRes.raw.includes('filePath'), 'Internal filesystem paths are NOT leaked in response');

  // 3. Download Single File
  const downloadRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/share/${token}/download/file_pdf_1`,
    method: 'GET',
  });

  assert(downloadRes.status === 200, `GET download file returned HTTP 200 (got ${downloadRes.status})`);
  assert(downloadRes.headers['content-disposition'].includes('CONSOLIDATED_APPLICATION_CASE-TEST-2026.pdf'), 'Content-Disposition header includes attachment filename');
  assert(downloadRes.raw === 'DR. DOC VERIFIED CASE FILE TEST CONTENT', 'Downloaded file content matches exactly');

  // 4. Test Invalid Token
  const invalidRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/share/non_existent_token_12345',
    method: 'GET',
  });

  assert(invalidRes.status === 404, `Invalid token returns HTTP 404 (got ${invalidRes.status})`);

  console.log('\n====================================================');
  console.log(`SHARE API RESULTS: ${passedTests}/${totalTests} PASSED, ${failedTests} FAILED`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runShareTests().catch((err) => {
  console.error('Test script encountered an error:', err);
  process.exit(1);
});
