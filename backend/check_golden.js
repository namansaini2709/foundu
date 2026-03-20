require("dotenv").config({ path: __dirname + "/c:/All vs code projects/foundU/FoundUU/foundu/backend/.env" });
const mysql = require("mysql2");

// Need to read the .env correctly or just require the db module
const db = require("c:/All vs code projects/foundU/FoundUU/foundu/backend/config/db");

db.query(
  `SELECT 
    u.blue_tick_verified,
    u.golden_tick_verified,
    u.golden_tick_month,
    DATE_FORMAT(CURDATE(), '%Y-%m') AS current_month,
    COUNT(la.id) AS login_days_this_month
   FROM users u
   LEFT JOIN login_audit la 
     ON la.user_id = u.id 
     AND MONTH(la.login_date)  = MONTH(CURDATE())
     AND YEAR(la.login_date)   = YEAR(CURDATE())
   WHERE u.id = 4
   GROUP BY u.id`,
  (err, rows) => {
    if (err) console.error(err);
    else console.log(rows);
    process.exit(0);
  }
);
