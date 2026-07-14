const { localSearchFreelancers } = require("../services/geminiService");

async function runTest() {
  console.log("=== 🔍 RUNNING FREELANCER SUGGESTION ACCURACY TEST ===");

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Error: GEMINI_API_KEY is not defined in your environment/dotenv.");
    process.exit(1);
  }

  // Define a test search query (e.g. looking for a react stripe dev)
  const searchQuery = {
    skills: ["React", "Stripe"],
    maxBudget: 75000,
    founderNeeds: "We need a fullstack developer to build our billing dashboard with Stripe and React."
  };

  console.log("\nSearch Query Parameters:");
  console.log("- Core Skills:", searchQuery.skills);
  console.log("- Max Budget Limit:", searchQuery.maxBudget);
  console.log("- Startup Description/Needs:", searchQuery.founderNeeds);

  try {
    console.log("\nRunning vector similarity matcher + Gemini validation...");
    const recommendations = await localSearchFreelancers(searchQuery);

    console.log(`\nMatch results returned: ${recommendations.length}`);
    if (recommendations.length === 0) {
      console.log("⚠️ No matches found. Hint: Ensure you have run 'node scripts/backfill_embeddings.js' first so your database records have vector embeddings!");
    } else {
      recommendations.forEach((rec, idx) => {
        console.log(`\n--------------------------------------------`);
        console.log(`${idx + 1}. [Match Score: ${rec.match_score}%]`);
        console.log(`   Name: ${rec.full_name}`);
        console.log(`   Type: ${rec.user_type}`);
        console.log(`   Category assigned: ${rec.category || "General"}`);
        console.log(`   Reason: ${rec.reason}`);
      });
      console.log(`--------------------------------------------`);
      console.log("\n✅ Success: Matchmaking engine executed successfully!");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Matchmaking engine failed during test:", err.message);
    process.exit(1);
  }
}

runTest();
