const router = require("express").Router();
const c = require("../controllers/ideaController");

router.post("/ideas/create", c.createIdea);
router.get("/ideas/user/:user_id", c.getUserIdeas);
router.put("/ideas/milestone/:milestone_id", c.toggleMilestone);
router.delete("/ideas/:idea_id", c.deleteIdea);

module.exports = router;
