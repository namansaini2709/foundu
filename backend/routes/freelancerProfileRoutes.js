const router = require("express").Router();
const c = require("../controllers/freelancerProfileController");

router.post("/", c.createProfile);
router.get("/", c.getAll);
router.get("/user/:userId", c.getByUserId);
router.delete("/:id", c.deleteById);

module.exports = router;
