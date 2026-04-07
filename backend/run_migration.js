require("dotenv").config();
const db = require("./config/db");
const fs = require("fs");
const path = require("path");

async function runMigration() {
    try {
        const migrationSql = fs.readFileSync(path.join(__dirname, "migrations", "razorpay_migration.sql"), "utf8");

        // Split by semicolon and filter out empty strings
        const statements = migrationSql.split(";").map(s => s.trim()).filter(s => s.length > 0);

        for (const statement of statements) {
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            await db.promise().query(statement);
        }

        console.log("Migration successful!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

runMigration();
