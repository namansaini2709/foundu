const router = require("express").Router();
const controller = require("../controllers/usersSocialsController");

router.post("/user-socials", controller.addUserSocials);

module.exports = router;
