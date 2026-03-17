const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
    {
        maintenanceMode: { type: Boolean, default: false },
        maxUsersPerCompany: { type: Number, default: 50 },
        defaultLeaveDays: { type: Number, default: 20 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Config", configSchema);
