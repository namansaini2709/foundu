const db = require("./config/db");

db.query("DESCRIBE users", (err, results) => {
    if (err) {
        console.error("Error describing users table:", err);
    } else {
        console.log("Users table description:");
        console.table(results);
    }
    process.exit();
});
