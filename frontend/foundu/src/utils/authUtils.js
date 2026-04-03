/**
 * Authentication utility functions.
 * 
 * With httpOnly cookies, the JWT is invisible to JavaScript (secure!).
 * We still keep localStorage decoding as a FALLBACK for backward compatibility.
 * The primary auth mechanism is now the httpOnly cookie sent automatically.
 */

import api from "./axiosConfig";

// ── Token decoding (fallback for localStorage token) ──

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// ── Cached user data from /api/users/me ──
let _cachedUser = null;
let _cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches the current user from the backend.
 * Uses the httpOnly cookie automatically (withCredentials: true).
 * Falls back to decoding localStorage token if API fails.
 */
export const fetchCurrentUser = async () => {
  const now = Date.now();
  if (_cachedUser && (now - _cacheTimestamp) < CACHE_TTL) {
    return _cachedUser;
  }
  try {
    const res = await api.get("/api/me");
    if (res.data.success && res.data.data) {
      _cachedUser = res.data.data;
      _cacheTimestamp = now;
      return _cachedUser;
    }
  } catch (e) {
    // API failed - fall back to localStorage token decoding
  }
  
  // Fallback: decode localStorage token
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = decodeToken(token);
    if (decoded) return decoded;
  }
  return null;
};

/**
 * Gets the user ID (synchronous).
 * Checks: JWT decode → explicit user_id key → cached user.
 */
export const getUserId = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.id) return String(decoded.id);
    }
    // Fallback: explicit user_id key (iOS-safe, no JWT decoding needed)
    const storedId = localStorage.getItem("user_id");
    if (storedId) return storedId;
  } catch (e) {
    // localStorage might not be available (iOS private browsing)
  }
  if (_cachedUser) return String(_cachedUser.id);
  return null;
};

/**
 * Gets the user type (synchronous).
 * Checks: JWT decode → explicit user_type key → cached user.
 */
export const getUserType = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.user_type) return decoded.user_type;
    }
    // Fallback: explicit user_type key (iOS-safe)
    const storedType = localStorage.getItem("user_type");
    if (storedType) return storedType;
  } catch (e) {
    // localStorage might not be available
  }
  if (_cachedUser) return _cachedUser.user_type;
  return null;
};

/**
 * Checks if the user is an admin.
 */
export const isAdmin = () => {
  try {
    if (localStorage.getItem("is_admin") === "true") return true;
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && (decoded.isAdmin || decoded.role === 'admin' || decoded.user_type === 'admin')) return true;
    }
  } catch (e) {}
  if (_cachedUser) return _cachedUser.user_type === 'admin';
  return false;
};

/**
 * Gets the admin's name.
 */
export const getAdminName = () => {
  try {
    return localStorage.getItem("admin_name");
  } catch (e) {
    return null;
  }
};


/**
 * Gets the user's full name.
 */
export const getFullName = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = decodeToken(token);
    return decoded ? (decoded.full_name || decoded.name) : null;
  }
  if (_cachedUser) return _cachedUser.full_name;
  return null;
};

/**
 * Clears all authentication data.
 */
export const logout = () => {
  // Clear localStorage fallback
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_type");
  localStorage.removeItem("is_admin");
  localStorage.removeItem("admin_name");
  // Clear cache
  _cachedUser = null;
  _cacheTimestamp = 0;
  // The httpOnly cookie is cleared by the backend on POST /api/logout
};

/**
 * Clears the cache (call after login to force refresh).
 */
export const clearCache = () => {
  _cachedUser = null;
  _cacheTimestamp = 0;
};
