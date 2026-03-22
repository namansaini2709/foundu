const router = require("express").Router();
const c = require("../controllers/startupProfileController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/", upload.single('startup_logo'), c.createProfile);
router.get("/", c.getAll);
router.get("/user/:userId", c.getByUserId);
router.delete("/:id", c.deleteById);

module.exports = router;
