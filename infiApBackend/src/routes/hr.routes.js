const express = require("express");
const router = express.Router();
const hrController = require("../controllers/hr.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { verifyRole } = require("../middlewares/role.middleware");

// All HR routes require authentication
router.use(verifyJWT);

// -> Welcome Page
router.get("/dashboard/summary", hrController.getDashboardSummary);

// -> Employee
router.get("/employees", hrController.getAllEmployees);
router.post("/employees", verifyRole(["hr", "admin", "main_admin"]), hrController.addEmployee);
router.put("/employees/:id", verifyRole(["hr", "admin", "main_admin"]), hrController.editEmployee);
router.get("/employees/:id/profile", hrController.getEmployeeProfile);

// -> Attendance (Detailed)
router.get("/attendance/daily-overview", hrController.getAttendanceDailyOverview);
router.get("/attendance/records", hrController.getCheckInRecords);
router.post("/attendance/correction/submit", hrController.submitCorrectionRequest);
router.get("/attendance/correction/requests", hrController.getCorrectionRequests);
router.put("/attendance/correction/review", verifyRole(["hr", "admin", "main_admin"]), hrController.reviewCorrectionRequest);
router.get("/attendance/notifications", hrController.getAttendanceNotifications);
router.get("/attendance/reports", hrController.getAttendanceReports);
router.post("/attendance/generate-report", verifyRole(["hr", "admin", "main_admin"]), hrController.generateAttendanceReport);

// -> Leaves
router.get("/leaves/requests", hrController.getLeaveRequests);
router.put("/leaves/approve", verifyRole(["hr", "admin", "main_admin", "manager"]), hrController.approveLeave);
router.get("/leaves/history", hrController.getLeaveHistory);

// -> Recruitment
router.get("/recruitment/dashboard", hrController.getRecruitmentDashboard);
router.get("/recruitment/candidates", hrController.getCandidates);
router.get("/recruitment/applications", hrController.getApplications);

// -> Performance
router.get("/performance/dashboard", hrController.getPerformanceDashboard);
router.post("/performance/feedback", verifyRole(["hr", "admin", "main_admin", "manager"]), hrController.addFeedback);

// -> Finance
router.get("/finance/payroll", verifyRole(["hr", "admin", "main_admin"]), hrController.getPayroll);
router.post("/finance/salary/process", verifyRole(["hr", "admin", "main_admin"]), hrController.processSalary);
router.get("/finance/payslip/:id", hrController.getPayslip);

// -> Resignation
router.post("/resignation", hrController.submitResignation);
router.get("/resignation/register", hrController.getResignations);
router.put("/resignation/exit-process", verifyRole(["hr", "admin", "main_admin"]), hrController.processExit);

// -> Analytics
router.get("/analytics/report", hrController.getAnalyticsReport);
router.get("/analytics/attendance", hrController.getAttendanceAnalytics);
router.get("/analytics/performance", hrController.getPerformanceAnalytics);

module.exports = router;
