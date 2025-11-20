#!/bin/bash

# Fathom-0x Protocol Deployment Test Script
# This script tests the entire deployment process

set -e  # Exit on error

echo "🧪 Testing Fathom-0x Protocol Deployment"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
test_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $1"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $1"
        ((TESTS_FAILED++))
    fi
}

# Test 1: Check Sui CLI
echo "Test 1: Checking Sui CLI..."
sui --version > /dev/null 2>&1
test_result "Sui CLI installed"

# Test 2: Check Node.js
echo "Test 2: Checking Node.js..."
node --version > /dev/null 2>&1
test_result "Node.js installed"

# Test 3: Check Python
echo "Test 3: Checking Python..."
python3 --version > /dev/null 2>&1
test_result "Python 3 installed"

# Test 4: Check contract structure
echo "Test 4: Checking contract structure..."
[ -f "contracts/sources/fathom.move" ] && [ -f "contracts/Move.toml" ]
test_result "Contract files exist"

# Test 5: Build contract
echo "Test 5: Building contract..."
cd contracts
sui move build > /dev/null 2>&1
test_result "Contract builds successfully"
cd ..

# Test 6: Check oracle structure
echo "Test 6: Checking oracle structure..."
[ -f "oracle-node/oracle_node.py" ] && [ -f "oracle-node/requirements.txt" ]
test_result "Oracle files exist"

# Test 7: Check frontend structure
echo "Test 7: Checking frontend structure..."
[ -f "frontend/package.json" ] && [ -f "frontend/next.config.js" ]
test_result "Frontend files exist"

# Test 8: Check documentation
echo "Test 8: Checking documentation..."
[ -f "README.md" ] && [ -f "DEPLOYMENT_GUIDE.md" ] && [ -f "LICENSE" ]
test_result "Required documentation exists"

# Test 9: Check .gitignore
echo "Test 9: Checking .gitignore..."
grep -q "node_modules" .gitignore && grep -q ".env" .gitignore
test_result ".gitignore properly configured"

# Test 10: Check for sensitive data
echo "Test 10: Checking for sensitive data..."
! git ls-files | xargs grep -l "private.*key.*=" | grep -v ".example" > /dev/null 2>&1
test_result "No private keys in tracked files"

echo ""
echo "======================================"
echo "Test Results:"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Ready for deployment.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please fix the issues above.${NC}"
    exit 1
fi
