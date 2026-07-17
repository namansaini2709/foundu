const fs = require("fs");
const readline = require("readline");
const { Pool } = require("pg");
require("dotenv").config({ path: __dirname + "/../.env" });

const postgresConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      host: process.env.PG_HOST || "localhost",
      user: process.env.PG_USER || "postgres",
      password: process.env.PG_PASS || "Gandhi@2005",
      database: process.env.PG_NAME || "foundu_local",
      port: parseInt(process.env.PG_PORT || "5432"),
      ssl: false
    };

const pool = new Pool(postgresConfig);

function mapType(mysqlType, extra) {
  const type = mysqlType.toLowerCase();

  if (extra.toLowerCase().includes("auto_increment")) {
    if (type.includes("bigint")) return "BIGSERIAL";
    return "SERIAL";
  }

  // Map tinyint to SMALLINT so PG positionally accepts 1 and 0
  if (type.includes("tinyint")) return "SMALLINT";
  if (type.includes("bigint")) return "BIGINT";
  if (type.includes("int")) return "INTEGER";
  if (type.includes("varchar")) {
    const match = type.match(/\d+/);
    return match ? `VARCHAR(${match[0]})` : "VARCHAR(255)";
  }
  if (type.includes("text")) return "TEXT";
  if (type.includes("decimal")) return mysqlType.toUpperCase();
  if (type.includes("float")) return "REAL";
  if (type.includes("double")) return "DOUBLE PRECISION";
  if (type.includes("json")) return "JSONB";
  if (type.includes("timestamp")) return "TIMESTAMP WITH TIME ZONE";
  if (type.includes("datetime")) return "TIMESTAMP WITH TIME ZONE";
  if (type.includes("date")) return "DATE";
  if (type.includes("time")) return "TIME";
  if (type.includes("enum")) return "VARCHAR(255)";

  return "TEXT";
}

async function run() {
  console.log("=== 🔌 TESTING DATABASE CONNECTION ===");
  // Test connection
  const testClient = await pool.connect();
  testClient.release();
  console.log("✅ Success: Connection verified!");

  const fileStream = fs.createReadStream(__dirname + "/../../railway_backup.sql");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentTable = null;
  let colDefs = [];
  let pks = [];
  let isParsingTable = false;
  let tableList = [];
  let insertCount = 0;

  console.log("\n=== ⚙️ STARTING SQL PARSING AND IMPORT ===");

  for await (const line of rl) {
    const trimmed = line.trim();

    // 1. Detect CREATE TABLE
    if (trimmed.startsWith("CREATE TABLE ")) {
      const match = trimmed.match(/CREATE TABLE `([^`]+)`/);
      if (match) {
        currentTable = match[1];
        colDefs = [];
        pks = [];
        isParsingTable = true;
        tableList.push(currentTable);
      }
      continue;
    }

    // 2. Parse Column/Constraints inside CREATE TABLE
    if (isParsingTable) {
      if (trimmed.startsWith("PRIMARY KEY ")) {
        const pkMatch = trimmed.match(/PRIMARY KEY \(([^)]+)\)/);
        if (pkMatch) {
          const pkCols = pkMatch[1].replace(/`/g, "").split(",").map(c => `"${c.trim()}"`);
          pks.push(`PRIMARY KEY (${pkCols.join(", ")})`);
        }
      } else if (trimmed.startsWith("UNIQUE KEY ") || trimmed.startsWith("KEY ") || trimmed.startsWith("CONSTRAINT ")) {
        // Skip MySQL foreign keys / indexes during raw creation (PG handles tables directly)
        continue;
      } else if (trimmed.startsWith(")") || trimmed.startsWith(" ENGINE=")) {
        // End of CREATE TABLE
        isParsingTable = false;
        
        if (pks.length > 0) {
          colDefs.push(pks[0]);
        }
        const createQuery = `CREATE TABLE "${currentTable}" (\n  ${colDefs.join(",\n  ")}\n)`;
        console.log(`\n--- Compiling schema for table "${currentTable}" ---`);
        console.log(createQuery);
        
        try {
          await pool.query(`DROP TABLE IF EXISTS "${currentTable}" CASCADE`);
          await pool.query(createQuery);
        } catch (err) {
          console.error(`Error creating table "${currentTable}":`, err.message);
        }
      } else {
        // Column definition line
        const colMatch = trimmed.match(/^`([^`]+)`\s+(.+)$/);
        if (colMatch) {
          const fieldName = colMatch[1];
          let rest = colMatch[2].trim();
          if (rest.endsWith(",")) rest = rest.slice(0, -1).trim();

          const extra = rest.toLowerCase();
          const isNull = extra.includes("not null") ? "NOT NULL" : "";
          const isAutoInc = extra.includes("auto_increment") ? "auto_increment" : "";

          // Extract MySQL type
          let typePart = rest.split(/\s+/)[0];
          if (rest.startsWith("enum")) {
            const enumMatch = rest.match(/enum\([^)]+\)/);
            if (enumMatch) typePart = enumMatch[0];
          }

          const pgType = mapType(typePart, isAutoInc);
          
          colDefs.push(`"${fieldName}" ${pgType} ${isNull}`.trim());
        }
      }
      continue;
    }

    // 3. Process INSERT INTO
    if (trimmed.startsWith("INSERT INTO ")) {
      // Translate backticks to double quotes for PG compliance
      let pgInsert = trimmed.replace(/`([^`]+)`/g, '"$1"');
      
      // Fix MySQL escaped single quotes (\') to PostgreSQL standard ('')
      pgInsert = pgInsert.replace(/\\'/g, "''");

      // Clean up MySQL double-escaped JSON strings inside single quotes (e.g. '"[\"Operations\"]"' -> '["Operations"]')
      pgInsert = pgInsert.replace(/'\\"(\[.*?\])\\\"'/g, "'$1'");
      pgInsert = pgInsert.replace(/'\\"(\{.*?\})\\\"'/g, "'$1'");
      pgInsert = pgInsert.replace(/'"(\[.*?\])"'/g, "'$1'");
      pgInsert = pgInsert.replace(/'"(\{.*?\})"'/g, "'$1'");

      // Fix MySQL escaped double quotes (\") to PostgreSQL standard (") for JSON fields
      pgInsert = pgInsert.replace(/\\+"/g, '"');
      
      // Execute directly using the pool
      try {
        await pool.query(pgInsert);
        insertCount++;
      } catch (err) {
        console.error(`❌ Insert Error in table "${currentTable}":`, err.message);
        console.error("Query preview:", pgInsert.slice(0, 300) + "...");
      }
    }
  }

  console.log(`\nImport complete! Total insert statements run: ${insertCount}`);

  // 4. Create missing AI Chatbot / System tables
  console.log("\n=== ⚙️ CREATING SYSTEM / AI CHATBOT TABLES ===");
  const createAITables = [
    `CREATE TABLE IF NOT EXISTS whatsapp_onboarding_sessions (
      id SERIAL PRIMARY KEY,
      phone_number VARCHAR(30) NOT NULL UNIQUE,
      role VARCHAR(20) NULL,
      current_step INTEGER DEFAULT 0,
      collected_data JSONB NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS ai_conversations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      session_id VARCHAR(255) NOT NULL UNIQUE,
      summary TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS ai_messages (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) NOT NULL,
      sender VARCHAR(20) CHECK (sender IN ('user', 'assistant')) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES ai_conversations(session_id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS founder_memories (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      extracted_fact TEXT NOT NULL,
      embedding JSONB NULL,
      category VARCHAR(50) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ];

  for (const q of createAITables) {
    try {
      await pool.query(q);
      const tableName = q.match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1];
      console.log(`Verified table "${tableName}" exists.`);
    } catch (err) {
      console.error("Error creating system table:", err.message);
    }
  }

  // 5. Re-add Embedding Columns (since they didn't exist in the original backup schemas)
  console.log("\n=== ⚙️ ENRICHING SCHEMAS WITH EMBEDDING COLUMNS ===");
  const alterQueries = [
    "ALTER TABLE freelancer_profiles ADD COLUMN IF NOT EXISTS embedding JSONB DEFAULT NULL",
    "ALTER TABLE cofounder_profiles ADD COLUMN IF NOT EXISTS embedding JSONB DEFAULT NULL",
    "ALTER TABLE startup_profiles ADD COLUMN IF NOT EXISTS embedding JSONB DEFAULT NULL",
    "ALTER TABLE foundu_jobs ADD COLUMN IF NOT EXISTS embedding JSONB DEFAULT NULL",
    "ALTER TABLE founder_memories ADD COLUMN IF NOT EXISTS embedding JSONB DEFAULT NULL"
  ];

  for (const q of alterQueries) {
    try {
      await pool.query(q);
      const tableName = q.split(" ")[2];
      console.log(`Verified embedding column for table "${tableName}".`);
    } catch (err) {
      console.error(`Error adding embedding: ${q}`, err.message);
    }
  }

  // 6. Update SERIAL sequences safely
  console.log("\n=== ⚙️ UPDATING SERIAL SEQUENCE CACHES ===");
  for (const table of tableList) {
    try {
      const seqRes = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1 AND column_default LIKE 'nextval%'
      `, [table]);

      for (const row of seqRes.rows) {
        const col = row.column_name;
        // Safe check sequence name first
        const seqNameRes = await pool.query(`SELECT pg_get_serial_sequence($1, $2) AS seq`, [`"${table}"`, col]);
        const seqName = seqNameRes.rows[0]?.seq;
        if (seqName) {
          const updateSeqQuery = `SELECT setval('${seqName}', COALESCE(MAX("${col}"), 1)) FROM "${table}"`;
          await pool.query(updateSeqQuery);
          console.log(`Updated sequence for table "${table}" column "${col}".`);
        }
      }
    } catch (err) {
      // Ignore safe sequence errors
    }
  }

  console.log("\n=== 🎉 DATABASE RESTORE COMPLETED SUCCESSFULLY! ===");
  process.exit(0);
}

run().catch(err => {
  console.error("❌ Fatal Restore Error:", err);
  process.exit(1);
});
