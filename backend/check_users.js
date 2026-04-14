const db = require("./config/db");
db.query("SELECT id, user_type, founder_id FROM users LIMIT 10", (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
});
