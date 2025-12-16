// API base URL utility
// In production (Render), client and server are on the same domain, so use relative URLs
// In development, use localhost:5000
const getApiBaseUrl = () => {
  // Check if we're in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  // In production, use relative URL (same domain) since client and server are on same service
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

