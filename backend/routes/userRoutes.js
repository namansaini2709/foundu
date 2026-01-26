const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

router.get("/users", isAuthenticated, controller.getAllUsers);
router.get("/users/:id", isAuthenticated, controller.getUserById);
router.delete("/users/:id", isAuthenticated, controller.deleteUser);

module.exports = router;
