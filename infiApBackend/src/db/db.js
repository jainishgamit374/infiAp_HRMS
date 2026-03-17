const mongoose = require('mongoose');

const db_url = "mongodb+srv://Admin_abhiproject:wkOMq2zlxXRv2qtq@abhiproject.kdkcz42.mongodb.net/Atlas_db";

const connectDB = async () => {
    try {
        await mongoose.connect(db_url);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;