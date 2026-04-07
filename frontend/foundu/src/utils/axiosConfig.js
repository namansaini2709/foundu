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
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true, // Sends httpOnly cookies with every request
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
