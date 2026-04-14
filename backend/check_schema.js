require("dotenv").config();
const db = require("./config/db");

async function checkSchema() {
    try {
        const [users] = await db.promise().query("DESCRIBE users");
        const [jobs] = await db.promise().query("DESCRIBE foundu_jobs");
        const [applicants] = await db.promise().query("DESCRIBE job_applicants");
        const [startup_profiles] = await db.promise().query("DESCRIBE startup_profiles");

        require('fs').writeFileSync('schema_output.json', JSON.stringify({
            users,
            jobs,
            applicants,
            startup_profiles
        }, null, 2));
        console.log("Schema written to schema_output.json");
        console.log("--- STARTUP PROFILES ---");
        console.table(startup_profiles);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
