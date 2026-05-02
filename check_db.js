const db = require('./backend/config/db');
db.query("SELECT id, email, user_type, freelancer_id FROM users WHERE email='batrakrish30@gmail.com'", (err, rows) => {
  console.log(rows);
  process.exit();
});
