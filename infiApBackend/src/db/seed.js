const User = require("../models/user.model");

const seedDefaultUsers = async () => {
    try {
        // Seeds for Admin
        const adminEmail = "admin@example.com";
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            await User.create({
                name: "Super Admin",
                email: adminEmail,
                password: "Admin@123",  // You should change this later
                role: "admin",
                isEmailVerified: true
            });
            console.log(`✅ Default Admin created: ${adminEmail}`);
        } else {
            console.log(`ℹ️ Admin already exists: ${adminEmail}`);
        }

        // Seeds for Manager
        const managerEmail = "manager@example.com";
        const managerExists = await User.findOne({ email: managerEmail });

        if (!managerExists) {
            await User.create({
                name: "Default Manager",
                email: managerEmail,
                password: "Manager@123", // You should change this later
                role: "manager",
                isEmailVerified: true
            });
            console.log(`✅ Default Manager created: ${managerEmail}`);
        } else {
            console.log(`ℹ️ Manager already exists: ${managerEmail}`);
        }

    } catch (error) {
        console.error("❌ Error seeding default users:", error);
    }
};

module.exports = seedDefaultUsers;
