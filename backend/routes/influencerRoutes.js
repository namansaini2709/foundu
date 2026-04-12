const express = require("express");
const router = express.Router();
const controller = require("../controllers/influencerController");
const upload = require("../middlewares/uploadMiddleware");

// Route to submit influencer application
router.post(
    "/apply",
    upload.fields([
        { name: 'photo', maxCount: 1 },
        { name: 'banner', maxCount: 1 }
    ]),
    controller.apply
);

// Route to get all applications (Admin use)
router.get("/", controller.getAllApplications);

// Route to update application status
router.patch("/:id/status", controller.updateStatus);

// Route to get accepted influencers for marketplace
router.get("/marketplace", controller.getMarketplaceInfluencers);

module.exports = router;
