import axios from "axios";

/**
 * Pre-configured Axios instance with httpOnly cookie support.
 * 
 * HOW IT WORKS:
 * - withCredentials: true ensures the browser sends httpOnly cookies automatically
 * - The JWT token is stored in an httpOnly cookie by the backend on login
 * - As a fallback, it also checks localStorage for a "token" (backward compat)
 * 
 * USAGE (in any component):
 *   import api from "../utils/axiosConfig";
 *   const res = await api.get("/api/notifications");
 */
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const PROD_BACKEND = "https://foundu-backend-production.up.railway.app";
const LOCAL_BACKEND = "http://localhost:4000";

const api = axios.create({
  // Use VITE_API_URL if defined, otherwise auto-switch based on where we are running
  baseURL: import.meta.env.VITE_API_URL || (isLocal ? LOCAL_BACKEND : PROD_BACKEND),
  withCredentials: true, 
});

// ── REQUEST INTERCEPTOR: Attach JWT from localStorage as fallback ──
api.interceptors.request.use(
  (config) => {
    // If the httpOnly cookie is present, the browser sends it automatically.
    // This fallback reads from localStorage for backward compatibility only.
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR: Handle 401 (token expired) ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("JWT expired or invalid. Clearing auth data.");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;
