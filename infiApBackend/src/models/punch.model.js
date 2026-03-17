const mongoose = require("mongoose");

const punchSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        PunchType: {
            type: Number,
            enum: [1, 2, 3], // 1 = in, 2 = out, 3 = reset
            required: true,
        },
        Latitude: {
            type: Number,
        },
        Longitude: {
            type: Number,
        },
        IsAway: {
            type: Boolean,
            default: false,
        },
        PunchTime: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Punch", punchSchema);
