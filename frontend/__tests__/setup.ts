// __tests__/setup.ts
// Global test setup file

beforeAll(() => {
  // Set test environment
  process.env.TEST_URL = process.env.TEST_URL || 'http://localhost:3000'
  console.log(`Running tests against: ${process.env.TEST_URL}`)
})

afterAll(async () => {
  // Any global cleanup
  console.log('Tests completed')
})
