const mysql = require("mysql2");

// Railway provides process.env.MYSQL_URL automatically once connected.
// If it exists, use it. Otherwise, fall back to individual variables for local dev.
const db = process.env.MYSQL_URL 
  ? mysql.createPool(process.env.MYSQL_URL)
  : mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

module.exports = db;
