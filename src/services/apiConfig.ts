// services/apiConfig.ts

/**
 * Base URL for the Vision79 SIWM backend API.
 * This is configured via Vite's environment variables.
 * In your project root, create a .env file (e.g., .env.development or .env.production)
 * and set the VITE_API_BASE_URL variable.
 * Example for development: VITE_API_BASE_URL=http://localhost:3000/api/v1
 */
// Dynamic API URL detection for network access
function getApiBaseUrl(): string {
  // If environment variable is set, use it (Vite's own ImportMetaEnv typing
  // is provided by the "vite/client" types entry in tsconfig.json).
  const configuredUrl = import.meta.env?.VITE_API_BASE_URL as string | undefined;
  if (configuredUrl) {
    return configuredUrl;
  }

  // Default: relative path. In production this is served by the same nginx
  // container that serves the frontend, which proxies /api/ to the backend
  // service (see nginx.conf). This avoids hardcoding any host or port.
  return '/api/v1';
}

export const BASE_API_URL = getApiBaseUrl();

/**
 * Generates common headers for API requests, including Authorization token if available.
 */
export const getCommonHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Attempt to get user info (which includes the token) from localStorage
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    try {
      const userInfo = JSON.parse(storedUserInfo);
      if (userInfo && userInfo.token) {
        headers['Authorization'] = `Bearer ${userInfo.token}`;
      } else {
        console.warn('User info found in localStorage, but token is missing.');
        delete headers['Authorization']; // Ensure no stale Authorization header
      }
    } catch (e) {
      console.error('Failed to parse userInfo from localStorage:', e);
      // Potentially corrupted data, clear it to prevent further issues
      localStorage.removeItem('userInfo');
      delete headers['Authorization']; // Ensure no stale Authorization header
    }
  }
  return headers;
};

// For simpler use where dynamic token retrieval isn't immediately needed for GET requests
// or if you handle token manually per request.
export const COMMON_HEADERS_STATIC = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
