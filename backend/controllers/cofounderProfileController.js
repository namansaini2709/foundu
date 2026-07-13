const db = require("../config/db");
const notificationService = require("../services/notificationService");

/* CREATE COFOUNDER PROFILE */
exports.createProfile = (req, res) => {
  const {
    user_id,
    fullLegalName,
    linkedin,
    githubBehance,
    referenceContact,
    primaryIdentity,
    primaryIdentityOther,
    currentOccupationalStatus,
    pedigreeScore,
    superpower1,
    superpower2,
    superpower3,
    tool1,
    tool2,
    tool3,
    tool4,
    tool5,
    domainIQ,
    antiPortfolio,
    quantifiableImpact,
    drySpellRunway,
    currentBurnRequirement,
    bandwidthReality,
    moonlightPolicy,
    decisionHierarchy,
    conflictSimulation,
    feedbackLoop,
    workEnvironment,
    riskAppetite,
    exitVision,
    redLine,
    diversityOfThought,
    missingHalfProfile,
    industrySpecificity,
    equityMinimum,
    vibeKeywords,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  // 1️⃣ Check if user is a cofounder
  db.query(
    "SELECT cofounder_id FROM users WHERE id = ?",
    [user_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!rows.length || !rows[0].cofounder_id) {
        return res.status(400).json({ message: "User is not a cofounder" });
      }

      const cofounder_id = rows[0].cofounder_id;

      // 2️⃣ Insert cofounder profile (⚠️ EXACT placeholders = 38)
      const sql = `
        INSERT INTO cofounder_profiles (
          user_id, cofounder_id,
          full_legal_name, linkedin, github_behance, reference_contact,
          primary_identity, primary_identity_other,
          current_occupational_status, pedigree_score,
          superpower1, superpower2, superpower3,
          tool1, tool2, tool3, tool4, tool5,
          domain_iq, anti_portfolio, quantifiable_impact,
          dry_spell_runway, current_burn_requirement,
          bandwidth_reality, moonlight_policy,
          decision_hierarchy, conflict_simulation,
          feedback_loop, work_environment, risk_appetite,
          exit_vision, red_line, diversity_of_thought,
          missing_half_profile, industry_specificity,
          equity_minimum, vibe_keywords
        )
        VALUES (
          ?,?, ?,?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?,
          ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?, ?,?
        )
      `;

      const values = [
        user_id,
        cofounder_id,
        fullLegalName,
        linkedin,
        githubBehance,
        referenceContact,
        primaryIdentity,
        primaryIdentityOther,
        currentOccupationalStatus,
        pedigreeScore,
        superpower1,
        superpower2,
        superpower3,
        tool1,
        tool2,
        tool3,
        tool4,
        tool5,
        domainIQ,
        antiPortfolio,
        quantifiableImpact,
        drySpellRunway,
        currentBurnRequirement,
        bandwidthReality,
        moonlightPolicy,
        decisionHierarchy,
        conflictSimulation,
        feedbackLoop,
        workEnvironment,
        Number(riskAppetite) || null,
        exitVision,
        redLine,
        diversityOfThought,
        missingHalfProfile,
        JSON.stringify(industrySpecificity || []),
        equityMinimum,
        vibeKeywords,
      ];

      db.query(sql, values, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // 3️⃣ Mark profile complete
        db.query(
          "UPDATE users SET is_profile_complete = true WHERE id = ?",
          [user_id]
        );

        return res.status(201).json({
          success: true,
          message: "Cofounder profile created successfully",
        });
      });
    }
  );
};

/* GET ALL COFOUNDERS */
exports.getAll = (_, res) => {
  db.query("SELECT * FROM cofounder_profiles", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

/* GET BY USER ID */
exports.getByUserId = (req, res) => {
  db.query(
    "SELECT * FROM cofounder_profiles WHERE user_id = ?",
    [req.params.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (rows.length) {
        notificationService.sendNotification(
          req.params.userId,
          "New Profile View 👀",
          "Someone just visited your co-founder profile.",
          "profile",
          "/dashboard"
        );
        return res.json(rows[0]);
      } else {
        return res.sendStatus(404);
      }
    }
  );
};

/* DELETE PROFILE */
exports.deleteById = (req, res) => {
  db.query(
    "DELETE FROM cofounder_profiles WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
};
