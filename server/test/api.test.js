const assert = require('assert');
const validateLead = require('../src/middleware/validateLead');
const requireAuth = require('../src/middleware/requireAuth');
const jwt = require('jsonwebtoken');

console.log('--- Running LeadDesk Mini API Unit Tests ---');

// Mock response builder
const createMockRes = () => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
  return res;
};

// 1. Test validateLead - Success
{
  const req = {
    body: {
      name: '  Jane Doe  ',
      email: 'Jane.Doe@Example.com ',
      budgetRange: '5-10k',
      message: 'Looking for web design services for our brand.'
    }
  };
  const res = createMockRes();
  let calledNext = false;
  validateLead(req, res, () => { calledNext = true; });

  assert.strictEqual(calledNext, true, 'Valid lead should pass middleware');
  assert.strictEqual(req.validatedLead.name, 'Jane Doe');
  assert.strictEqual(req.validatedLead.email, 'jane.doe@example.com');
  assert.strictEqual(req.validatedLead.budgetRange, '5-10k');
  console.log('✓ Test 1 Passed: Valid lead input passes validation & trims/lowercases inputs.');
}

// 2. Test validateLead - Name length error
{
  const req = {
    body: {
      name: 'A',
      email: 'jane@example.com',
      budgetRange: '5-10k',
      message: 'Looking for web design services for our brand.'
    }
  };
  const res = createMockRes();
  validateLead(req, res, () => {});

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.error, 'Name must be between 2 and 80 characters.');
  console.log('✓ Test 2 Passed: Short name correctly triggers 400 error.');
}

// 3. Test validateLead - Email regex error
{
  const req = {
    body: {
      name: 'Jane Doe',
      email: 'invalid-email-address',
      budgetRange: '5-10k',
      message: 'Looking for web design services for our brand.'
    }
  };
  const res = createMockRes();
  validateLead(req, res, () => {});

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.error, 'Enter a valid email address.');
  console.log('✓ Test 3 Passed: Invalid email correctly triggers 400 error.');
}

// 4. Test validateLead - Budget range error
{
  const req = {
    body: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      budgetRange: '50k+',
      message: 'Looking for web design services for our brand.'
    }
  };
  const res = createMockRes();
  validateLead(req, res, () => {});

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.error, 'Select a valid budget range.');
  console.log('✓ Test 4 Passed: Invalid budget range correctly triggers 400 error.');
}

// 5. Test validateLead - Short message error
{
  const req = {
    body: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      budgetRange: '<5k',
      message: 'Hi'
    }
  };
  const res = createMockRes();
  validateLead(req, res, () => {});

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.error, 'Message must be between 10 and 1000 characters.');
  console.log('✓ Test 5 Passed: Short message correctly triggers 400 error.');
}

// 6. Test requireAuth - Missing header
{
  const req = { headers: {} };
  const res = createMockRes();
  requireAuth(req, res, () => {});

  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body.error, 'Not authenticated.');
  console.log('✓ Test 6 Passed: Missing token returns 401 Not authenticated.');
}

// 7. Test requireAuth - Valid token
{
  process.env.JWT_SECRET = 'test_secret';
  const validToken = jwt.sign({ username: 'admin' }, 'test_secret', { expiresIn: '1h' });
  const req = { headers: { authorization: `Bearer ${validToken}` } };
  const res = createMockRes();
  let calledNext = false;
  requireAuth(req, res, () => { calledNext = true; });

  assert.strictEqual(calledNext, true);
  assert.strictEqual(req.user.username, 'admin');
  console.log('✓ Test 7 Passed: Valid JWT token authenticates successfully.');
}

// 8. Test requireAuth - Expired token
{
  process.env.JWT_SECRET = 'test_secret';
  const expiredToken = jwt.sign({ username: 'admin' }, 'test_secret', { expiresIn: '-1s' });
  const req = { headers: { authorization: `Bearer ${expiredToken}` } };
  const res = createMockRes();
  requireAuth(req, res, () => {});

  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body.error, 'Session expired. Please log in again.');
  console.log('✓ Test 8 Passed: Expired JWT token returns 401 Session expired message.');
}

console.log('--- ALL API UNIT TESTS PASSED SUCCESSFULLY! ---');
