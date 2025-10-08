#!/bin/bash
# Security Validation Script for D4H Mail Helper
# This script validates that all security measures are in place

echo "=== D4H Mail Helper Security Validation ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

# Function to check if a file contains a pattern
check_pattern() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✓${NC} $description"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗${NC} $description"
        ((FAIL++))
        return 1
    fi
}

echo "Checking manifest.json..."
check_pattern "manifest.json" "content_security_policy" "Content Security Policy is defined"
check_pattern "manifest.json" "clipboardWrite" "Clipboard permission is present"
check_pattern "manifest.json" "manifest_version.*3" "Using Manifest V3"

echo ""
echo "Checking content.js..."
check_pattern "content.js" "escapeHtml" "HTML escaping function exists"
check_pattern "content.js" "isValidD4HURL" "URL validation function exists"
check_pattern "content.js" "protocol.*http" "Protocol validation exists"
check_pattern "content.js" "allowedDomains" "Domain whitelist exists"
check_pattern "content.js" "safeHref" "Safe href variable used"
check_pattern "content.js" "safeText" "Safe text variable used"

echo ""
echo "Checking for security documentation..."
if [ -f "SECURITY.md" ]; then
    echo -e "${GREEN}✓${NC} SECURITY.md exists"
    ((PASS++))
    check_pattern "SECURITY.md" "XSS" "XSS vulnerability documented"
    check_pattern "SECURITY.md" "Content Security Policy" "CSP documented"
else
    echo -e "${RED}✗${NC} SECURITY.md missing"
    ((FAIL++))
fi

echo ""
echo "Checking README.md..."
check_pattern "README.md" "Security" "Security section in README"
check_pattern "README.md" "XSS Prevention" "XSS prevention mentioned"

echo ""
echo "Running automated security tests..."
if node security-tests-node.js > /tmp/security-test-output.txt 2>&1; then
    echo -e "${GREEN}✓${NC} All security tests passed"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Some security tests failed"
    cat /tmp/security-test-output.txt
    ((FAIL++))
fi

echo ""
echo "=== Security Validation Summary ==="
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All security validations passed!${NC}"
    echo "The extension implements proper security measures."
    exit 0
else
    echo -e "${RED}✗ Some validations failed${NC}"
    echo "Please review and fix the issues above."
    exit 1
fi
