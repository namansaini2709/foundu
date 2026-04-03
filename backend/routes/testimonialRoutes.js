const express = require("express");
const router = express.Router();
const controller = require("../controllers/testimonialController");
const { isAdminAuthenticated } = require("../middlewares/adminAuthMiddleware");

// Public Route
router.get("/testimonials", controller.getPublicTestimonials);

// Admin Routes (Protected)
router.get("/admin/testimonials",    isAdminAuthenticated, controller.getAllTestimonials);
router.post("/admin/testimonials",   isAdminAuthenticated, controller.createTestimonial);
router.put("/admin/testimonials/:id", isAdminAuthenticated, controller.updateTestimonial);
router.delete("/admin/testimonials/:id", isAdminAuthenticated, controller.deleteTestimonial);

module.exports = router;

