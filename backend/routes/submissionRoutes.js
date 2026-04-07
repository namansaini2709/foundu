const router = require("express").Router();
const c = require("../controllers/submissionController");

router.post("/setup", c.setupProject);
router.get("/:job_id/:freelancer_id", c.getSubmissionByJobAndUser);
router.put("/:id/start", c.startProject);
router.put("/:id/submit", c.submitWork);
router.put("/:id/approve", c.approveSubmission);
router.put("/:id/request-changes", c.requestChanges);

module.exports = router;
