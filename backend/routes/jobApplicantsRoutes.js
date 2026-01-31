const router = require("express").Router();
const c = require("../controllers/jobApplicantsController");

router.post("/jobs/apply", c.applyToJob);
router.get("/jobs/:job_id/applicants", c.getAllApplicants);
router.get("/jobs/:job_id/applicants/:user_id",c.getApplicantByUserId);
router.put("/jobs/:job_id/applicants/:user_id/status",c.updateApplicantStatus);
router.delete("/jobs/:job_id/applicants/:user_id",c.deleteApplicant);

module.exports = router;
