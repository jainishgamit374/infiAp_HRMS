const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserRole,
    getAllUsers,
    verifyEmail,
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { verifyRole } = require("../middlewares/role.middleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/verify-email", verifyEmail);

// Auth required routes
router.post("/logout", verifyJWT, logoutUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.get("/me", verifyJWT, getCurrentUser);

// Admin only routes
router.get("/", verifyJWT, verifyRole(["admin"]), getAllUsers);
router.patch("/:id/role", verifyJWT, verifyRole(["admin"]), updateUserRole);

module.exports = router;
