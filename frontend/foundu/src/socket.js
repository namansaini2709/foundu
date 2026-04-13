import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const socket = io(URL, {
    autoConnect: false, // We will manually connect in Navbar when logged in
    withCredentials: true
});

// Make it globally available as a fallback for production builds
if (typeof window !== "undefined") {
    window.socket = socket;
}
