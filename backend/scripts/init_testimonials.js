require('dotenv').config();
const db = require("../config/db");

async function createTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS homepage_testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        affiliation VARCHAR(255),
        rating INT DEFAULT 5,
        review TEXT NOT NULL,
        tagline VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    try {
        await db.promise().query(query);
        console.log("✅ Table 'homepage_testimonials' created or already exists.");

        // Seed initial data
        const [rows] = await db.promise().query("SELECT COUNT(*) as count FROM homepage_testimonials");
        if (rows[0].count === 0) {
            const seedQuery = `
            INSERT INTO homepage_testimonials (name, affiliation, rating, review, tagline) VALUES
            ('Krish', 'GGSIPU', 5, 'Amazing platform for finding the right co-founders!', 'Future belongs to builders 🚀'),
            ('Sarah', 'MIT', 5, 'Found the perfect co-founder here!', 'Building the future 💡'),
            ('Alex', 'Stanford', 5, 'Best freelance matching platform.', 'Innovation starts here ⚡'),
            ('Priya', 'IIT Delhi', 5, 'AI recommendations are spot on!', 'Dreams come true 🌟');
            `;
            await db.promise().query(seedQuery);
            console.log("✅ Seed data inserted.");
        }
    } catch (err) {
        console.error("❌ Error creating table:", err.message);
    } finally {
        process.exit();
    }
}

createTable();
