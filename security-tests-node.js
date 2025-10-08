// Security Test Suite for D4H Mail Helper (Node.js Compatible)
// Run with: node security-tests-node.js

console.log('=== D4H Mail Helper Security Tests ===\n');

// Test 1: URL Validation Function
console.log('Test 1: URL Validation');
const isValidD4HURL = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Only allow HTTP and HTTPS protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return false;
    }
    
    // Only allow d4h.com, d4h.org, and team-manager.us.d4h.com domains
    const allowedDomains = [
      'd4h.com',
      'd4h.org',
      'app.d4h.com',
      'secure.d4h.com',
      'team-manager.us.d4h.com'
    ];
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    );
  } catch (e) {
    return false;
  }
};

const test1Cases = [
  { url: 'https://app.d4h.com/team/exercises', expected: true, desc: 'Valid app.d4h.com URL' },
  { url: 'https://team.d4h.com/team/exercises', expected: true, desc: 'Valid subdomain' },
  { url: 'https://secure.d4h.com/team/incidents', expected: true, desc: 'Valid secure.d4h.com' },
  { url: 'https://evil.com/team/exercises', expected: false, desc: 'Malicious external domain' },
  { url: 'https://d4h.com.evil.com/team/exercises', expected: false, desc: 'Domain spoofing attempt' },
  { url: 'javascript:alert(1)', expected: false, desc: 'JavaScript protocol injection' },
  { url: 'https://example.d4h.org/team/events', expected: true, desc: 'Valid d4h.org subdomain' },
  { url: 'not a url', expected: false, desc: 'Invalid URL format' },
  { url: 'http://app.d4h.com/test', expected: true, desc: 'HTTP protocol (should allow)' },
  { url: 'ftp://d4h.com/file', expected: false, desc: 'FTP protocol (should reject)' }
];

let test1Passed = 0;
test1Cases.forEach((testCase, i) => {
  const result = isValidD4HURL(testCase.url);
  const passed = result === testCase.expected;
  const icon = passed ? '✓' : '✗';
  console.log(`  ${i + 1}. ${icon} ${testCase.desc}`);
  console.log(`     URL: ${testCase.url}`);
  console.log(`     Result: ${result}, Expected: ${testCase.expected}`);
  if (passed) test1Passed++;
});
console.log(`\nTest 1 Result: ${test1Passed}/${test1Cases.length} passed\n`);

// Test 2: Edge Cases and Security Scenarios
console.log('Test 2: Edge Cases');
const test2Cases = [
  { url: 'HTTPS://APP.D4H.COM/TEAM/EXERCISES', expected: true, desc: 'Uppercase URL' },
  { url: 'https://d4h.com/../../../etc/passwd', expected: true, desc: 'Path traversal (normalized by URL API)' },
  { url: 'https://d4h.com@evil.com', expected: false, desc: 'Username in URL' },
  { url: '', expected: false, desc: 'Empty string' },
  { url: null, expected: false, desc: 'Null value' },
];

let test2Passed = 0;
test2Cases.forEach((testCase, i) => {
  try {
    const result = isValidD4HURL(testCase.url);
    const passed = result === testCase.expected;
    const icon = passed ? '✓' : '✗';
    console.log(`  ${i + 1}. ${icon} ${testCase.desc}`);
    console.log(`     URL: ${testCase.url}`);
    console.log(`     Result: ${result}, Expected: ${testCase.expected}`);
    if (passed) test2Passed++;
  } catch (e) {
    // If it throws and expected false, that's okay
    const passed = testCase.expected === false;
    const icon = passed ? '✓' : '✗';
    console.log(`  ${i + 1}. ${icon} ${testCase.desc} (threw exception)`);
    if (passed) test2Passed++;
  }
});
console.log(`\nTest 2 Result: ${test2Passed}/${test2Cases.length} passed\n`);

// Test 3: Domain Validation Logic
console.log('Test 3: Domain Validation Logic');
const testDomainLogic = () => {
  const tests = [];
  
  // Test exact match
  tests.push({
    desc: 'Exact match for app.d4h.com',
    result: isValidD4HURL('https://app.d4h.com/test'),
    expected: true
  });
  
  // Test subdomain
  tests.push({
    desc: 'Subdomain of d4h.com',
    result: isValidD4HURL('https://team.d4h.com/test'),
    expected: true
  });
  
  // Test NOT a subdomain (domain spoofing)
  tests.push({
    desc: 'Domain spoofing with d4h.com in path',
    result: isValidD4HURL('https://evil.com/d4h.com'),
    expected: false
  });
  
  // Test similar but different domain
  tests.push({
    desc: 'Similar domain d4h.net',
    result: isValidD4HURL('https://d4h.net/test'),
    expected: false
  });
  
  let passed = 0;
  tests.forEach((test, i) => {
    const ok = test.result === test.expected;
    const icon = ok ? '✓' : '✗';
    console.log(`  ${i + 1}. ${icon} ${test.desc}`);
    console.log(`     Result: ${test.result}, Expected: ${test.expected}`);
    if (ok) passed++;
  });
  
  return { passed, total: tests.length };
};

const test3Result = testDomainLogic();
console.log(`\nTest 3 Result: ${test3Result.passed}/${test3Result.total} passed\n`);

// Summary
const totalTests = test1Cases.length + test2Cases.length + test3Result.total;
const totalPassed = test1Passed + test2Passed + test3Result.passed;
console.log('=== Test Summary ===');
console.log(`Total: ${totalPassed}/${totalTests} tests passed`);
if (totalPassed === totalTests) {
  console.log('Result: ✓ ALL TESTS PASSED ✓');
  console.log('\nSecurity validations are working correctly!');
  process.exit(0);
} else {
  console.log('Result: ✗ SOME TESTS FAILED ✗');
  console.log(`\n${totalTests - totalPassed} test(s) failed`);
  process.exit(1);
}
