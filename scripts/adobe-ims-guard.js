/**
 * Adobe IMS Authentication Guard
 * Matches aso-spacecat-dashboard authentication approach
 * Automatically triggers IMS sign-in without a separate login page
 */

(function() {
  'use strict';

  // Pages that don't require authentication
  const PUBLIC_PAGES = [
    '/extract-fresh-token.html',
    '/auth.html'
  ];

  // Storage keys (matching aso-spacecat-dashboard)
  const STORAGE_KEYS = {
    API_TOKEN: 'aso_api_token',
    IMS_PROFILE: 'ims_profile',
  };

  // Auth state
  let authState = 'checking'; // checking, authenticated, authenticating, error

  /**
   * Check if current page is public
   */
  function isPublicPage() {
    const currentPath = window.location.pathname;
    return PUBLIC_PAGES.some(page => currentPath.endsWith(page));
  }

  /**
   * Parse Adobe IMS token (matching aso-spacecat-dashboard logic)
   */
  function parseToken(tokenString) {
    try {
      const parts = tokenString.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = JSON.parse(atob(parts[1]));
      
      // Handle Adobe IMS format
      let expiresAt = null;
      
      // Standard JWT format
      if (payload.exp) {
        expiresAt = new Date(payload.exp * 1000);
      }
      
      // Adobe IMS format (created_at + expires_in)
      if (payload.created_at && payload.expires_in) {
        expiresAt = new Date(parseInt(payload.created_at) + parseInt(payload.expires_in));
      }
      
      const now = new Date();
      const expired = expiresAt && expiresAt < now;
      
      return {
        valid: !expired,
        expired,
        expiresAt,
        userId: payload.user_id || payload.sub,
      };
    } catch (error) {
      throw new Error('Failed to parse token');
    }
  }

  /**
   * Show loading overlay while authenticating
   */
  function showAuthOverlay(message = 'Checking authentication...') {
    // Remove existing overlay if present
    const existing = document.getElementById('auth-overlay');
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.innerHTML = `
      <style>
        #auth-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #auth-overlay .content {
          text-align: center;
          max-width: 400px;
          padding: 40px;
        }
        #auth-overlay h1 {
          font-size: 32px;
          margin-bottom: 20px;
          font-weight: 600;
        }
        #auth-overlay p {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 30px;
        }
        #auth-overlay .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
      <div class="content">
        <h1>Unified Dashboard</h1>
        <p>${message}</p>
        <div class="spinner"></div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  /**
   * Automatically trigger Adobe IMS sign-in
   * Matches aso-spacecat-dashboard behavior
   */
  async function triggerAutoSignIn(reason) {
    console.log('🔒 Authentication required:', reason);
    
    authState = 'authenticating';
    showAuthOverlay('Redirecting to Adobe IMS...');

    try {
      // Wait for AdobeIMSClient to be available
      await waitForIMSClient();

      console.log('✅ IMS Client ready, initiating sign-in...');
      
      // Trigger sign-in (will redirect to Adobe)
      window.AdobeIMSClient.signIn();
      
    } catch (error) {
      console.error('❌ Auto sign-in failed:', error);
      showAuthError(error.message);
    }
  }

  /**
   * Wait for Adobe IMS Client to be ready
   */
  function waitForIMSClient() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max
      
      const check = () => {
        attempts++;
        
        if (window.AdobeIMSClient && window.AdobeIMSClient.ready) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Adobe IMS Client not available. Please check configuration.'));
        } else {
          setTimeout(check, 100);
        }
      };
      
      check();
    });
  }

  /**
   * Show authentication error
   */
  function showAuthError(message) {
    authState = 'error';
    
    const overlay = document.getElementById('auth-overlay');
    if (overlay) {
      overlay.innerHTML = `
        <div class="content">
          <h1>Authentication Error</h1>
          <p style="color: #fca5a5;">${message}</p>
          <p style="font-size: 14px; margin-top: 20px;">
            Please contact your administrator or try again later.
          </p>
          <button onclick="window.location.reload()" style="
            margin-top: 20px;
            padding: 12px 24px;
            background: white;
            color: #667eea;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
          ">Retry</button>
        </div>
      `;
    }
  }

  /**
   * Check authentication (matches aso-spacecat-dashboard AuthGuard)
   */
  async function checkAuth() {
    // Skip check for public pages
    if (isPublicPage()) {
      return;
    }

    // Show checking overlay
    showAuthOverlay('Checking authentication...');

    // Check for stored token (matching aso-spacecat-dashboard)
    const token = localStorage.getItem(STORAGE_KEYS.API_TOKEN);
    
    if (!token) {
      // No token - automatically trigger sign-in
      await triggerAutoSignIn('No authentication token found');
      return;
    }

    // Validate token
    try {
      const tokenInfo = parseToken(token);
      
      if (!tokenInfo.valid || tokenInfo.expired) {
        // Token expired - automatically trigger sign-in
        await triggerAutoSignIn('Authentication token expired');
        return;
      }

      // Token is valid - remove overlay and allow page to load
      console.log('✅ Authenticated as:', tokenInfo.userId);
      authState = 'authenticated';
      
      // Also store for API access (matching their approach)
      localStorage.setItem('spacecat_api_token', token);
      
      // Remove loading overlay
      const overlay = document.getElementById('auth-overlay');
      if (overlay) {
        overlay.remove();
      }
      
    } catch (error) {
      console.error('❌ Token validation error:', error);
      await triggerAutoSignIn('Invalid authentication token');
    }
  }

  // Run authentication check when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuth);
  } else {
    checkAuth();
  }

  // Export for dynamic use
  window.checkAuthentication = checkAuth;
  
  // Listen for token changes from other tabs (matching aso-spacecat-dashboard cross-tab sync)
  window.addEventListener('storage', function(e) {
    if (e.key === STORAGE_KEYS.API_TOKEN) {
      checkAuth();
    }
  });

})();
