/**
 * SpaceCat Authentication Module
 * Handles IMS token-based authentication matching the aso-spacecat-dashboard approach
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract token from .token file or environment
 * Compatible with aso-spacecat-dashboard token storage
 */
export function getAuthToken() {
  // PRIORITY 1: .token file (like aso-spacecat-dashboard)
  try {
    const tokenPath = path.join(__dirname, '../.token');

    if (fs.existsSync(tokenPath)) {
      const token = fs.readFileSync(tokenPath, 'utf-8').trim();
      if (token) {
        console.log('✅ Using token from .token file');
        return token;
      }
    }
  } catch (error) {
    // Continue to other methods
  }

  // PRIORITY 2: credentials.json (our format)
  try {
    const credPath = path.join(__dirname, '../credentials.json');

    if (fs.existsSync(credPath)) {
      const credentials = JSON.parse(fs.readFileSync(credPath, 'utf-8'));

      // Check for IMS token (preferred)
      if (credentials.spacecat && credentials.spacecat.imsToken) {
        console.log('✅ Using IMS token from credentials.json');
        return credentials.spacecat.imsToken;
      }

      // Fall back to API key if present
      if (credentials.spacecat && credentials.spacecat.apiKey) {
        console.log('✅ Using API key from credentials.json');
        return credentials.spacecat.apiKey;
      }
    }
  } catch (error) {
    // Continue to other methods
  }

  // PRIORITY 3: Environment variables
  const token = process.env.SPACECAT_TOKEN || process.env.SPACECAT_API_KEY;
  if (token) {
    console.log('✅ Using token from environment variable');
    return token;
  }

  return null;
}

/**
 * Validate JWT token (like aso-spacecat-dashboard useAuth.js)
 */
export function isValidJWT(token) {
  if (!token || typeof token !== 'string') return false;

  // JWT format: header.payload.signature
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    // Try to decode base64
    atob(parts[1]);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Parse JWT token to extract info (matches useAuth.js logic)
 */
export function parseTokenInfo(token) {
  if (!isValidJWT(token)) {
    return { type: 'Bearer', valid: false, message: 'Token format not recognized as JWT' };
  }

  try {
    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    // Calculate expiration time - handles both standard JWT and Adobe IMS formats
    let expiresAt = null;
    let issuedAt = null;

    // Standard JWT format (exp, iat in seconds)
    if (payload.exp) {
      expiresAt = new Date(payload.exp * 1000);
    }
    if (payload.iat) {
      issuedAt = new Date(payload.iat * 1000);
    }

    // Adobe IMS format (created_at timestamp, expires_in duration in milliseconds)
    if (payload.created_at && payload.expires_in) {
      const createdAtMs = parseInt(payload.created_at);
      const expiresInMs = parseInt(payload.expires_in);
      issuedAt = new Date(createdAtMs);
      expiresAt = new Date(createdAtMs + expiresInMs);
    }

    // Check if expired
    const now = new Date();
    const expired = expiresAt && expiresAt < now;

    return {
      type: 'JWT',
      valid: !expired,
      issuedAt,
      expiresAt,
      expired,
      issuer: payload.iss || payload.as || null, // Adobe uses 'as' for auth server
      subject: payload.sub || payload.user_id || null, // Adobe uses 'user_id'
      userId: payload.user_id || payload.sub || null,
      adobeAccountId: payload.aa_id || null,
      clientId: payload.client_id || null,
      scope: payload.scope || null,
      tokenType: payload.type || 'access_token',
      permissionBasedAccess: payload.pba || null,
    };
  } catch (error) {
    return { type: 'Bearer', valid: false, message: 'Unable to parse token' };
  }
}

/**
 * Make authenticated API request (matches aso-spacecat-dashboard api.js)
 */
export async function authenticatedRequest(url, options = {}) {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No authentication token found. Please set up credentials.');
  }

  // Validate token
  const tokenInfo = parseTokenInfo(token);
  if (!tokenInfo.valid) {
    if (tokenInfo.expired) {
      throw new Error('Authentication token has expired. Please refresh your token.');
    }
    throw new Error(`Invalid token: ${tokenInfo.message || 'Unknown error'}`);
  }

  // Build headers
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;

      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || `HTTP ${response.status}: ${response.statusText}` };
      }

      const error = new Error(errorData.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = errorData;

      throw error;
    }

    return response;
  } catch (error) {
    if (error.status) {
      throw error;
    }

    // Network or other errors
    const networkError = new Error(error.message || 'Network error');
    networkError.originalError = error;
    throw networkError;
  }
}

/**
 * Helper functions matching aso-spacecat-dashboard api.js
 */

export async function apiGet(url) {
  const response = await authenticatedRequest(url, { method: 'GET' });
  return response.json();
}

export async function apiPost(url, data) {
  const response = await authenticatedRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function apiPut(url, data) {
  const response = await authenticatedRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function apiDelete(url) {
  const response = await authenticatedRequest(url, { method: 'DELETE' });
  return response.json();
}

/**
 * Display token information
 */
export function displayTokenInfo() {
  const token = getAuthToken();

  if (!token) {
    console.log('❌ No token found');
    console.log('\nOptions to set up authentication:');
    console.log('1. Copy .token file from aso-spacecat-dashboard');
    console.log('2. Add imsToken to credentials.json');
    console.log('3. Set SPACECAT_TOKEN environment variable');
    return;
  }

  const info = parseTokenInfo(token);

  console.log('\n📝 Token Information:');
  console.log('  Type:', info.type);
  console.log('  Valid:', info.valid ? '✅ Yes' : '❌ No');

  if (info.expired) {
    console.log('  Status: ⚠️ EXPIRED');
  }

  if (info.expiresAt) {
    const now = new Date();
    const timeRemaining = info.expiresAt.getTime() - now.getTime();
    const hoursRemaining = Math.floor(timeRemaining / 3600000);
    const daysRemaining = Math.floor(timeRemaining / 86400000);

    console.log('  Issued:', info.issuedAt?.toLocaleString());
    console.log('  Expires:', info.expiresAt?.toLocaleString());

    if (daysRemaining > 0) {
      console.log('  Time Left:', `${daysRemaining} days`);
    } else {
      console.log('  Time Left:', `${hoursRemaining} hours`);
    }
  }

  if (info.userId) {
    console.log('  User ID:', info.userId);
  }
  if (info.clientId) {
    console.log('  Client ID:', info.clientId);
  }
  if (info.scope) {
    console.log('  Scopes:', info.scope);
  }

  console.log('');
}
