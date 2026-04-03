const mongoose = require("mongoose");

const resignationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    noticePeriodDays: { type: Number, default: 30 },
    lastWorkingDate: { type: Date },
    status: { type: String, enum: ["Submitted", "Under Review", "Approved", "Rejected", "Withdrawn"], default: "Submitted" },
    managerRemarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Resignation", resignationSchema);
