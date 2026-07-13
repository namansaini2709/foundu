const db = require("../config/db");
const notificationService = require("../services/notificationService");

/* CREATE FREELANCER PROFILE */
exports.createProfile = (req, res) => {
  const {
    user_id,
    first_name,           // ✅ Changed from firstName
    last_name,            // ✅ Changed from lastName
    email,
    phone_number,         // ✅ Changed from phoneNumber
    degree_type,          // ✅ Changed from degreeType
    education_level,      // ✅ Changed from educationLevel
    graduation_year,      // ✅ Changed from graduationYear
    college,
    university,
    freelancer_type,      // ✅ Changed from freelancerType
    freelancer_type_other,// ✅ Changed from freelancerTypeOther
    skills_description,   // ✅ Changed from skillsDescription
    describe_best,        // ✅ Changed from describeBest
    experience,
    job_profile,          // ✅ Changed from jobProfile
    working_environment,  // ✅ Changed from workingEnvironment
    stipend_expectations, // ✅ Changed from stipendExpectations
    stipend_other,        // ✅ Changed from stipendOther
    linkedin,
    github,
    other_links           // ✅ Changed from otherLinks
  } = req.body;

  // Validation
  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  // 1️⃣ Validate role and get freelancer_id
  db.query(
    "SELECT freelancer_id, user_type FROM users WHERE id = ?",
    [user_id],
    (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
      }

      if (!rows.length) {
        return res.status(404).json({ message: "User not found" });
      }

      if (rows[0].user_type !== 'freelancer') {
        return res.status(400).json({ message: "User is not a freelancer" });
      }

      let freelancer_id = rows[0].freelancer_id;

      const proceedToInsert = (fid) => {
        // 2️⃣ Insert profile
        db.query(
          `INSERT INTO freelancer_profiles (
            user_id, freelancer_id,
            first_name, last_name, email, phone_number,
            degree_type, education_level, graduation_year, college, university,
            freelancer_type, freelancer_type_other,
            skills_description, describe_best, experience,
            job_profile, working_environment,
            stipend_expectations, stipend_other,
            linkedin, github, other_links
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
          ON CONFLICT (user_id) DO UPDATE SET 
            first_name=EXCLUDED.first_name, last_name=EXCLUDED.last_name, phone_number=EXCLUDED.phone_number,
            degree_type=EXCLUDED.degree_type, education_level=EXCLUDED.education_level, graduation_year=EXCLUDED.graduation_year,
            college=EXCLUDED.college, university=EXCLUDED.university,
            freelancer_type=EXCLUDED.freelancer_type, freelancer_type_other=EXCLUDED.freelancer_type_other,
            skills_description=EXCLUDED.skills_description, describe_best=EXCLUDED.describe_best, experience=EXCLUDED.experience,
            job_profile=EXCLUDED.job_profile, working_environment=EXCLUDED.working_environment,
            stipend_expectations=EXCLUDED.stipend_expectations, stipend_other=EXCLUDED.stipend_other,
            linkedin=EXCLUDED.linkedin, github=EXCLUDED.github, other_links=EXCLUDED.other_links`,
          [
            user_id, fid,
            first_name, last_name, email, phone_number,
            degree_type, education_level, graduation_year, college, university,
            freelancer_type, freelancer_type_other,
            skills_description, describe_best, experience,
            job_profile, working_environment,
            stipend_expectations, stipend_other,
            linkedin, github, other_links
          ],
          (err, result) => {
            if (err) {
              console.error("Profile creation error:", err);
              return res.status(500).json({ error: err.message });
            }

            // 3️⃣ Mark profile complete
            db.query(
              "UPDATE users SET is_profile_complete = true WHERE id = ?",
              [user_id],
              (updateErr) => {
                if (updateErr) {
                  console.error("Update user error:", updateErr);
                }

                res.json({ 
                  success: true, 
                  message: "Freelancer profile created successfully",
                  profile_id: result.insertId || result.insertId,
                  freelancer_id: fid
                });
              }
            );
          }
        );
      };

      if (!freelancer_id) {
        db.query("SELECT COALESCE(MAX(freelancer_id),0)+1 AS next_id FROM users WHERE user_type='freelancer'", (err, frows) => {
          if (err) return res.status(500).json({ error: err.message });
          freelancer_id = frows[0].next_id;
          db.query("UPDATE users SET freelancer_id = ? WHERE id = ?", [freelancer_id, user_id], (err) => {
             if (err) return res.status(500).json({ error: err.message });
             proceedToInsert(freelancer_id);
          });
        });
      } else {
        proceedToInsert(freelancer_id);
      }
    }
  );
};

/* GET ALL */
exports.getAll = (req, res) => {
  db.query("SELECT * FROM freelancer_profiles", (err, rows) => {
    if (err) {
      console.error("Get all profiles error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

/* GET BY USER ID */
exports.getByUserId = (req, res) => {
  db.query(
    "SELECT * FROM freelancer_profiles WHERE user_id = ?",
    [req.params.userId],
    (err, rows) => {
      if (err) {
        console.error("Get profile error:", err);
        return res.status(500).json({ error: err.message });
      }

      if (rows.length) {
        notificationService.sendNotification(
          req.params.userId,
          "New Profile View 👀",
          "Someone just visited your freelancer profile.",
          "profile",
          "/dashboard"
        );
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: "Profile not found" });
      }
    }
  );
};

/* DELETE */
exports.deleteById = (req, res) => {
  db.query(
    "DELETE FROM freelancer_profiles WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        console.error("Delete profile error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, message: "Profile deleted successfully" });
    }
  );
};