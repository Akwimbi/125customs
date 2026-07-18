// frontend/src/utils/storage.js
// Simple storage utility for auth token and session ID

const STORAGE_KEYS = {
  AUTH_TOKEN: '125customs_auth_token',
  SESSION_ID: '125customs_session_id'
};

// Auth token
export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

// Session ID
export const getSessionId = () => {
  let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  if (!sessionId) {
    // Generate a new session ID
    sessionId = 'sess-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  }
  return sessionId;
};

export const setSessionId = (sessionId) => {
  if (sessionId) {
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
  }
};

export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
};
