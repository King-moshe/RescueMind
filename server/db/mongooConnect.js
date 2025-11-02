const {config} = require('../config/secrets')
const mongoose = require('mongoose');
// Connection URI should be provided via environment variable
const connectDB = async () => {
    try {
        await mongoose.connect(config.dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        // Following the project's error handling pattern
        throw new Error('Database connection failed');
    }
};

module.exports = connectDB;