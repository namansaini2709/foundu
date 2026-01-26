const router = require("express").Router();
const c = require("../controllers/jobController");

router.post("/jobs/freelancer", c.createFreelancerJob);
router.post("/jobs/cofounder", c.createCofounderJob);

router.get("/jobs", c.getAllJobs);
router.get("/jobs/:id", c.getJobById);
router.delete("/jobs/:id", c.deleteJobById);

module.exports = router;
