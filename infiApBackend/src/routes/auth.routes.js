const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getCurrentUser
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

// Public auth routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/profile", verifyJWT, getCurrentUser);

module.exports = router;
