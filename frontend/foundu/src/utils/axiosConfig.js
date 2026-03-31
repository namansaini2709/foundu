import axios from "axios";

/**
 * Pre-configured Axios instance with JWT support.
 * 
 * HOW IT WORKS:
 * - On every request, it checks localStorage for a "token"
 * - If found, adds "Authorization: Bearer <token>" to the request headers
 * - This means ALL API calls using this instance are automatically authenticated
 * 
 * USAGE (in any component):
 *   import api from "../utils/axiosConfig";
 *   const res = await api.get("/api/notifications");
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true, // Still send cookies for backward compatibility
});

// ── REQUEST INTERCEPTOR: Attach JWT to every request ──
api.interceptors.request.use(
  (config) => {
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
      // Token expired or invalid - clear stored data
      console.warn("JWT expired or invalid. Clearing auth data.");
      // Don't auto-redirect here to avoid loops; let components handle it
    }
    return Promise.reject(error);
  }
);

export default api;
