require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test users and domains from environment
const TEST_USERS = process.env.TEST_USERS 
  ? process.env.TEST_USERS.split(',').map(e => e.trim()) 
  : ['test@example.com'];
  
const ALLOWED_DOMAINS = process.env.ALLOWED_DOMAINS 
  ? process.env.ALLOWED_DOMAINS.split(',').map(d => d.trim()) 
  : [];

console.log('🧪 TESTING MODE - No real OAuth required');
console.log('✅ Test users:', TEST_USERS);
console.log('🌐 Allowed domains:', ALLOWED_DOMAINS.length > 0 ? ALLOWED_DOMAINS : 'All domains');

// API Key verification middleware
const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or missing API key',
      hint: 'Add header: X-API-Key: ' + process.env.API_KEY
    });
  }
  
  next();
};

// Mock token verification for testing
function verifyTestUser(email) {
  if (!email) {
    return {
      authorized: false,
      reason: 'missing_email',
      message: 'Email is required'
    };
  }

  // Check if user is in test users list
  if (!TEST_USERS.includes(email)) {
    return {
      authorized: false,
      reason: 'user_not_in_test_list',
      message: `Email ${email} not in TEST_USERS. Add to .env: TEST_USERS=${email}`
    };
  }
  
  // Check domain restriction if configured
  if (ALLOWED_DOMAINS.length > 0) {
    const domain = email.split('@')[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
      return {
        authorized: false,
        reason: 'domain_not_allowed',
        message: `Domain ${domain} not in ALLOWED_DOMAINS`
      };
    }
  }
  
  return {
    authorized: true,
    user: {
      email: email,
      name: email.split('@')[0],
      picture: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
    }
  };
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mode: 'TESTING - No OAuth',
    timestamp: new Date().toISOString(),
    service: 'My Custom GPT Service',
    testUsers: TEST_USERS,
    allowedDomains: ALLOWED_DOMAINS
  });
});

// Verify endpoint - main authentication endpoint
app.post('/verify', verifyApiKey, async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ 
      error: 'Bad Request', 
      message: 'Email is required for testing',
      example: { email: 'test@example.com' }
    });
  }
  
  const result = verifyTestUser(email);
  
  if (!result.authorized) {
    return res.status(403).json({
      authorized: false,
      reason: result.reason,
      message: result.message
    });
  }
  
  res.json({
    authorized: true,
    user: result.user,
    message: 'User is authorized (TEST MODE)',
    note: 'This is testing mode. In production, use real Google OAuth tokens.'
  });
});

// Test login endpoint - untuk simulasi login
app.post('/test-login', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      error: 'Email required',
      availableTestUsers: TEST_USERS
    });
  }
  
  const result = verifyTestUser(email);
  
  if (!result.authorized) {
    return res.status(403).json(result);
  }
  
  // Generate mock token
  const mockToken = Buffer.from(JSON.stringify({
    email: email,
    exp: Date.now() + 3600000, // 1 hour
    iat: Date.now()
  })).toString('base64');
  
  res.json({
    success: true,
    token: mockToken,
    user: result.user,
    message: 'Test login successful'
  });
});

// Custom endpoints


// List test users endpoint
app.get('/test-users', verifyApiKey, (req, res) => {
  res.json({
    testUsers: TEST_USERS,
    allowedDomains: ALLOWED_DOMAINS,
    note: 'Use these emails for testing. Add more in .env file: TEST_USERS=email1,email2'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
============================================================`);
  console.log(`🚀 GuardGPT Backend (TESTING MODE) running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔑 API Key: ${process.env.API_KEY}`);
  console.log(`
✅ Test Users:`);
  TEST_USERS.forEach(user => console.log(`   • ${user}`));
  console.log(`
💡 Quick Test:`);
  console.log(`   curl http://localhost:${PORT}/health`);
  console.log(`
📚 Endpoints:`);
  console.log(`   GET  /health       - Health check`);
  console.log(`   POST /verify       - Verify user (requires email in body)`);
  console.log(`   POST /test-login   - Simulate login`);
  console.log(`   GET  /test-users   - List test users`);
  console.log(`============================================================
`);
});
