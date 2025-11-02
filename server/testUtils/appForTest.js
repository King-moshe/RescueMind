require('dotenv').config();
process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'test-secret';
const express = require('express');
const bodyParser = require('express').json;
const authRoutes = require('../api/routes/authRoutes');

const app = express();
app.use(bodyParser());
app.use('/api/auth', authRoutes);

module.exports = app;
