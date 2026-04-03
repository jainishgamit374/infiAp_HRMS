const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true }, // e.g., "2023-10"
    year: { type: Number, required: true },
    efficiencyScore: { type: Number, min: 0, max: 100, default: 0 },
    qualityScore: { type: Number, min: 0, max: 100, default: 0 },
    reliabilityScore: { type: Number, min: 0, max: 100, default: 0 },
    feedback: { type: String },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Performance", performanceSchema);
