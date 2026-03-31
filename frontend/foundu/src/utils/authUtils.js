/**
 * Utility functions for JWT-based authentication
 */

/**
 * Decodes a JWT token without using external libraries
 * @param {string} token - The JWT string
 * @returns {Object|null} - The decoded payload or null
 */
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT token", e);
    return null;
  }
};

/**
 * Gets the token from localStorage
 */
export const getToken = () => localStorage.getItem("token");

/**
 * Gets the user ID from the token
 */
export const getUserId = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded ? decoded.id : null;
};

/**
 * Gets the user type from the token
 */
export const getUserType = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded ? decoded.user_type : null;
};

/**
 * Checks if the user is an admin
 */
export const isAdmin = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded ? (decoded.isAdmin || decoded.role === 'admin' || decoded.user_type === 'admin') : false;
};

/**
 * Gets the user's full name from the token
 */
export const getFullName = () => {
  const token = getToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded ? (decoded.full_name || decoded.name) : null;
};

/**
 * Clears authentication data
 */
export const logout = () => {
  localStorage.removeItem("token");
  // Clean up legacy keys just in case
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_type");
  localStorage.removeItem("is_admin");
  localStorage.removeItem("admin_name");
};
