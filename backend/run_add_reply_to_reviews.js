require('dotenv').config({path: './.env'});
const db = require('./config/db');
db.query("ALTER TABLE reviews ADD COLUMN reply_text TEXT DEFAULT NULL", (err) => {
  if (err && err.code !== 'ER_DUP_FIELDNAME') console.error(err);
  else console.log("Added reply_text");
  process.exit(0);
});
