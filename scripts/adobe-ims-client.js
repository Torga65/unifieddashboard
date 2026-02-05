/**
 * Adobe IMS Client - Vanilla JavaScript Implementation
 * Matches aso-spacecat-dashboard authentication approach
 * Independent implementation without React dependencies
 */

// IMS Configuration (matching aso-spacecat-dashboard)
// client_id can be set in scripts/ims-config.js (or by Amplify build env AMPLIFY_IMSCLIENT_ID)
const IMS_CONFIG = {
  client_id: (typeof window !== 'undefined' && window.IMS_CLIENT_ID) ? window.IMS_CLIENT_ID : 'unified-dashboard',
  scope: [
    'openid',
    'AdobeID',
    'additional_info',
    'additional_info.projectedProductContext',
    'read_organizations',
    'account_cluster.read',
  ].join(','),
  locale: 'en-US',
  environment: 'prod', // or 'stg1' for staging
  autoValidateToken: true,
};

// Storage keys (matching aso-spacecat-dashboard)
const STORAGE_KEYS = {
  API_TOKEN: 'aso_api_token',
  IMS_PROFILE: 'ims_profile',
  SPACECAT_TOKEN: 'spacecat_api_token',
};

class AdobeIMSClient {
  constructor() {
    this.imsInstance = null;
    this.ready = false;
    this.token = null;
    this.profile = null;
    this.error = null;
    this.callbacks = {
      onReady: [],
      onToken: [],
      onProfile: [],
      onError: [],
    };
  }

  /**
   * Initialize Adobe IMS
   */
  async initialize() {
    try {
      // Wait for Adobe IMS library to load
      if (!window.adobeIMS) {
        console.log('Loading Adobe IMS library...');
        await this.loadIMSLibrary();
      }

      // Configure redirect URI dynamically
      const config = {
        ...IMS_CONFIG,
        redirect_uri: window.location.origin + window.location.pathname,

        // Callbacks (matching aso-spacecat-dashboard)
        onAccessToken: (token) => {
          console.log('✅ Access token received');
          this.handleToken(token);
        },

        onAccessTokenHasExpired: () => {
          console.log('⚠️ Token has expired');
          this.handleTokenExpired();
        },

        onReauthAccessToken: (reauthToken) => {
          console.log('🔄 Reauth token received');
          this.handleToken(reauthToken);
        },

        onError: (errorType, error) => {
          console.error('❌ IMS Error:', errorType, error);
          this.handleError(errorType, error);
        },

        onReady: (context) => {
          console.log('✅ IMS Ready');
          this.handleReady(context);
        },

        onProfile: (profile) => {
          console.log('✅ Profile loaded');
          this.handleProfile(profile);
        },
      };

      // Initialize IMS instance
      this.imsInstance = new window.adobeIMS.AdobeIMS(config);
      await this.imsInstance.initialize();

      return true;
    } catch (error) {
      console.error('Failed to initialize Adobe IMS:', error);
      this.error = error;
      return false;
    }
  }

  /**
   * Load Adobe IMS library dynamically
   */
  loadIMSLibrary() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.adobeIMS) {
        resolve();
        return;
      }

      // Load from CDN
      const script = document.createElement('script');
      script.src = 'https://auth.services.adobe.com/imslib/imslib.min.js';
      script.onload = () => {
        console.log('Adobe IMS library loaded');
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Adobe IMS library'));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Handle token received (matching aso-spacecat-dashboard logic)
   */
  handleToken(token) {
    // Extract token string
    const tokenString = typeof token === 'object' ? token.token : token;

    // Store token (matching their storage keys)
    localStorage.setItem(STORAGE_KEYS.API_TOKEN, tokenString);
    localStorage.setItem(STORAGE_KEYS.SPACECAT_TOKEN, tokenString);

    this.token = token;

    // Trigger callbacks
    this.callbacks.onToken.forEach((cb) => cb(tokenString));

    // Start auto-refresh timer
    this.startAutoRefresh();
  }

  /**
   * Handle token expired
   */
  handleTokenExpired() {
    this.token = null;
    localStorage.removeItem(STORAGE_KEYS.API_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.SPACECAT_TOKEN);
  }

  /**
   * Handle IMS ready
   */
  handleReady(context) {
    this.ready = true;
    this.callbacks.onReady.forEach((cb) => cb(context));
  }

  /**
   * Handle profile loaded
   */
  handleProfile(profile) {
    this.profile = profile;
    localStorage.setItem(STORAGE_KEYS.IMS_PROFILE, JSON.stringify(profile));
    this.callbacks.onProfile.forEach((cb) => cb(profile));
  }

  /**
   * Handle error
   */
  handleError(errorType, error) {
    this.error = { errorType, error };
    this.callbacks.onError.forEach((cb) => cb(errorType, error));
  }

  /**
   * Sign in
   */
  signIn(options = {}) {
    if (!this.imsInstance) {
      console.error('IMS not initialized');
      return;
    }

    console.log('Signing in with Adobe IMS...');

    if (options.profile_filter) {
      this.imsInstance.signIn({ profile_filter: options.profile_filter });
    } else {
      this.imsInstance.signIn();
    }
  }

  /**
   * Sign out (matching aso-spacecat-dashboard logic)
   */
  async signOut() {
    console.log('Signing out...');

    // Clear local state
    this.token = null;
    this.profile = null;

    // Aggressively clear ALL IMS-related storage
    const patterns = ['adobeid', 'ims', 'access_token', 'profile', 'aso_api_token', 'spacecat_api_token'];

    // Clear sessionStorage
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && patterns.some((p) => key.toLowerCase().includes(p.toLowerCase()))) {
        sessionStorage.removeItem(key);
      }
    }

    // Clear localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && patterns.some((p) => key.toLowerCase().includes(p.toLowerCase()))) {
        localStorage.removeItem(key);
      }
    }

    // Call IMS signOut
    if (this.imsInstance) {
      try {
        this.imsInstance.signOut();
      } catch (error) {
        console.error('Sign out failed:', error);
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  }

  /**
   * Get access token
   */
  getAccessToken() {
    if (this.imsInstance) {
      return this.imsInstance.getAccessToken();
    }

    // Fallback to localStorage
    const token = localStorage.getItem(STORAGE_KEYS.API_TOKEN);
    return token ? { token } : null;
  }

  /**
   * Refresh token
   */
  refreshToken() {
    if (this.imsInstance) {
      console.log('🔄 Refreshing token...');
      this.imsInstance.refreshToken();
    }
  }

  /**
   * Get profile
   */
  async getProfile() {
    if (this.imsInstance) {
      try {
        const profile = await this.imsInstance.getProfile();
        this.handleProfile(profile);
        return profile;
      } catch (error) {
        console.error('Failed to get profile:', error);
        return null;
      }
    }

    // Fallback to localStorage
    const profileStr = localStorage.getItem(STORAGE_KEYS.IMS_PROFILE);
    return profileStr ? JSON.parse(profileStr) : null;
  }

  /**
   * Check if signed in
   */
  isSignedInUser() {
    if (this.imsInstance) {
      return this.imsInstance.isSignedInUser();
    }

    // Fallback: check if token exists and is valid
    const token = localStorage.getItem(STORAGE_KEYS.API_TOKEN);
    if (!token) return false;

    try {
      const tokenInfo = this.parseToken(token);
      return !tokenInfo.expired;
    } catch {
      return false;
    }
  }

  /**
   * Parse Adobe IMS token (matching aso-spacecat-dashboard logic)
   */
  parseToken(tokenString) {
    try {
      const parts = tokenString.split('.');
      if (parts.length !== 3) throw new Error('Invalid token format');

      const payload = JSON.parse(atob(parts[1]));

      // Handle Adobe IMS format
      let expiresAt = null;
      let issuedAt = null;

      // Standard JWT format
      if (payload.exp) {
        expiresAt = new Date(payload.exp * 1000);
      }
      if (payload.iat) {
        issuedAt = new Date(payload.iat * 1000);
      }

      // Adobe IMS format (created_at + expires_in)
      if (payload.created_at && payload.expires_in) {
        issuedAt = new Date(parseInt(payload.created_at));
        expiresAt = new Date(parseInt(payload.created_at) + parseInt(payload.expires_in));
      }

      const now = new Date();
      const expired = expiresAt && expiresAt < now;
      const timeRemaining = expiresAt ? expiresAt.getTime() - now.getTime() : 0;

      return {
        userId: payload.user_id || payload.sub,
        clientId: payload.client_id,
        scope: payload.scope,
        expiresAt,
        issuedAt,
        expired,
        timeRemaining,
      };
    } catch (error) {
      throw new Error('Failed to parse token');
    }
  }

  /**
   * Start auto-refresh timer (matching aso-spacecat-dashboard logic)
   * Checks every 2 minutes, refreshes if < 10 minutes remaining
   */
  startAutoRefresh() {
    // Clear existing timer
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    const checkAndRefresh = () => {
      try {
        const token = this.getAccessToken();
        if (!token?.token) return;

        const tokenInfo = this.parseToken(token.token);
        const tenMinutes = 10 * 60 * 1000;

        // Refresh if less than 10 minutes remaining
        if (tokenInfo.timeRemaining > 0 && tokenInfo.timeRemaining < tenMinutes) {
          console.log(`Token expiring in ${Math.floor(tokenInfo.timeRemaining / 60000)} minutes, refreshing...`);
          this.refreshToken();
        }
      } catch (error) {
        // Silent fail - token refresh is best effort
      }
    };

    // Check every 2 minutes (matching aso-spacecat-dashboard)
    this.refreshTimer = setInterval(checkAndRefresh, 2 * 60 * 1000);

    // Initial check
    checkAndRefresh();
  }

  /**
   * Register callback
   */
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  /**
   * Get IMS Org ID from profile
   */
  getImsOrgId() {
    if (!this.profile) return null;

    const ctx = this.profile?.projectedProductContext;
    if (ctx && Array.isArray(ctx)) {
      return ctx.map((c) => c.prodCtx?.owningEntity).find((id) => id) || null;
    }
    return null;
  }

  /**
   * Switch organization (matching aso-spacecat-dashboard logic)
   */
  switchOrg(orgId) {
    if (!this.imsInstance || !this.profile) return;

    const filter = `{"findFirst":true, "fallbackToAA":true, "preferForwardProfile":true, "searchEntireCluster":true}; isOwnedByOrg('${orgId}')`;
    this.imsInstance.signIn({
      profile_filter: filter,
      response_type: 'token',
    });
  }
}

// Create singleton instance
const adobeIMSClient = new AdobeIMSClient();

// Export for use in other scripts
window.AdobeIMSClient = adobeIMSClient;

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    adobeIMSClient.initialize();
  });
} else {
  adobeIMSClient.initialize();
}

export default adobeIMSClient;
