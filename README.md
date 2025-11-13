# GuardGPT Backend API - Testing Version

Simple Node.js backend untuk testing Custom GPT Actions tanpa Google OAuth complexity.

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Default values sudah siap pakai untuk testing!

### 3. Run Server
```bash
npm start
```

Server akan running di http://localhost:3000

## 🧪 Testing Mode

Ini adalah **simplified version** untuk testing dan development. Tidak perlu Google OAuth setup yang kompleks!

### Features:
- ✅ Simple API Key authentication
- ✅ Mock user verification (no real OAuth)
- ✅ Test users dari environment variable
- ✅ Domain validation
- ✅ Ready untuk Custom GPT integration
- ✅ Easy to deploy

## 📡 API Endpoints

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "mode": "TESTING - No OAuth",
  "service": "My Custom GPT Service",
  "testUsers": ["test@example.com"],
  "allowedDomains": []
}
```

### 2. Verify User
```bash
curl -X POST http://localhost:3000/verify \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-api-key-12345" \
  -d '{"email": "test@example.com"}'
```

Response:
```json
{
  "authorized": true,
  "user": {
    "email": "test@example.com",
    "name": "test",
    "picture": "https://ui-avatars.com/api/?name=test"
  },
  "message": "User is authorized (TEST MODE)"
}
```

### 3. Test Login
```bash
curl -X POST http://localhost:3000/test-login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### 4. List Test Users
```bash
curl http://localhost:3000/test-users \
  -H "X-API-Key: test-api-key-12345"
```

## 🎯 Integration dengan Custom GPT

### Step 1: Generate Schema
Gunakan GuardGPT tool untuk generate OpenAPI schema dengan base URL:
```
http://localhost:3000
```
(atau production URL setelah deploy)

### Step 2: Configure GPT Action
1. Paste schema ke Custom GPT Actions
2. Set authentication:
   - Type: API Key
   - Header name: X-API-Key
   - Value: test-api-key-12345

### Step 3: Test
Di Custom GPT, test dengan prompt:
```
Verify if test@example.com is authorized
```

GPT akan call endpoint /verify dengan email tersebut.

## 🌐 Deployment

### Deploy ke Railway (Recommended)

1. Push code ke GitHub
2. Connect di Railway.app
3. Add environment variables (PORT akan auto-set)
4. Deploy!

Railway akan provide URL: `https://your-app.railway.app`

### Deploy ke Render

1. Push ke GitHub
2. Create Web Service di Render
3. Environment: Node
4. Build: `npm install`
5. Start: `npm start`
6. Add env variables
7. Deploy!

### Deploy ke Vercel

```bash
npm i -g vercel
vercel
```

## 🔧 Configuration

### Add Test Users

Edit `.env`:
```env
TEST_USERS=user1@company.com,user2@company.com,test@example.com
```

### Add Domain Restrictions

Edit `.env`:
```env
ALLOWED_DOMAINS=company.com,partner.com
```

### Change API Key

Edit `.env`:
```env
API_KEY=your-secret-key-here
```

## 📝 Custom Endpoints

Add your custom logic in server.js. Example:

```javascript
app.post('/custom-action', verifyApiKey, async (req, res) => {
  const email = req.body.email;
  const authResult = verifyTestUser(email);
  
  if (!authResult.authorized) {
    return res.status(403).json(authResult);
  }
  
  // Your custom logic here
  res.json({
    success: true,
    user: authResult.user,
    data: { /* your data */ }
  });
});
```

## 🚀 Upgrade to Production

When ready for production with real Google OAuth:

1. Setup Google Cloud Console
2. Get OAuth credentials
3. Install google-auth-library: `npm install google-auth-library`
4. Update verification logic to use real tokens
5. Update environment variables

Or use the Production version of GuardGPT generator!

## 💡 Tips

- Start with testing mode untuk understand flow
- Test semua endpoints dengan cURL atau Postman
- Monitor logs untuk debug
- Use ngrok untuk test local dengan Custom GPT: `ngrok http 3000`

## 🆘 Troubleshooting

**User not authorized?**
- Check if email in TEST_USERS (.env)
- Check if domain in ALLOWED_DOMAINS (if configured)

**API Key not working?**
- Check header name: X-API-Key
- Check if API_KEY in .env matches request

**Can't connect from Custom GPT?**
- Make sure server is deployed (not localhost)
- Or use ngrok for local testing
- Check CORS is enabled (already configured)

## 📚 Next Steps

1. Test locally dengan cURL
2. Deploy to Railway/Render/Vercel
3. Update base URL in OpenAPI schema
4. Configure Custom GPT Actions
5. Test end-to-end dengan GPT
6. Add your custom business logic
7. Monitor and scale!

---

**Note**: This is a TESTING version. For production, consider:
- Real Google OAuth
- Database for user management
- Rate limiting
- Logging and monitoring
- Error tracking (Sentry)
- Load balancing
