require("dotenv").config({ path: "backend/.env" });
const db = require("../backend/config/db");

async function listTables() {
    try {
        const [rows] = await db.promise().query("SHOW TABLES");
        console.log(JSON.stringify(rows));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listTables();
