// Security Test Suite for D4H Mail Helper
// This file contains tests for the security functions
// Run in browser console to test

console.log('=== D4H Mail Helper Security Tests ===\n');

// Test 1: HTML Escaping Function
console.log('Test 1: HTML Escaping');
const escapeHtml = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

const test1Cases = [
  { input: '<script>alert("XSS")</script>', expected: '&lt;script&gt;alert("XSS")&lt;/script&gt;' },
  { input: '<img src=x onerror=alert(1)>', expected: '&lt;img src=x onerror=alert(1)&gt;' },
  { input: 'Normal text', expected: 'Normal text' },
  { input: 'Text with "quotes" and \'apostrophes\'', contains: 'quotes' }
];

let test1Passed = 0;
test1Cases.forEach((testCase, i) => {
  const result = escapeHtml(testCase.input);
  const passed = testCase.expected ? result === testCase.expected : result.includes(testCase.contains);
  console.log(`  ${i + 1}. ${passed ? '✓' : '✗'} ${testCase.input.substring(0, 30)}...`);
  if (!passed) console.log(`     Expected: ${testCase.expected || testCase.contains}, Got: ${result}`);
  if (passed) test1Passed++;
});
console.log(`Test 1 Result: ${test1Passed}/${test1Cases.length} passed\n`);

// Test 2: URL Validation Function
console.log('Test 2: URL Validation');
const isValidD4HURL = (url) => {
  try {
    const urlObj = new URL(url);
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

const test2Cases = [
  { url: 'https://app.d4h.com/team/exercises', expected: true },
  { url: 'https://team.d4h.com/team/exercises', expected: true },
  { url: 'https://secure.d4h.com/team/incidents', expected: true },
  { url: 'https://evil.com/team/exercises', expected: false },
  { url: 'https://d4h.com.evil.com/team/exercises', expected: false },
  { url: 'javascript:alert(1)', expected: false },
  { url: 'https://example.d4h.org/team/events', expected: true },
  { url: 'not a url', expected: false }
];

let test2Passed = 0;
test2Cases.forEach((testCase, i) => {
  const result = isValidD4HURL(testCase.url);
  const passed = result === testCase.expected;
  console.log(`  ${i + 1}. ${passed ? '✓' : '✗'} ${testCase.url} => ${result}`);
  if (!passed) console.log(`     Expected: ${testCase.expected}`);
  if (passed) test2Passed++;
});
console.log(`Test 2 Result: ${test2Passed}/${test2Cases.length} passed\n`);

// Test 3: makeAnchor with XSS Protection
console.log('Test 3: makeAnchor Function');
const makeAnchor = (href, text) => {
  if (!isValidD4HURL(href)) {
    console.warn('Rejected non-D4H URL:', href);
    return escapeHtml(text);
  }
  const safeHref = escapeHtml(href);
  const safeText = escapeHtml(text.replace(/\s+/g, " ").trim());
  return `<a href="${safeHref}">${safeText}</a>`;
};

const test3Cases = [
  { 
    href: 'https://app.d4h.com/team/exercises/123', 
    text: 'Exercise Name',
    shouldContain: '<a href="https://app.d4h.com/team/exercises/123">Exercise Name</a>'
  },
  { 
    href: 'javascript:alert(1)', 
    text: 'Malicious',
    shouldNotContain: '<a href='
  },
  { 
    href: 'https://app.d4h.com/team/exercises/123', 
    text: '<script>alert("XSS")</script>',
    shouldContain: '&lt;script&gt;'
  },
  {
    href: 'https://evil.com/steal',
    text: 'Click me',
    shouldNotContain: '<a href='
  }
];

let test3Passed = 0;
test3Cases.forEach((testCase, i) => {
  const result = makeAnchor(testCase.href, testCase.text);
  const passed = testCase.shouldContain 
    ? result === testCase.shouldContain 
    : !result.includes(testCase.shouldNotContain);
  console.log(`  ${i + 1}. ${passed ? '✓' : '✗'} makeAnchor("${testCase.href.substring(0, 30)}...", "${testCase.text.substring(0, 20)}...")`);
  if (!passed) {
    console.log(`     Result: ${result}`);
    console.log(`     Expected: ${testCase.shouldContain || 'NOT to contain: ' + testCase.shouldNotContain}`);
  }
  if (passed) test3Passed++;
});
console.log(`Test 3 Result: ${test3Passed}/${test3Cases.length} passed\n`);

// Summary
const totalTests = test1Cases.length + test2Cases.length + test3Cases.length;
const totalPassed = test1Passed + test2Passed + test3Passed;
console.log('=== Test Summary ===');
console.log(`Total: ${totalPassed}/${totalTests} tests passed`);
console.log(`Result: ${totalPassed === totalTests ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);
