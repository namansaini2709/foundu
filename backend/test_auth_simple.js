require('dotenv').config();
const axios = require('axios');

const API_URL = "http://localhost:4000/api";
let cookie = null;

async function testAuth() {
    try {
        const email = `testuser_${Date.now()}@example.com`;
        const password = "password123";
        
        // 1. Signup
        console.log(`Attempting Signup with ${email}...`);
        await axios.post(`${API_URL}/signup`, {
            full_name: "Test User",
            email,
            password,
            user_type: "freelancer"
        });
        
        // 2. Login
        console.log("Attempting Login...");
        const loginRes = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        
        // EXTRACT COOKIE
        const setCookie = loginRes.headers['set-cookie'];
        if (setCookie && setCookie.length > 0) {
             cookie = setCookie[0]; // grab the session cookie
             console.log("Cookie received:", cookie);
        } else {
             console.error("NO COOKIE RECEIVED!");
             return;
        }

        // 3. Get Chats WITH COOKIE
        console.log("Attempting Get Chats...");
        const chatRes = await axios.get(`${API_URL}/chat/my-chats`, {
             headers: { Cookie: cookie }
        });
        
        console.log("Get Chats SUCCESS. Found chats:", chatRes.data.length);
        
    } catch (e) {
        console.error("Test Failed:", e.response ? e.response.data : e.message);
    }
}
testAuth();
