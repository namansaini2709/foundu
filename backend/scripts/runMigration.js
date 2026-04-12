const db = require("../config/db");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const migrationPath = path.join(__dirname, "../migrations/influencer_v3_migration.sql");
const sql = fs.readFileSync(migrationPath, "utf8");

// Split by semicolon but ignore empty strings
const queries = sql.split(";").map(q => q.trim()).filter(q => q.length > 0);

async function runMigration() {
    console.log("🚀 Starting database migration...");

    for (const query of queries) {
        try {
            console.log(`Executing: ${query}`);
            await db.promise().query(query);
            console.log("✅ Success!");
        } catch (err) {
            if (err.code === "ER_DUP_COLUMN_NAME") {
                console.log("ℹ️ Column already exists, skipping...");
            } else if (err.code === "ER_DUP_KEYNAME") {
                console.log("ℹ️ Index already exists, skipping...");
            } else {
                console.error("❌ Error executing query:", err.message);
            }
        }
    }

    console.log("✨ Migration complete!");
    process.exit(0);
}

runMigration();
