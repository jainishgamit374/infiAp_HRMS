const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require("../controllers/user.controller");

// Public auth routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
