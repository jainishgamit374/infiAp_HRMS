const Booking = require("../models/booking.model");
const { sendBookingConfirmationEmail, sendMeetingLinkEmail } = require("../services/email.service");

// Create a new booking (public)
const createBooking = async (req, res) => {
    try {
        const { firstName, lastName, workEmail, companyName, helpMessage, meetingDate } = req.body;

        if (!firstName || !lastName || !workEmail || !companyName || !meetingDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const booking = await Booking.create({
            firstName,
            lastName,
            workEmail,
            companyName,
            helpMessage,
            meetingDate,
        });

        // Send confirmation email
        await sendBookingConfirmationEmail(workEmail, firstName, meetingDate);

        res.status(201).json({ message: "Booking request submitted successfully", booking });
    } catch (error) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ message: "Server error while creating booking" });
    }
};

// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Bookings fetched successfully", bookings });
    } catch (error) {
        console.error("Get All Bookings Error:", error);
        res.status(500).json({ message: "Server error while fetching bookings" });
    }
};

// Update booking status (admin only)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, meetingLink } = req.body;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (status) booking.status = status;

        if (meetingLink) {
            // Only update and send email if the meetingLink is new or changed
            if (booking.meetingLink !== meetingLink) {
                booking.meetingLink = meetingLink;
                booking.status = "confirmed"; // Auto-confirm if link is added

                await sendMeetingLinkEmail(booking.workEmail, booking.firstName, booking.meetingDate, meetingLink);
            }
        }

        await booking.save();
        res.status(200).json({ message: "Booking updated successfully", booking });
    } catch (error) {
        console.error("Update Booking Error:", error);
        res.status(500).json({ message: "Server error while updating booking" });
    }
};

// Delete booking (admin only)
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndDelete(id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Delete Booking Error:", error);
        res.status(500).json({ message: "Server error while deleting booking" });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    updateBookingStatus,
    deleteBooking,
};
