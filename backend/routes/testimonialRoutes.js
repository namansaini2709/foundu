const express = require("express");
const router = express.Router();
const controller = require("../controllers/testimonialController");
// const { isAuthenticated } = require("../middlewares/authMiddleware"); // Assuming admin auth is needed

// Public Route
router.get("/testimonials", controller.getPublicTestimonials);

// Admin Routes (Auth can be added later if needed)
router.get("/admin/testimonials", controller.getAllTestimonials);
router.post("/admin/testimonials", controller.createTestimonial);
router.put("/admin/testimonials/:id", controller.updateTestimonial);
router.delete("/admin/testimonials/:id", controller.deleteTestimonial);

module.exports = router;
