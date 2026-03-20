const db = require("./config/db");

db.query(
  "SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5",
  (err, rows) => {
    if (err) console.error(err);
    else console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  }
);
