/**
 * Configuration Utility for Environment-Aware URLs.
 * 
 * This ensures the app always points to the correct backend:
 * - Localhost during development.
 * - Railway Production for the live site (foundu.in).
 */

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Your Railway production backend URL
const PROD_URL = "https://rare-dedication-production-f321.up.railway.app";
const LOCAL_URL = "http://localhost:4000";

export const API_URL = import.meta.env.VITE_API_URL || (isLocal ? LOCAL_URL : PROD_URL);
export const API_BASE = `${API_URL}/api`;
export const STATIC_URL = API_URL; // Used for /uploads and images

export default {
  API_URL,
  API_BASE,
  STATIC_URL
};
