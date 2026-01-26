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

  // 1️⃣ Check role
  db.query(
    "SELECT founder_id FROM users WHERE id = ?",
    [user_id],
    (err, rows) => {
      if (!rows.length || !rows[0].founder_id) {
        return res.status(400).json({ message: "User is not a founder" });
      }

      const founder_id = rows[0].founder_id;

      // 2️⃣ Insert profile
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
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          user_id, founder_id,
          startup_name, startup_logo_url,
          founderType, whyBuilding, superpower, superpowerOther,
          JSON.stringify(weaknesses || []),
          hoursPerWeek,
          JSON.stringify(cofounderType || []),
          problemSolving, whoHasProblem, problemImpact,
          solutionBuilding, monetization, unfairAdvantage,
          monthlyInvestment, survivalWithoutRevenue, biggestRisk,
          currentNeed, outcome30Days, executionFailures,
          JSON.stringify(trustFactors || []),
          useVendors,
          JSON.stringify(vendorCategories || []),
          JSON.stringify(vendorPreference || []),
          currentStage, growthBlocker, magicFix,
          JSON.stringify(dashboards || []),
          currentTools
        ],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

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
