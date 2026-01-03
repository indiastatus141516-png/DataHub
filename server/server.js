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
try {
  const apiRoutes = require("./routes");
  app.use("/api", apiRoutes);
  console.log('[server] Routes loaded successfully');
} catch (err) {
  console.error('[server] Failed to load routes:', err.message || err);
  console.error('[server] Full error:', err);
  // Don't throw - let the server start anyway so we can see what's happening
  // This prevents FUNCTION_INVOCATION_FAILED from crashing the entire serverless function
}

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler middleware (must be last)
app.use((err, req, res, next) => {
  console.error('[server] Error:', err.message || err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 🔥 EXPORT APP (VERY IMPORTANT)
module.exports = app;
