/**
 * Authentication Guard
 * Protects pages from unauthorized access
 * Include this script at the top of every protected page
 */

(function () {
  // Pages that don't require authentication
  const PUBLIC_PAGES = [
    '/login.html',
    '/simple-login.html',
    '/auth-callback.html',
    '/auth.html',
  ];

  // Check if current page is public
  function isPublicPage() {
    const currentPath = window.location.pathname;
    return PUBLIC_PAGES.some((page) => currentPath.endsWith(page));
  }

  // Check authentication immediately (before page renders)
  function checkAuth() {
    // Skip check for public pages
    if (isPublicPage()) {
      return;
    }

    // Check for stored token
    const token = localStorage.getItem('unified_dashboard_ims_token');

    if (!token) {
      redirectToLogin('No authentication token found');
      return;
    }

    // Validate token
    try {
      const tokenInfo = parseToken(token);

      if (!tokenInfo.valid || tokenInfo.expired) {
        redirectToLogin('Authentication token expired');
        return;
      }

      // Token is valid, allow page to load
      console.log('✅ Authenticated as:', tokenInfo.userId);

      // Auto-refresh if token is expiring soon (< 10 minutes)
      if (tokenInfo.expiresAt) {
        const timeRemaining = tokenInfo.expiresAt.getTime() - Date.now();
        if (timeRemaining < 600000 && timeRemaining > 0) {
          console.warn('⚠️ Token expiring soon, consider refreshing');
        }
      }
    } catch (error) {
      console.error('❌ Token validation error:', error);
      redirectToLogin('Invalid authentication token');
    }
  }

  // Parse JWT token
  function parseToken(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(atob(parts[1]));

    let expiresAt = null;

    // Standard JWT format
    if (payload.exp) {
      expiresAt = new Date(payload.exp * 1000);
    }

    // Adobe IMS format
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
      email: payload.email,
      name: payload.name,
    };
  }

  // Redirect to login page
  function redirectToLogin(reason) {
    console.log('🔒 Authentication required:', reason);

    // Store intended destination
    sessionStorage.setItem('auth_redirect', window.location.href);

    // Redirect to simple login (token-based)
    window.location.href = '/simple-login.html';
  }

  // Run authentication check
  checkAuth();

  // Export auth check function for dynamic use
  window.checkAuthentication = checkAuth;

  // Add event listener for token changes (from other tabs)
  window.addEventListener('storage', (e) => {
    if (e.key === 'unified_dashboard_ims_token') {
      checkAuth();
    }
  });
}());
