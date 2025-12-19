const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
mongoose.set('debug', false);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// Use a serverless-friendly cached MongoDB connector
const { connectToDatabase } = require('./utils/mongo');

// Connect DB before handling requests (first request will await connection)
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error('Error connecting to database:', err.message || err);
    // Do not crash the function; respond with 503 so client knows DB is unavailable
    return res.status(503).json({ error: 'Database connection error' });
  }
  next();
});

// Routes
app.use("/api", require("./routes"));

// 🔥 EXPORT APP (VERY IMPORTANT)
module.exports = app;
