const mongoose = require("mongoose");

const leaveBalanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        CL: { type: Number, default: 15 }, // Casual Leave
        PL: { type: Number, default: 15 }, // Privilege Leave
        SL: { type: Number, default: 13 }, // Sick Leave
        WFH: { type: Number, default: 7 }, // Work From Home days
    },
    { timestamps: true }
);

module.exports = mongoose.model("LeaveBalance", leaveBalanceSchema);
