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

// MongoDB connection (safe for Vercel)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");

    // Create default admin once
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        userId: 'admin001',
        email: 'admin@datamartx.com',
        password: hashedPassword,
        status: 'approved',
        role: 'admin',
        requestedAt: new Date()
      });
      console.log("Default admin user created");
    }

  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// Connect DB before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use("/api", require("./routes"));

// 🔥 EXPORT APP (VERY IMPORTANT)
module.exports = app;
