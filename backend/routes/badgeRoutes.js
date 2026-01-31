const router = require("express").Router();
const c = require("../controllers/badgeController");

router.post("/badges/apply/blue", c.applyForBlueTick);
router.post("/badges/approve/blue", c.approveBlueTick);
router.post("/badges/reject/blue", c.rejectBlueTick);
router.post("/badges/recalculate", c.recalculateAutomaticBadges);

module.exports = router;
