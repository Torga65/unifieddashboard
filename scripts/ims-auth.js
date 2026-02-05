/**
 * Adobe IMS Authentication Module
 * Handles authentication for the entire unified-dashboard site
 */

// IMS Configuration
const IMS_CONFIG = {
  client_id: 'unified-dashboard',
  scope: [
    'openid',
    'AdobeID',
    'additional_info',
    'additional_info.projectedProductContext',
    'read_organizations',
    'account_cluster.read'
  ].join(','),
  locale: 'en_US',
  environment: 'prod', // or 'stg1' for staging
  redirect_uri: window.location.origin + '/auth-callback.html'
};

// Storage keys
const STORAGE_KEYS = {
  IMS_TOKEN: 'unified_dashboard_ims_token',
  IMS_PROFILE: 'unified_dashboard_ims_profile',
  AUTH_STATE: 'unified_dashboard_auth_state'
};

class IMSAuth {
  constructor() {
    this.adobeIMS = null;
    this.initialized = false;
    this.currentUser = null;
  }

  /**
   * Initialize Adobe IMS
   */
  async initialize() {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      // Load Adobe IMS library if not already loaded
      if (!window.adobeIMS) {
        const script = document.createElement('script');
        script.src = 'https://auth.services.adobe.com/imslib/imslib.min.js';
        script.onload = () => this.setupIMS(resolve, reject);
        script.onerror = () => reject(new Error('Failed to load Adobe IMS library'));
        document.head.appendChild(script);
      } else {
        this.setupIMS(resolve, reject);
      }
    });
  }

  /**
   * Setup IMS instance
   */
  setupIMS(resolve, reject) {
    try {
      this.adobeIMS = window.adobeIMS;
      
      // Initialize IMS with configuration
      if (this.adobeIMS.initialize) {
        this.adobeIMS.initialize(IMS_CONFIG);
      }
      
      this.initialized = true;
      resolve();
    } catch (error) {
      reject(error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = this.getStoredToken();
    if (!token) return false;

    // Validate token hasn't expired
    try {
      const tokenInfo = this.parseToken(token);
      return tokenInfo.valid && !tokenInfo.expired;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get stored token
   */
  getStoredToken() {
    return localStorage.getItem(STORAGE_KEYS.IMS_TOKEN);
  }

  /**
   * Get stored profile
   */
  getStoredProfile() {
    const profileStr = localStorage.getItem(STORAGE_KEYS.IMS_PROFILE);
    try {
      return profileStr ? JSON.parse(profileStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Parse JWT token
   */
  parseToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { valid: false };

      const payload = JSON.parse(atob(parts[1]));
      
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
      
      return {
        valid: !expired,
        expired,
        expiresAt,
        issuedAt,
        userId: payload.user_id || payload.sub,
        email: payload.email,
        name: payload.name,
        clientId: payload.client_id,
        scope: payload.scope
      };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Sign in with Adobe IMS
   */
  async signIn() {
    await this.initialize();
    
    if (this.adobeIMS && this.adobeIMS.signIn) {
      // Adobe IMS will handle the redirect
      this.adobeIMS.signIn();
    } else {
      // Fallback: manual redirect
      const authUrl = this.buildAuthUrl();
      window.location.href = authUrl;
    }
  }

  /**
   * Build Adobe IMS authorization URL
   */
  buildAuthUrl() {
    const baseUrl = IMS_CONFIG.environment === 'prod' 
      ? 'https://ims-na1.adobelogin.com/ims/authorize/v2'
      : 'https://ims-na1-stg1.adobelogin.com/ims/authorize/v2';
    
    const params = new URLSearchParams({
      client_id: IMS_CONFIG.client_id,
      scope: IMS_CONFIG.scope,
      response_type: 'token',
      redirect_uri: IMS_CONFIG.redirect_uri,
      locale: IMS_CONFIG.locale
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Handle authentication callback
   */
  handleCallback() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    const token = params.get('access_token');
    const expiresIn = params.get('expires_in');
    
    if (token) {
      // Store token
      localStorage.setItem(STORAGE_KEYS.IMS_TOKEN, token);
      
      // Parse and store profile info
      const tokenInfo = this.parseToken(token);
      if (tokenInfo.valid) {
        const profile = {
          userId: tokenInfo.userId,
          email: tokenInfo.email,
          name: tokenInfo.name,
          expiresAt: tokenInfo.expiresAt
        };
        localStorage.setItem(STORAGE_KEYS.IMS_PROFILE, JSON.stringify(profile));
      }
      
      // Save to .token file (for API scripts)
      this.saveTokenToFile(token);
      
      return true;
    }
    
    return false;
  }

  /**
   * Save token to file for API scripts
   */
  saveTokenToFile(token) {
    // Create download link to save token
    const blob = new Blob([token], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Store in localStorage for script access
    localStorage.setItem('spacecat_api_token', token);
    
    // Also provide download option
    console.log('Token saved. To use with API scripts, run:');
    console.log(`echo "${token}" > .token`);
  }

  /**
   * Sign out
   */
  async signOut() {
    // Clear local storage
    localStorage.removeItem(STORAGE_KEYS.IMS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.IMS_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    localStorage.removeItem('spacecat_api_token');
    
    // Redirect to Adobe IMS sign out
    if (this.adobeIMS && this.adobeIMS.signOut) {
      this.adobeIMS.signOut();
    } else {
      // Manual sign out redirect
      const signOutUrl = IMS_CONFIG.environment === 'prod'
        ? 'https://ims-na1.adobelogin.com/ims/logout/v1'
        : 'https://ims-na1-stg1.adobelogin.com/ims/logout/v1';
      
      window.location.href = `${signOutUrl}?redirect_uri=${encodeURIComponent(window.location.origin)}`;
    }
  }

  /**
   * Get current user info
   */
  getCurrentUser() {
    if (!this.isAuthenticated()) return null;
    
    const profile = this.getStoredProfile();
    const token = this.getStoredToken();
    const tokenInfo = this.parseToken(token);
    
    return {
      ...profile,
      ...tokenInfo,
      token
    };
  }

  /**
   * Refresh token status
   */
  getTokenStatus() {
    const token = this.getStoredToken();
    if (!token) return null;

    const tokenInfo = this.parseToken(token);
    if (!tokenInfo.valid) return { status: 'expired' };

    const now = new Date();
    const timeRemaining = tokenInfo.expiresAt ? tokenInfo.expiresAt.getTime() - now.getTime() : 0;
    
    if (timeRemaining < 3600000) { // Less than 1 hour
      const minutes = Math.floor(timeRemaining / 60000);
      return { status: 'expiring', minutes, color: '#E68619' };
    } else if (timeRemaining < 86400000) { // Less than 24 hours
      const hours = Math.floor(timeRemaining / 3600000);
      return { status: 'valid', hours, color: '#268E6C' };
    } else {
      const days = Math.floor(timeRemaining / 86400000);
      return { status: 'valid', days, color: '#268E6C' };
    }
  }
}

// Create singleton instance
const imsAuth = new IMSAuth();

// Export for use in other scripts
window.IMSAuth = imsAuth;

// Auto-initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    imsAuth.initialize().catch(console.error);
  });
} else {
  imsAuth.initialize().catch(console.error);
}
