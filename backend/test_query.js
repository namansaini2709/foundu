require('dotenv').config();
const db = require("./config/db");

const query = `
    SELECT ia.*, u.id as user_id 
    FROM influencer_applications ia
    LEFT JOIN users u ON ia.email = u.email
    WHERE ia.status = 'accepted' 
    ORDER BY ia.created_at DESC
`;

db.query(query, (err, rows) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
});
