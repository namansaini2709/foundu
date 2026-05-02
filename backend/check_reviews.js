const db = require("./config/db");
db.query("DESCRIBE reviews", (err, rows) => {
  if (err) console.error(err);
  else console.table(rows);
  process.exit(0);
});
