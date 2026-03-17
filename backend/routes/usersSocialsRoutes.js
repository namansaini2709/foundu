const router = require("express").Router();
const controller = require("../controllers/usersSocialsController");

router.post("/user-socials", controller.addUserSocials);
router.get("/user-socials/:user_id", controller.getUserSocials);

module.exports = router;
