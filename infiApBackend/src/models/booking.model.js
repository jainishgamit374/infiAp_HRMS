const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        workEmail: { type: String, required: true },
        companyName: { type: String, required: true },
        helpMessage: { type: String },
        meetingDate: { type: Date, required: true },
        meetingLink: { type: String }, // Google Meet link
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
