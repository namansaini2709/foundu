const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const upload = require("../middlewares/uploadMiddleware");

// Route to create a new post (with image upload)
router.post("/posts", upload.single("image"), postController.createPost);

// Route to get all posts for the live feed
router.get("/posts", postController.getAllPosts);

// Route to get posts by a specific user
router.get("/posts/user/:userId", postController.getUserPosts);

// Route to delete a post
router.delete("/posts/:postId", postController.deletePost);

// Like / Unlike a post
router.post("/posts/:postId/like", postController.likePost);

// Check if user liked a post
router.get("/posts/:postId/like-status", postController.getLikeStatus);

module.exports = router;
