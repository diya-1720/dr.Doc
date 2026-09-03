const assert = require('assert');
const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('====================================================');
  console.log('DR. DOC // TESTING ADMIN PORTAL & DYNAMIC API KEY');
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

  // 1. Admin Login with correct credentials
  await testAsync('Admin Login succeeds with admin@1234 / 12345678', async () => {
    const res = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin@1234',
        password: '12345678'
      })
    });

    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.token, 'Token must be returned');
  });

  // 2. Admin Login with invalid credentials
  await testAsync('Admin Login fails with incorrect credentials', async () => {
    const res = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'wrong_user',
        password: 'wrong_password'
      })
    });

    assert.strictEqual(res.status, 401);
    const json = await res.json();
    assert.strictEqual(json.success, false);
  });

  // 3. Get API Key Status
  await testAsync('GET /api/admin/api-key returns key configuration status', async () => {
    const res = await fetch('http://localhost:5000/api/admin/api-key');
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.maskedKey !== undefined, 'maskedKey field must exist');
  });

  // 4. Update Gemini API Key dynamically
  await testAsync('POST /api/admin/api-key updates runtime and .env files', async () => {
    const testKey = 'AIzaSyTestKey_DynamicUpdate_998877';
    const res = await fetch('http://localhost:5000/api/admin/api-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: testKey
      })
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.ok(json.data.maskedKey.includes('AIzaSy'), 'Masked key must reflect new key');

    // Verify .env file updated
    const rootEnv = path.resolve(__dirname, '.env');
    if (fs.existsSync(rootEnv)) {
      const content = fs.readFileSync(rootEnv, 'utf-8');
      assert.ok(content.includes('GEMINI_API_KEY=AIzaSyTestKey_DynamicUpdate_998877'), '.env must contain new key');
    }

    // Verify GET reflects new masked key
    const verifyRes = await fetch('http://localhost:5000/api/admin/api-key');
    const verifyJson = await verifyRes.json();
    assert.ok(verifyJson.data.maskedKey.includes('AIzaSy'));
  });

  // 5. Test Key endpoint handles empty or dummy key appropriately
  await testAsync('POST /api/admin/api-key/test handles quota / validation checks', async () => {
    const res = await fetch('http://localhost:5000/api/admin/api-key/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: 'AIzaSyDummyKeyForTestingQuotaFlow'
      })
    });

    // Dummy key will return 400 with descriptive error message (as expected for mock key)
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.ok(json.error, 'Error message must be returned');
  });

  console.log('\n====================================================');
  console.log(`ADMIN FEATURE TEST SUMMARY: ${passCount} Passed, ${failCount} Failed`);
  console.log('====================================================');

  if (failCount > 0) {
    process.exitCode = 1;
  } else {
    process.exitCode = 0;
  }
}

runTests();
