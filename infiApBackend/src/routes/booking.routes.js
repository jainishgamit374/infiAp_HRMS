const express = require("express");
const router = express.Router();
const {
    createBooking,
    getAllBookings,
    updateBookingStatus,
    deleteBooking,
} = require("../controllers/booking.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { verifyRole } = require("../middlewares/role.middleware");

// Public route
router.post("/", createBooking);

// Admin only routes
router.get("/", verifyJWT, verifyRole(["admin", "manager"]), getAllBookings);
router.patch("/:id", verifyJWT, verifyRole(["admin", "manager"]), updateBookingStatus);
router.delete("/:id", verifyJWT, verifyRole(["admin"]), deleteBooking);

module.exports = router;
