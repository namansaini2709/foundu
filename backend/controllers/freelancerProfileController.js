const db = require("../config/db");

/* CREATE FREELANCER PROFILE */
exports.createProfile = (req, res) => {
  const {
    user_id,
    firstName,
    lastName,
    email,
    phoneNumber,
    degreeType,
    educationLevel,
    graduationYear,
    college,
    university,
    freelancerType,
    freelancerTypeOther,
    skillsDescription,
    describeBest,
    experience,
    jobProfile,
    workingEnvironment,
    stipendExpectations,
    stipendOther,
    linkedin,
    github,
    otherLinks
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  // 1️⃣ Validate role
  db.query(
    "SELECT freelancer_id FROM users WHERE id = ?",
    [user_id],
    (err, rows) => {
      if (!rows.length || !rows[0].freelancer_id) {
        return res.status(400).json({ message: "User is not a freelancer" });
      }

      const freelancer_id = rows[0].freelancer_id;

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
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          user_id, freelancer_id,
          firstName, lastName, email, phoneNumber,
          degreeType, educationLevel, graduationYear, college, university,
          freelancerType, freelancerTypeOther,
          skillsDescription, describeBest, experience,
          jobProfile, workingEnvironment,
          stipendExpectations, stipendOther,
          linkedin, github, otherLinks
        ],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          // 3️⃣ Mark profile complete
          db.query(
            "UPDATE users SET is_profile_complete = true WHERE id = ?",
            [user_id]
          );

          res.json({ success: true, message: "Freelancer profile created" });
        }
      );
    }
  );
};

/* GET ALL */
exports.getAll = (_, res) => {
  db.query("SELECT * FROM freelancer_profiles", (_, rows) => res.json(rows));
};

/* GET BY USER ID */
exports.getByUserId = (req, res) => {
  db.query(
    "SELECT * FROM freelancer_profiles WHERE user_id = ?",
    [req.params.userId],
    (_, rows) =>
      rows.length ? res.json(rows[0]) : res.sendStatus(404)
  );
};

/* DELETE */
exports.deleteById = (req, res) => {
  db.query(
    "DELETE FROM freelancer_profiles WHERE id = ?",
    [req.params.id],
    () => res.json({ success: true })
  );
};
