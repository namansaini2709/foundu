const { generateEmbedding } = require("../services/geminiService");
const db = require("../config/db");

const queryAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

async function backfill() {
  console.log("=== ⚙️ STARTING EMBEDDING BACKFILL FOR EXISTING DATA ===");

  try {
    // 1. Backfill Freelancer Profiles
    console.log("\n1. Processing Freelancer Profiles...");
    const freelancers = await queryAsync(`
      SELECT f.user_id, f.first_name, f.last_name, f.skills_description, f.experience, f.stipend_expectations, f.github, f.other_links, f.freelancer_type, f.describe_best, f.resume_summary
      FROM freelancer_profiles f
      WHERE f.embedding IS NULL
    `);
    console.log(`Found ${freelancers.length} freelancers needing embeddings.`);
    for (const f of freelancers) {
      const name = `${f.first_name || ""} ${f.last_name || ""}`.trim();
      const profileText = `Name: ${name} | Skills: ${f.skills_description || ""} | Stack: ${f.describe_best || ""} | Expertise: ${f.freelancer_type || ""} | Experience: ${f.experience || ""} | Budget: ${f.stipend_expectations || ""} | Portfolio: ${f.github || ""} | Resume Summary: ${f.resume_summary || f.other_links || ""}`;
      console.log(`Generating embedding for Freelancer: ${name}...`);
      const embedding = await generateEmbedding(profileText);
      if (embedding) {
        await queryAsync("UPDATE freelancer_profiles SET embedding = ? WHERE user_id = ?", [JSON.stringify(embedding), f.user_id]);
        console.log(`✅ Success`);
      }
    }

    // 2. Backfill Co-founder Profiles
    console.log("\n2. Processing Co-founder Profiles...");
    const cofounders = await queryAsync(`
      SELECT c.user_id, c.full_legal_name, c.primary_identity, c.anti_portfolio, c.equity_minimum
      FROM cofounder_profiles c
      WHERE c.embedding IS NULL
    `);
    console.log(`Found ${cofounders.length} co-founders needing embeddings.`);
    for (const c of cofounders) {
      const profileText = `Name: ${c.full_legal_name || ""} | Expertise: ${c.primary_identity || ""} | Superpowers: ${c.anti_portfolio || ""} | Equity: ${c.equity_minimum || ""}`;
      console.log(`Generating embedding for Co-founder: ${c.full_legal_name}...`);
      const embedding = await generateEmbedding(profileText);
      if (embedding) {
        await queryAsync("UPDATE cofounder_profiles SET embedding = ? WHERE user_id = ?", [JSON.stringify(embedding), c.user_id]);
        console.log(`✅ Success`);
      }
    }

    // 3. Backfill Startup Profiles
    console.log("\n3. Processing Startup Profiles...");
    const startups = await queryAsync(`
      SELECT s.user_id, s.startup_name, s.current_stage, s.current_need, s.monthly_investment, s.solution_building
      FROM startup_profiles s
      WHERE s.embedding IS NULL
    `);
    console.log(`Found ${startups.length} startups needing embeddings.`);
    for (const s of startups) {
      const profileText = `Name: ${s.startup_name || ""} | Stage: ${s.current_stage || ""} | Needs: ${s.current_need || ""} | Budget: ${s.monthly_investment || ""} | Description: ${s.solution_building || ""}`;
      console.log(`Generating embedding for Startup: ${s.startup_name}...`);
      const embedding = await generateEmbedding(profileText);
      if (embedding) {
        await queryAsync("UPDATE startup_profiles SET embedding = ? WHERE user_id = ?", [JSON.stringify(embedding), s.user_id]);
        console.log(`✅ Success`);
      }
    }

    // 4. Backfill Jobs
    console.log("\n4. Processing Jobs...");
    const jobs = await queryAsync(`
      SELECT j.job_id, j.job_title, j.startup_name, j.job_requirements, j.budget_range, j.job_type
      FROM foundu_jobs j
      WHERE j.embedding IS NULL
    `);
    console.log(`Found ${jobs.length} jobs needing embeddings.`);
    for (const j of jobs) {
      const profileText = `Job Title: ${j.job_title || ""} | Startup: ${j.startup_name || ""} | Requirements: ${j.job_requirements || ""} | Budget: ${j.budget_range || ""} | Type: ${j.job_type || ""}`;
      console.log(`Generating embedding for Job: ${j.job_title}...`);
      const embedding = await generateEmbedding(profileText);
      if (embedding) {
        await queryAsync("UPDATE foundu_jobs SET embedding = ? WHERE job_id = ?", [JSON.stringify(embedding), j.job_id]);
        console.log(`✅ Success`);
      }
    }

    console.log("\n=== 🎉 EMBEDDING BACKFILL COMPLETED SUCCESSFULLY! ===");
    process.exit(0);
  } catch (err) {
    console.error("❌ Backfill failed:", err.message);
    process.exit(1);
  }
}

backfill();
