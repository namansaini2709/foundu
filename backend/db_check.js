require('dotenv').config();
const db = require("./config/db");

const tables = ['chats', 'chat_participants', 'messages'];

async function checkDatabase() {
    console.log("Checking database tables...");
    
    for (const table of tables) {
        try {
            const [rows] = await db.promise().query(`SHOW TABLES LIKE '${table}'`);
            if (rows.length > 0) {
                console.log(`✅ Table '${table}' exists.`);
            } else {
                console.log(`❌ Table '${table}' MISSING!`);
            }
        } catch (err) {
            console.error(`Error checking for table '${table}':`, err.message);
        }
    }
    
    process.exit();
}

checkDatabase();
