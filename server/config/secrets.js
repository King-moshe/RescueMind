require('dotenv').config();

const config = {
    dbUrl: process.env.MONGODB_URI || null,
};

module.exports = config;