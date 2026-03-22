const db = require("../config/db");

/* CREATE STARTUP PROFILE */
exports.createProfile = (req, res) => {
  const {
    user_id,
    startup_name,
    startup_logo_url,
    founderType,
    whyBuilding,
    superpower,
    superpowerOther,
    weaknesses,
    hoursPerWeek,
    cofounderType,
    problemSolving,
    whoHasProblem,
    problemImpact,
    solutionBuilding,
    monetization,
    unfairAdvantage,
    monthlyInvestment,
    survivalWithoutRevenue,
    biggestRisk,
    currentNeed,
    outcome30Days,
    executionFailures,
    trustFactors,
    useVendors,
    vendorCategories,
    vendorPreference,
    currentStage,
    growthBlocker,
    magicFix,
    dashboards,
    currentTools
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  // 1️⃣ Check user role properly
  db.query(
    "SELECT user_type, founder_id FROM users WHERE id = ?",
    [user_id],
    (err, rows) => {
      if (err) {
        console.error("User lookup error:", err);
        return res.status(500).json({ error: err.message });
      }

      if (!rows.length || rows[0].user_type !== "founder") {
        return res.status(403).json({ message: "User is not a founder" });
      }

      const founder_id = rows[0].founder_id;

      // 2️⃣ Insert startup profile
      const values = [
        user_id,
        founder_id,
        startup_name || null,
        req.file ? `/uploads/${req.file.filename}` : (startup_logo_url || null),
        founderType || null,
        whyBuilding || null,
        superpower || null,
        superpowerOther || null,
        JSON.stringify(weaknesses || []),
        hoursPerWeek || null,
        JSON.stringify(cofounderType || []),
        problemSolving || null,
        whoHasProblem || null,
        problemImpact || null,
        solutionBuilding || null,
        monetization || null,
        unfairAdvantage || null,
        monthlyInvestment || null,
        survivalWithoutRevenue || null,
        biggestRisk || null,
        currentNeed || null,
        outcome30Days || null,
        executionFailures || null,
        JSON.stringify(trustFactors || []),
        useVendors || null,
        JSON.stringify(vendorCategories || []),
        JSON.stringify(vendorPreference || []),
        currentStage || null,
        growthBlocker || null,
        magicFix || null,
        JSON.stringify(dashboards || []),
        currentTools || null
      ];

      db.query(
        `INSERT INTO startup_profiles (
          user_id, founder_id,
          startup_name, startup_logo_url,
          founder_type, why_building, superpower, superpower_other,
          weaknesses, hours_per_week, cofounder_type,
          problem_solving, who_has_problem, problem_impact,
          solution_building, monetization, unfair_advantage,
          monthly_investment, survival_without_revenue, biggest_risk,
          current_need, outcome_30_days, execution_failures, trust_factors,
          use_vendors, vendor_categories, vendor_preference,
          current_stage, growth_blocker, magic_fix,
          dashboards, current_tools
        ) VALUES (${values.map(() => "?").join(",")})`,
        values,
        (err) => {
          if (err) {
            console.error("Startup profile insert error:", err);
            return res.status(500).json({
              error: err.message,
              sqlMessage: err.sqlMessage,
              code: err.code
            });
          }

          // 3️⃣ Mark profile complete
          db.query(
            "UPDATE users SET is_profile_complete = true WHERE id = ?",
            [user_id]
          );

          res.json({
            success: true,
            message: "Startup profile created successfully"
          });
        }
      );
    }
  );
};

exports.getAll = (_, res) => {
  db.query("SELECT * FROM startup_profiles", (_, rows) => res.json(rows));
};

exports.getByUserId = (req, res) => {
  db.query(
    "SELECT * FROM startup_profiles WHERE user_id = ?",
    [req.params.userId],
    (_, rows) =>
      rows.length ? res.json(rows[0]) : res.sendStatus(404)
  );
};

exports.deleteById = (req, res) => {
  db.query(
    "DELETE FROM startup_profiles WHERE id = ?",
    [req.params.id],
    () => res.json({ success: true })
  );
};
