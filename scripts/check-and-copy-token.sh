#!/bin/bash

# Check and Copy Token from aso-spacecat-dashboard
# This script copies the .token file from aso-spacecat-dashboard

SOURCE_TOKEN="/Users/tgardner/Documents/unified-dashboard/aso-spacecat-dashboard-main/.token"
DEST_TOKEN="/Users/tgardner/Documents/unified-dashboard/unifieddashboard/.token"

echo "🔍 Checking for fresh IMS token..."
echo ""

# Check if source token exists
if [ ! -f "$SOURCE_TOKEN" ]; then
    echo "❌ No .token file found in aso-spacecat-dashboard"
    echo ""
    echo "📝 Steps to get a token:"
    echo "1. Open https://localhost:5173/ in your browser"
    echo "2. Sign in with Adobe IMS"
    echo "3. The token will be automatically saved to .token file"
    echo "4. Run this script again"
    exit 1
fi

# Read and validate source token
SOURCE_TOKEN_CONTENT=$(cat "$SOURCE_TOKEN")

if [ -z "$SOURCE_TOKEN_CONTENT" ]; then
    echo "❌ Token file is empty"
    exit 1
fi

echo "✅ Found token in aso-spacecat-dashboard"

# Parse token expiration using Node.js
node -e "
const fs = require('fs');
const token = fs.readFileSync('$SOURCE_TOKEN', 'utf-8').trim();

if (!token) {
    console.log('❌ Token is empty');
    process.exit(1);
}

try {
    const parts = token.split('.');
    if (parts.length !== 3) {
        console.log('⚠️  Token format appears invalid');
        process.exit(1);
    }
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    let expiresAt = null;
    let issuedAt = null;
    
    // Standard JWT format
    if (payload.exp) {
        expiresAt = new Date(payload.exp * 1000);
    }
    if (payload.iat) {
        issuedAt = new Date(payload.iat * 1000);
    }
    
    // Adobe IMS format
    if (payload.created_at && payload.expires_in) {
        issuedAt = new Date(parseInt(payload.created_at));
        expiresAt = new Date(parseInt(payload.created_at) + parseInt(payload.expires_in));
    }
    
    const now = new Date();
    const expired = expiresAt && expiresAt < now;
    const timeRemaining = expiresAt ? expiresAt.getTime() - now.getTime() : 0;
    
    console.log('');
    console.log('📝 Token Information:');
    console.log('  Type: JWT (Adobe IMS)');
    
    if (expired) {
        console.log('  Status: ❌ EXPIRED');
        console.log('');
        console.log('⚠️  This token has expired. Please sign in again at:');
        console.log('   https://localhost:5173/');
        process.exit(1);
    }
    
    console.log('  Status: ✅ VALID');
    
    if (expiresAt) {
        const hours = Math.floor(timeRemaining / 3600000);
        const days = Math.floor(timeRemaining / 86400000);
        
        console.log('  Issued: ' + issuedAt.toLocaleString());
        console.log('  Expires: ' + expiresAt.toLocaleString());
        
        if (days > 0) {
            console.log('  Time Left: ' + days + ' days');
        } else {
            console.log('  Time Left: ' + hours + ' hours');
        }
    }
    
    if (payload.user_id) {
        console.log('  User: ' + payload.user_id);
    }
    if (payload.client_id) {
        console.log('  Client: ' + payload.client_id);
    }
    
    console.log('');
    
} catch (error) {
    console.log('⚠️  Could not parse token:', error.message);
}
"

# Check if Node.js parsing succeeded
if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Token validation failed. Please sign in again."
    exit 1
fi

# Copy token
cp "$SOURCE_TOKEN" "$DEST_TOKEN"

if [ $? -eq 0 ]; then
    echo "✅ Token copied to unified-dashboard"
    echo ""
    echo "🚀 Ready to run URL fetcher:"
    echo "   node scripts/fetch-spacecat-urls.js"
else
    echo "❌ Failed to copy token"
    exit 1
fi
