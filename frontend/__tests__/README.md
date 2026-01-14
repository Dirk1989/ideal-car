# IdealCar Test Suite

## Overview
Comprehensive test suite for the IdealCar application covering all API endpoints and critical integrations.

## Test Files

### API Tests
- **`__tests__/api/vehicles.test.ts`** - Tests vehicle CRUD operations, dealer associations, and error handling
- **`__tests__/api/dealers.test.ts`** - Tests dealer management operations
- **`__tests__/api/blogs.test.ts`** - Tests blog post operations
- **`__tests__/api/leads.test.ts`** - Tests lead submission and management

### Integration Tests
- **`__tests__/integration/dealer-vehicle.test.ts`** - Tests dealer-vehicle relationships, filtering, and updates

## Running Tests

### Prerequisites
```powershell
cd c:\Users\dirkl\ideal-car\frontend
npm install
```

### Run All Tests
```powershell
npm test
```

### Run Specific Test File
```powershell
npm test -- __tests__/api/vehicles.test.ts
```

### Watch Mode (Auto-rerun on changes)
```powershell
npm run test:watch
```

### Coverage Report
```powershell
npm run test:coverage
```

### Using Test Runner Script
```powershell
cd c:\Users\dirkl\ideal-car
.\scripts\run-tests.ps1
```

This script will:
1. Install dependencies if needed
2. Start dev server if not running
3. Run all tests
4. Report results
5. Clean up

## Production Readiness Check

Run comprehensive production checks:
```powershell
cd c:\Users\dirkl\ideal-car
.\scripts\production-check.ps1
```

This checks:
- All API endpoints
- All public pages
- All admin pages
- Data file integrity
- Critical feature functionality

## Test Coverage

### Vehicles API
- ✓ GET all vehicles
- ✓ POST create vehicle
- ✓ POST create vehicle with dealer
- ✓ PUT update vehicle
- ✓ DELETE vehicle
- ✓ Error handling (404, 400)

### Dealers API
- ✓ GET all dealers
- ✓ POST create dealer
- ✓ DELETE dealer
- ✓ Error handling (404)

### Blogs API
- ✓ GET all blogs
- ✓ POST create blog
- ✓ DELETE blog
- ✓ Error handling (404)

### Leads API
- ✓ GET all leads
- ✓ POST create lead
- ✓ DELETE lead
- ✓ Partial data handling

### Integration Tests
- ✓ Vehicle-dealer association
- ✓ Filtering vehicles by dealer
- ✓ Updating dealer association
- ✓ Multiple vehicles per dealer
- ✓ Vehicles without dealers

## Configuration

Tests are configured in `jest.config.json`:
- Uses `ts-jest` for TypeScript support
- 30-second timeout for network requests
- Auto-discovers test files in `__tests__` directory
- Runs setup file before each test suite

## Environment Variables

- `TEST_URL` - Base URL for API tests (default: `http://localhost:3000`)

Set custom URL:
```powershell
$env:TEST_URL = "http://localhost:3000"
npm test
```

## Troubleshooting

### Dev Server Not Running
Tests require the dev server to be running:
```powershell
cd c:\Users\dirkl\ideal-car\frontend
npm run dev
```

### Port Already in Use
If port 3000 is busy, either:
1. Stop the process using port 3000
2. Set a different port and update TEST_URL

### Test Failures After Code Changes
1. Restart the dev server to pick up changes
2. Clear any test data from JSON files if needed
3. Re-run tests

## CI/CD Integration

To run tests in CI/CD pipeline:

```yaml
- name: Install dependencies
  run: npm install

- name: Start dev server
  run: npm run dev &
  
- name: Wait for server
  run: sleep 10

- name: Run tests
  run: npm test
  env:
    TEST_URL: http://localhost:3000

- name: Generate coverage
  run: npm run test:coverage
```

## Adding New Tests

1. Create test file in `__tests__` directory
2. Import test utilities:
```typescript
import { describe, it, expect } from '@jest/globals'
```

3. Write tests following existing patterns
4. Run tests to verify

Example:
```typescript
describe('My Feature', () => {
  it('should do something', async () => {
    const result = await myFunction()
    expect(result).toBe(expectedValue)
  })
})
```

## Support

For issues or questions about tests:
1. Check test output for specific error messages
2. Verify dev server is running
3. Check data file integrity
4. Review PRODUCTION_READINESS.md for setup details
