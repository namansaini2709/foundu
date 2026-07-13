const { Pool } = require("pg");
require("dotenv").config();

// Determine connection settings
const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT);

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Required for Neon / Railway cloud pg in prod
    }
  : {
      host: process.env.PG_HOST || "localhost",
      user: process.env.PG_USER || "postgres",
      password: process.env.PG_PASS || "Gandhi@2005",
      database: process.env.PG_NAME || "foundu_local",
      port: parseInt(process.env.PG_PORT || "5432"),
      ssl: false,
    };

const pool = new Pool(poolConfig);

// Helper to translate MySQL queries/syntax to PostgreSQL on the fly
function translateQuery(sql, values) {
  if (typeof sql !== "string") return { sql, values };

  // 1. Replace MySQL backtick escapes (`) with PostgreSQL double quotes (")
  let translatedSql = sql.replace(/`/g, '"');

  // 2. Replace parameter placeholders: '?' -> '$1', '$2', etc.
  let index = 1;
  translatedSql = translatedSql.replace(/\?/g, () => `$${index++}`);

  // 3. For INSERT queries, automatically append "RETURNING *" if no RETURNING clause exists
  const upperSql = translatedSql.toUpperCase().trim();
  if (upperSql.startsWith("INSERT") && !upperSql.includes("RETURNING")) {
    translatedSql += " RETURNING *";
  }

  return { sql: translatedSql, values };
}

// Emulate the mysql2 pool interface (callback and promise support)
const db = {
  // Callback-based query: db.query(sql, params, callback)
  query: (sql, params, callback) => {
    let finalSql = sql;
    let finalParams = params;
    let finalCallback = callback;

    // Handle optional params: db.query(sql, callback)
    if (typeof params === "function") {
      finalCallback = params;
      finalParams = [];
    }

    const { sql: translatedSql, values } = translateQuery(finalSql, finalParams);

    pool.query(translatedSql, values, (err, res) => {
      if (err) {
        return finalCallback ? finalCallback(err, null) : null;
      }
      if (finalCallback) {
        if (res.command === "INSERT" || res.command === "UPDATE" || res.command === "DELETE") {
          const rows = res.rows;
          const insertId = rows.length > 0 ? (rows[0].id || rows[0].job_id || rows[0].review_id || null) : null;
          const mysqlResultMetadata = {
            fieldCount: 0,
            affectedRows: res.rowCount,
            insertId: insertId,
            info: "",
            serverStatus: 2,
            warningStatus: 0
          };
          finalCallback(null, mysqlResultMetadata, res.fields);
        } else {
          finalCallback(null, res.rows, res.fields);
        }
      }
    });
  },

  // Promise-based query: db.promise().query(sql, params)
  promise: () => {
    return {
      query: async (sql, params = []) => {
        const { sql: translatedSql, values } = translateQuery(sql, params);
        const res = await pool.query(translatedSql, values);
        
        // Emulate mysql2 promise output structure: [rows, fields]
        const rows = res.rows;
        if (res.command === "INSERT" || res.command === "UPDATE" || res.command === "DELETE") {
          const insertId = rows.length > 0 ? (rows[0].id || rows[0].job_id || rows[0].review_id || null) : null;
          
          const mysqlResultMetadata = {
            fieldCount: 0,
            affectedRows: res.rowCount,
            insertId: insertId,
            info: "",
            serverStatus: 2,
            warningStatus: 0
          };
          return [mysqlResultMetadata, res.fields];
        }

        return [rows, res.fields];
      }
    };
  },

  // Expose raw pg pool in case advanced pg features are needed
  pool: pool,
};

module.exports = db;

