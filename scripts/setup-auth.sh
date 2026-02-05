#!/bin/bash

# Independent Authentication Setup for Unified Dashboard
# No dependency on aso-spacecat-dashboard

echo "🔐 SpaceCat Authentication Setup"
echo "================================"
echo ""

CREDENTIALS_FILE="/Users/tgardner/Documents/unified-dashboard/unifieddashboard/credentials.json"
TOKEN_FILE="/Users/tgardner/Documents/unified-dashboard/unifieddashboard/.token"

echo "Choose your authentication method:"
echo ""
echo "1. 📝 Manual Token Entry (paste IMS token)"
echo "2. 🔑 API Key Entry"
echo "3. 🌐 Web UI (open auth.html in browser)"
echo "4. ❌ Cancel"
echo ""

read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "📝 Manual Token Entry"
        echo "===================="
        echo ""
        echo "Where to get an IMS token:"
        echo "1. Go to https://aso.experiencecloud.live/"
        echo "2. Sign in with Adobe credentials"
        echo "3. Open browser console (F12)"
        echo "4. Run: localStorage.getItem('aso_api_token')"
        echo "5. Copy the token value"
        echo ""
        read -p "Paste your IMS token here: " TOKEN
        
        if [ -z "$TOKEN" ]; then
            echo "❌ No token provided"
            exit 1
        fi
        
        # Validate token format
        PARTS=$(echo "$TOKEN" | tr '.' '\n' | wc -l)
        if [ "$PARTS" -ne 3 ]; then
            echo "❌ Invalid token format. JWT tokens should have 3 parts."
            exit 1
        fi
        
        # Save to .token file
        echo "$TOKEN" > "$TOKEN_FILE"
        echo "✅ Token saved to .token"
        
        # Validate token
        echo ""
        echo "🔍 Validating token..."
        node -e "
const fs = require('fs');
const token = fs.readFileSync('$TOKEN_FILE', 'utf-8').trim();

try {
    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    let expiresAt = null;
    if (payload.exp) expiresAt = new Date(payload.exp * 1000);
    if (payload.created_at && payload.expires_in) {
        expiresAt = new Date(parseInt(payload.created_at) + parseInt(payload.expires_in));
    }
    
    const now = new Date();
    const expired = expiresAt && expiresAt < now;
    
    if (expired) {
        console.log('❌ Token is expired!');
        process.exit(1);
    }
    
    const timeRemaining = expiresAt ? expiresAt.getTime() - now.getTime() : 0;
    const hours = Math.floor(timeRemaining / 3600000);
    const days = Math.floor(timeRemaining / 86400000);
    
    console.log('✅ Token is valid!');
    console.log('');
    console.log('Token Info:');
    console.log('  User:', payload.user_id || payload.sub || 'Unknown');
    console.log('  Client:', payload.client_id || 'Unknown');
    console.log('  Expires:', expiresAt.toLocaleString());
    console.log('  Time Left:', days > 0 ? days + ' days' : hours + ' hours');
    console.log('');
    
    // Update credentials.json
    let credentials = {};
    try {
        credentials = JSON.parse(fs.readFileSync('$CREDENTIALS_FILE', 'utf-8'));
    } catch (e) {
        // File doesn't exist or is invalid
    }
    
    credentials.spacecat = credentials.spacecat || {};
    credentials.spacecat.imsToken = token;
    credentials.spacecat.baseUrl = 'https://spacecat.experiencecloud.live/api/v1';
    credentials.spacecat.environment = 'production';
    
    fs.writeFileSync('$CREDENTIALS_FILE', JSON.stringify(credentials, null, 2));
    console.log('✅ Updated credentials.json');
    
} catch (error) {
    console.log('❌ Invalid token:', error.message);
    process.exit(1);
}
"
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Authentication setup complete!"
            echo ""
            echo "Next step: Run the URL fetcher"
            echo "  node scripts/fetch-spacecat-urls.js"
        fi
        ;;
        
    2)
        echo ""
        echo "🔑 API Key Entry"
        echo "================"
        echo ""
        read -p "Enter your SpaceCat API key: " API_KEY
        
        if [ -z "$API_KEY" ]; then
            echo "❌ No API key provided"
            exit 1
        fi
        
        # Update credentials.json
        node -e "
const fs = require('fs');
let credentials = {};
try {
    credentials = JSON.parse(fs.readFileSync('$CREDENTIALS_FILE', 'utf-8'));
} catch (e) {}

credentials.spacecat = credentials.spacecat || {};
credentials.spacecat.apiKey = '$API_KEY';
credentials.spacecat.baseUrl = 'https://spacecat.experiencecloud.live/api/v1';
credentials.spacecat.environment = 'production';

fs.writeFileSync('$CREDENTIALS_FILE', JSON.stringify(credentials, null, 2));
console.log('✅ API key saved to credentials.json');
"
        
        echo ""
        echo "🎉 Authentication setup complete!"
        echo ""
        echo "⚠️  Note: API keys may have limited functionality."
        echo "   IMS tokens are recommended for full access."
        ;;
        
    3)
        echo ""
        echo "🌐 Opening web authentication UI..."
        echo ""
        
        # Check if local server is running
        if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo "Starting local server..."
            cd /Users/tgardner/Documents/unified-dashboard/unifieddashboard
            npx http-server -p 3000 > /dev/null 2>&1 &
            SERVER_PID=$!
            sleep 2
        fi
        
        # Open browser
        open http://localhost:3000/auth.html
        
        echo "✅ Opened auth.html in your browser"
        echo ""
        echo "Follow the instructions in the browser to authenticate."
        ;;
        
    4)
        echo "Cancelled"
        exit 0
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac
