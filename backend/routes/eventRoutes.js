const router = require("express").Router();
const eventController = require("../controllers/eventController");
const upload = require("../middlewares/uploadMiddleware");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { isAdminAuthenticated } = require("../middlewares/adminAuthMiddleware");

router.post("/events/promote", upload.single("flyer"), eventController.createPromotedEvent);
router.post("/events/verify-payment", eventController.verifyEventPayment);
router.get("/events/live", eventController.getLiveEvents);
router.get("/events/:id", eventController.getEventById);

// Event registrations routes
router.post("/events/register", isAuthenticated, eventController.createEventRegistration);
router.post("/events/verify-registration", isAuthenticated, eventController.verifyEventRegistration);
router.get("/events/:id/registration-status", isAuthenticated, eventController.getEventRegistrationStatus);

// Admin route for viewing event registrations
router.get("/admin/event-registrations", isAdminAuthenticated, eventController.getAdminEventRegistrations);

module.exports = router;

