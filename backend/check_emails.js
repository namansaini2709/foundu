require('dotenv').config();
const db = require('./config/db');

async function checkEmails() {
    try {
        const [rows] = await db.promise().query("SELECT id, email, full_name, created_at FROM users ORDER BY id DESC LIMIT 5");
        console.table(rows);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

checkEmails();
