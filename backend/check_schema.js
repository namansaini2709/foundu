require("dotenv").config();
const db = require("./config/db");

async function checkSchema() {
    try {
        const [users] = await db.promise().query("DESCRIBE users");
        const [jobs] = await db.promise().query("DESCRIBE foundu_jobs");
        const [applicants] = await db.promise().query("DESCRIBE job_applicants");

        console.log("--- USERS ---");
        console.table(users);
        console.log("--- JOBS ---");
        console.table(jobs);
        console.log("--- APPLICANTS ---");
        console.table(applicants);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
