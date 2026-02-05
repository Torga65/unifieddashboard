#!/bin/bash

# Wait for fresh token after sign-in

SOURCE_TOKEN="/Users/tgardner/Documents/unified-dashboard/aso-spacecat-dashboard-main/.token"
DEST_TOKEN="/Users/tgardner/Documents/unified-dashboard/unifieddashboard/.token"

echo "⏳ Waiting for you to sign in to aso-spacecat-dashboard..."
echo "   Dashboard URL: https://localhost:5173/"
echo ""
echo "   Checking every 5 seconds for a fresh token..."
echo "   Press Ctrl+C to cancel"
echo ""

LAST_MODIFIED=""
MAX_ATTEMPTS=60  # Wait up to 5 minutes

for i in $(seq 1 $MAX_ATTEMPTS); do
    if [ -f "$SOURCE_TOKEN" ]; then
        # Get file modification time
        if [[ "$OSTYPE" == "darwin"* ]]; then
            CURRENT_MODIFIED=$(stat -f "%m" "$SOURCE_TOKEN" 2>/dev/null)
        else
            CURRENT_MODIFIED=$(stat -c "%Y" "$SOURCE_TOKEN" 2>/dev/null)
        fi
        
        # Check if file was modified
        if [ -n "$CURRENT_MODIFIED" ] && [ "$CURRENT_MODIFIED" != "$LAST_MODIFIED" ]; then
            # Token file changed, validate it
            echo "🔄 Token file updated, validating..."
            
            # Validate token
            TOKEN_CONTENT=$(cat "$SOURCE_TOKEN")
            
            if [ -n "$TOKEN_CONTENT" ]; then
                # Quick validation using node
                VALID=$(node -e "
                    const fs = require('fs');
                    const token = fs.readFileSync('$SOURCE_TOKEN', 'utf-8').trim();
                    try {
                        const parts = token.split('.');
                        if (parts.length !== 3) { console.log('invalid'); process.exit(0); }
                        
                        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                        
                        let expiresAt = null;
                        if (payload.exp) expiresAt = new Date(payload.exp * 1000);
                        if (payload.created_at && payload.expires_in) {
                            expiresAt = new Date(parseInt(payload.created_at) + parseInt(payload.expires_in));
                        }
                        
                        const now = new Date();
                        const expired = expiresAt && expiresAt < now;
                        
                        if (expired) {
                            console.log('expired');
                        } else {
                            console.log('valid');
                        }
                    } catch (e) {
                        console.log('invalid');
                    }
                " 2>/dev/null)
                
                if [ "$VALID" = "valid" ]; then
                    echo ""
                    echo "✅ Fresh token detected!"
                    echo ""
                    
                    # Run the full check-and-copy script
                    bash "$(dirname "$0")/check-and-copy-token.sh"
                    
                    if [ $? -eq 0 ]; then
                        echo ""
                        echo "🎉 Success! Running URL fetcher now..."
                        echo ""
                        node "$(dirname "$0")/fetch-spacecat-urls.js"
                        exit 0
                    fi
                else
                    echo "   Token is $VALID, waiting for valid token..."
                fi
            fi
            
            LAST_MODIFIED=$CURRENT_MODIFIED
        fi
    fi
    
    # Show progress
    if [ $((i % 6)) -eq 0 ]; then
        ELAPSED=$((i * 5))
        echo "   Still waiting... (${ELAPSED}s elapsed)"
    fi
    
    sleep 5
done

echo ""
echo "⏱️  Timeout: No fresh token detected after 5 minutes"
echo ""
echo "Please make sure:"
echo "1. aso-spacecat-dashboard is running (https://localhost:5173/)"
echo "2. You've signed in with Adobe IMS"
echo "3. The token is saved to the .token file"
echo ""
echo "You can manually run: bash scripts/check-and-copy-token.sh"
exit 1
