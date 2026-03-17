const express = require("express");
const router = express.Router();
const mainAdminController = require("../controllers/mainAdmin.controller");

// Here you could add authentication and authorization middleware to protect these routes.
// const { verifyJWT, verifyRole } = require("../middlewares/auth.middleware");
// router.use(verifyJWT, verifyRole(["main_admin"]));

// Company Setup
router.post("/company", mainAdminController.createCompany);
router.put("/company/:id", mainAdminController.updateCompany);

// Global User Management
router.post("/admin", mainAdminController.createAdmin);
router.post("/hr", mainAdminController.createHR);
router.put("/user-permission/:id", mainAdminController.updateUserPermission);

// Platform Configuration
router.put("/config", mainAdminController.updateConfig);

// System Integrations
router.post("/integration/cloud", mainAdminController.updateIntegrationCloud);
router.post("/integration/email", mainAdminController.updateIntegrationEmail);
router.post("/integration/security", mainAdminController.updateIntegrationSecurity);

// OTP Approval System
router.post("/security/generate-otp", mainAdminController.generateOTP);
router.post("/security/verify-otp", mainAdminController.verifyOTP);
router.post("/security/approve-change", mainAdminController.approveChange);
router.post("/security/reject-change", mainAdminController.rejectChange);

module.exports = router;
