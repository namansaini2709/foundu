require("dotenv").config();
const db = require("./config/db");
const fs = require("fs");
const path = require("path");

async function runMigration() {
    try {
        const migrationsDir = path.join(__dirname, "migrations");
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql"));
        
        console.log(`Found ${files.length} migration files.`);

        for (const file of files) {
            console.log(`\n--- Running Migration: ${file} ---`);
            const migrationSql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
            
            // Split by semicolon and filter out empty strings/comments
            const statements = migrationSql
                .split(";")
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith("--") && !s.startsWith("/*"));

            for (const statement of statements) {
                console.log(`Executing statement: ${statement.substring(0, 50)}...`);
                try {
                    await db.promise().query(statement);
                } catch (err) {
                    if (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_TABLE_EXISTS_ERROR') {
                        console.warn(`[WARN] Skipping: Already exists.`);
                    } else {
                        throw err;
                    }
                }
            }
        }

        console.log("\nAll migrations completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

runMigration();
