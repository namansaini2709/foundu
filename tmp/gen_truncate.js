const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function clearDb() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        const [tables] = await connection.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = ?
        `, [process.env.DB_NAME]);

        console.log("-- SQL to clear data EXCEPT admin tables");
        console.log("SET FOREIGN_KEY_CHECKS = 0;");
        
        for (const row of tables) {
            const table = row.TABLE_NAME || row.table_name;
            // Skip admin tables
            if (!table.toLowerCase().includes('admin')) {
                console.log(`TRUNCATE TABLE \`${table}\`;`);
            } else {
                console.log(`-- Keeping ${table}`);
            }
        }
        
        console.log("SET FOREIGN_KEY_CHECKS = 1;");
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error("Error generating SQL:", err.message);
        process.exit(1);
    }
}

clearDb();
