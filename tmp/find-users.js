const db = require("../backend/config/db");
require('dotenv').config({ path: '../backend/.env' });

db.query("SELECT id, full_name, user_type FROM users WHERE user_type IN ('freelancer', 'cofounder') LIMIT 5", (err, rows) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Users available for testing:");
    console.table(rows);
    process.exit(0);
});
