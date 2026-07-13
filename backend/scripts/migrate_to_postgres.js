const mysql = require("mysql2/promise");
const { Client } = require("pg");
require("dotenv").config({ path: __dirname + "/../.env" });

// Database Connection Configurations
const mysqlConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Gandhi@2005",
  database: process.env.DB_NAME || "foundu",
};

const postgresConfig = {
  host: process.env.PG_HOST || "localhost",
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASS || "Gandhi@2005",
  database: process.env.PG_NAME || "foundu_local",
  port: parseInt(process.env.PG_PORT || "5432"),
};

// Helper: Map MySQL types to PostgreSQL types
function mapType(mysqlType, extra, defaultValue) {
  const type = mysqlType.toLowerCase();

  // Handle AUTO_INCREMENT -> SERIAL
  if (extra.toLowerCase().includes("auto_increment")) {
    if (type.includes("bigint")) return "BIGSERIAL";
    return "SERIAL";
  }

  if (type.includes("tinyint(1)")) return "BOOLEAN";
  if (type.includes("tinyint")) return "SMALLINT";
  if (type.includes("bigint")) return "BIGINT";
  if (type.includes("int")) return "INTEGER";
  if (type.includes("varchar")) {
    const match = type.match(/\d+/);
    return match ? `VARCHAR(${match[0]})` : "VARCHAR(255)";
  }
  if (type.includes("text")) return "TEXT";
  if (type.includes("decimal")) return mysqlType.toUpperCase(); // e.g. DECIMAL(10,2)
  if (type.includes("float")) return "REAL";
  if (type.includes("double")) return "DOUBLE PRECISION";
  if (type.includes("json")) return "JSONB";
  if (type.includes("timestamp")) return "TIMESTAMP WITH TIME ZONE";
  if (type.includes("datetime")) return "TIMESTAMP WITH TIME ZONE";
  if (type.includes("date")) return "DATE";
  if (type.includes("time")) return "TIME";
  if (type.includes("enum")) return "VARCHAR(255)"; // Simplify enums to varchar check constraints

  return "TEXT";
}

async function runMigration() {
  console.log("Starting Migration from MySQL to PostgreSQL...");
  console.log("MySQL Source:", mysqlConfig.database);
  console.log("PostgreSQL Destination:", postgresConfig.database);

  let mysqlConn;
  let pgClient;

  try {
    // 1. Connect to both Databases
    mysqlConn = await mysql.createConnection(mysqlConfig);
    pgClient = new Client(postgresConfig);
    await pgClient.connect();

    console.log("Connected to both databases successfully!");

    // 2. Fetch list of tables from MySQL
    const [tablesResult] = await mysqlConn.query("SHOW TABLES");
    const tables = tablesResult.map((row) => Object.values(row)[0]);
    console.log(`Found ${tables.length} tables in MySQL:`, tables);

    // 3. For each table, build schema and copy data
    for (const table of tables) {
      console.log(`\n----------------------------------------`);
      console.log(`Processing table: "${table}"`);

      // Get columns description
      const [columns] = await mysqlConn.query(`SHOW COLUMNS FROM \`${table}\``);

      // Map columns to PG syntax
      const pgColDefs = [];
      const primaryKeys = [];

      for (const col of columns) {
        const colName = `"${col.Field}"`;
        const colType = mapType(col.Type, col.Extra, col.Default);
        const isNull = col.Null === "YES" ? "" : "NOT NULL";
        
        let defaultClause = "";
        if (col.Default !== null && !col.Extra.includes("auto_increment")) {
          if (col.Default.toUpperCase() === "CURRENT_TIMESTAMP") {
            defaultClause = "DEFAULT CURRENT_TIMESTAMP";
          } else if (colType === "BOOLEAN") {
            defaultClause = `DEFAULT ${col.Default === "1" || col.Default === "true" || col.Default === true ? "TRUE" : "FALSE"}`;
          } else {
            defaultClause = `DEFAULT '${col.Default}'`;
          }
        }

        pgColDefs.push(`${colName} ${colType} ${isNull} ${defaultClause}`.trim());

        if (col.Key === "PRI") {
          primaryKeys.push(colName);
        }
      }

      // Append primary key constraint if exists
      if (primaryKeys.length > 0) {
        pgColDefs.push(`PRIMARY KEY (${primaryKeys.join(", ")})`);
      }

      // Drop table in PG if it exists
      await pgClient.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);

      // Create table in PG
      const createTableQuery = `CREATE TABLE "${table}" (\n  ${pgColDefs.join(",\n  ")}\n)`;
      console.log(`Creating table "${table}" in Postgres...`);
      await pgClient.query(createTableQuery);

      // Fetch all data rows from MySQL
      const [rows] = await mysqlConn.query(`SELECT * FROM \`${table}\``);
      console.log(`Found ${rows.length} rows to copy.`);

      if (rows.length > 0) {
        // Disable triggers/foreign key checks temporarily for this table to prevent insert order errors
        await pgClient.query(`ALTER TABLE "${table}" DISABLE TRIGGER ALL`);

        // Prepare bulk insert query
        const colNames = columns.map(c => `"${c.Field}"`).join(", ");
        
        // Loop and insert one by one or in batches
        for (const row of rows) {
          const values = [];
          const placeholders = [];

          columns.forEach((c, idx) => {
            let val = row[c.Field];

            // Convert buffer/binary/json to correct type
            const colType = mapType(c.Type, c.Extra, c.Default);
            if (colType === "BOOLEAN" && val !== null) {
              val = val === 1 || val === "1" || val === true || val === "true";
            } else if (colType === "JSONB" && val !== null) {
              val = typeof val === "object" ? JSON.stringify(val) : val;
            }

            values.push(val);
            placeholders.push(`$${idx + 1}`);
          });

          const insertQuery = `INSERT INTO "${table}" (${colNames}) VALUES (${placeholders.join(", ")})`;
          await pgClient.query(insertQuery, values);
        }

        // Re-enable triggers/foreign keys
        await pgClient.query(`ALTER TABLE "${table}" ENABLE TRIGGER ALL`);
        console.log(`Successfully migrated ${rows.length} rows into "${table}".`);
      }
    }

    // 4. Update postgres sequences for primary keys (so auto_increment doesn't start from 1 and cause duplicate key errors)
    console.log(`\n----------------------------------------`);
    console.log("Updating sequence values for SERIAL columns...");
    for (const table of tables) {
      const [columns] = await mysqlConn.query(`SHOW COLUMNS FROM \`${table}\``);
      const autoIncCol = columns.find(c => c.Extra.includes("auto_increment"));
      if (autoIncCol) {
        const seqName = `${table}_${autoIncCol.Field}_seq`;
        const updateSeqQuery = `SELECT setval(pg_get_serial_sequence('"${table}"', '${autoIncCol.Field}'), COALESCE(MAX("${autoIncCol.Field}"), 1)) FROM "${table}"`;
        await pgClient.query(updateSeqQuery);
        console.log(`Updated sequence for "${table}"."${autoIncCol.Field}"`);
      }
    }

    console.log("\n========================================");
    console.log("Migration Completed Successfully!");
    console.log("========================================");

  } catch (error) {
    console.error("Migration Failed with error:", error);
  } finally {
    if (mysqlConn) await mysqlConn.end();
    if (pgClient) await pgClient.end();
  }
}

runMigration();
