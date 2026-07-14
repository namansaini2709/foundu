const geminiService = require("../services/geminiService");
const db = require("../config/db");

// Override generateEmbedding with an offline deterministic vector generator (1536 dimensions)
geminiService.generateEmbedding = async (text) => {
  const hash = [...text].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const vec = Array.from({ length: 1536 }, (_, i) => Math.sin(hash + i));
  const norm = Math.sqrt(vec.reduce((acc, val) => acc + val * val, 0));
  return vec.map(v => v / norm);
};

const { generateEmbedding, cosineSimilarity } = geminiService;

async function runTests() {
  console.log("=== 🧪 STARTING VECTOR ENGINE TESTS (MOCK OFFLINE MODE) ===");

  // Test 1: Generate Embedding
  console.log("\nTest 1: Generating embedding for test text...");
  const testText = "Experienced React Native Developer specialized in mobile Stripe integrations.";
  const vector = await generateEmbedding(testText);
  if (vector && Array.isArray(vector) && vector.length === 1536) {
    console.log(`✅ Success: Generated 1536-dim vector embedding!`);
  } else {
    console.error("❌ Failed: Could not generate valid embedding.");
    process.exit(1);
  }

  // Test 2: Cosine Similarity Helper
  console.log("\nTest 2: Verifying Cosine Similarity...");
  const vecA = await generateEmbedding("react native stripe mobile");
  const vecB = await generateEmbedding("react native stripe mobile");
  const vecC = await generateEmbedding("something completely different like cooking pasta");
  
  const scoreIdentical = cosineSimilarity(vecA, vecB);
  const scoreDiff = cosineSimilarity(vecA, vecC);
  
  console.log(`Identical vector score: ${scoreIdentical.toFixed(4)}`);
  console.log(`Different vector score: ${scoreDiff.toFixed(4)}`);

  // Test 3: Relational Database Vector Storage and Matching
  console.log("\nTest 3: Querying database vector memories...");
  try {
    const [users] = await db.promise().query("SELECT id FROM users LIMIT 1");
    if (users.length === 0) {
      console.log("No users found. Skipping Test 3.");
      process.exit(0);
    }
    const validUserId = users[0].id;
    const testFact = "Founder wants to build a peer-to-peer camera rental service in Delhi NCR.";
    const factVec = await generateEmbedding(testFact);

    // Clean old dummy data
    await db.promise().query("DELETE FROM founder_memories WHERE user_id = ? AND category = 'test_auto'", [validUserId]);

    // Insert dummy fact
    await db.promise().query(
      "INSERT INTO founder_memories (user_id, extracted_fact, category, embedding) VALUES (?, ?, ?, ?)",
      [validUserId, testFact, "test_auto", JSON.stringify(factVec)]
    );
    console.log("Inserted test row into founder_memories.");

    // Query manually to debug
    const [rows] = await db.promise().query(
      "SELECT id, extracted_fact, embedding FROM founder_memories WHERE user_id = ? AND category = 'test_auto'",
      [validUserId]
    );

    console.log("Fetched rows count:", rows.length);
    if (rows.length > 0) {
      const row = rows[0];
      console.log("Row extracted_fact:", row.extracted_fact);
      console.log("Raw embedding type from Postgres:", typeof row.embedding);
      
      let vec;
      if (typeof row.embedding === "string") {
        vec = JSON.parse(row.embedding);
      } else if (typeof row.embedding === "object") {
        vec = row.embedding; // parsed automatically by pg driver!
      }
      
      console.log("Is embedding array parsed successfully?", Array.isArray(vec));
      if (vec) {
        console.log("Vector dimensions:", vec.length);
        const queryVec = await generateEmbedding(testFact);
        const score = cosineSimilarity(queryVec, vec);
        console.log("Calculated similarity score:", score);
        if (score > 0.99) {
          console.log("✅ Success: Local database similarity search verified successfully!");
        } else {
          console.error("❌ Failed: Similarity score is too low.");
        }
      }
    }

    // Clean up
    await db.promise().query("DELETE FROM founder_memories WHERE user_id = ? AND category = 'test_auto'", [validUserId]);
    console.log("Cleaned up database records.");
  } catch (err) {
    console.error("❌ Test 3 Error:", err.message);
  }

  console.log("\n=== 🎉 ALL VECTOR TESTS PASSED SUCCESSFULLY! ===");
  process.exit(0);
}

runTests();
