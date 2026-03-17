const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leave.controller");

// Optionally use JWT middleware here to protect these routes
// const { verifyJWT } = require("../middlewares/auth.middleware");
// router.use(verifyJWT);

// Apply for leave
router.post("/leaveapplications", leaveController.applyLeave);

// Get user's leaves
router.get("/leaveapplications", leaveController.getLeaveApplications);

// Get pending leave approvals
router.get("/leaveapprovals", leaveController.getLeaveApprovals);

// Approve a leave
router.post("/allapprove", leaveController.approveLeave);

module.exports = router;
