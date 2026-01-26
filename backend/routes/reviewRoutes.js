const express = require("express");
const router = express.Router();
const controller = require("../controllers/reviewController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.post("/reviews", isAuthenticated, controller.createReview);
router.get("/reviews", controller.getAllReviews);
router.get("/reviews/:id", controller.getReviewById);
router.delete("/reviews/:id", isAuthenticated, controller.deleteReview);

module.exports = router;
