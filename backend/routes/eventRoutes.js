const router = require("express").Router();
const eventController = require("../controllers/eventController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/events/promote", upload.single("flyer"), eventController.createPromotedEvent);
router.post("/events/verify-payment", eventController.verifyEventPayment);
router.get("/events/live", eventController.getLiveEvents);
router.get("/events/:id", eventController.getEventById);

module.exports = router;
