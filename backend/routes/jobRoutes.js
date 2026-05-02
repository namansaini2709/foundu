const router = require("express").Router();
const c = require("../controllers/jobController");

router.post("/jobs/freelancer", c.createFreelancerJob);
router.post("/jobs/cofounder", c.createCofounderJob);

router.get("/jobs", c.getAllJobs);
router.get("/jobs/dashboard-stats/:userId", c.getDashboardStats);
router.get("/jobs/:id", c.getJobById);
router.get("/jobs/user/:userId", c.getJobsByUserId);
router.delete("/jobs/:id", c.deleteJobById);

module.exports = router;
