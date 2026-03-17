const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");

// Optionally use JWT middleware here to protect these routes
// const { verifyJWT } = require("../middlewares/auth.middleware");
// router.use(verifyJWT);

// Employee Dashboard Home Data
router.get("/dashboard/home", employeeController.getDashboardHome);

// Employee Punch (IN / OUT)
router.post("/emp-punch", employeeController.empPunch);

// Get User recent Punch Status
router.get("/punch-status", employeeController.getPunchStatus);

// Get Employee Leave Balance
router.get("/getemployeeleavebalance", employeeController.getEmployeeLeaveBalance);

// Late Check-in Count
router.get("/late-checkin-count", employeeController.getLateCheckinCount);

// Early Check-out Count
router.get("/early-checkout-count", employeeController.getEarlyCheckoutCount);

// Half Day Count
router.get("/Half_Day-count", employeeController.getHalfDayCount);

// Attendance Summary
router.get("/attendance-summary", employeeController.getAttendanceSummary);

// Missed Punches
router.get("/missed-punches", employeeController.getMissedPunches);

module.exports = router;
