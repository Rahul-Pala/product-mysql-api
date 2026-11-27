const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { loginLimiter } = require("../middleware/rateLimitMiddleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", loginLimiter, authController.login);

// Protected route
router.get("/profile", authMiddleware, authController.getProfile);

module.exports = router;