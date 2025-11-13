#!/bin/bash
# Quick test script

echo "🧪 Testing GuardGPT Backend..."
echo ""

# Health check
echo "1. Health Check:"
curl -s http://localhost:3000/health | json_pp
echo ""

# List test users
echo "2. Test Users:"
curl -s http://localhost:3000/test-users \
  -H "X-API-Key: test-api-key-12345" | json_pp
echo ""

# Test verify
echo "3. Verify User:"
curl -s -X POST http://localhost:3000/verify \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-api-key-12345" \
  -d '{"email": "test@example.com"}' | json_pp
echo ""

echo "✅ Tests complete!"
