import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}`}`;

export const socket = io(URL, {
    autoConnect: false, // We will manually connect in Navbar when logged in
    withCredentials: true
});
