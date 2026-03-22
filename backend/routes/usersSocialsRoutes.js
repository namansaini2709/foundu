const router = require("express").Router();
const controller = require("../controllers/usersSocialsController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/user-socials", upload.fields([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'past_work_proof', maxCount: 1 }
]), controller.addUserSocials);
router.get("/user-socials/:user_id", controller.getUserSocials);

module.exports = router;
