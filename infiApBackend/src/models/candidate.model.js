const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    jobId: { type: String, required: true },
    jobTitle: { type: String },
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    resumeUrl: { type: String },
    status: { type: String, enum: ["Applied", "Shortlisted", "Interviewed", "Hired", "Rejected"], default: "Applied" },
    appliedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Candidate", candidateSchema);
