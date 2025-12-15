const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Disable mongoose debug mode
mongoose.set('debug', false);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route for testing
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// MongoDB connection
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Create default admin user if not exists
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const auth = require('./middleware/auth');

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        userId: 'admin001',
        email: 'admin@datamartx.com',
        password: hashedPassword,
        status: 'approved',
        role: 'admin',
        requestedAt: new Date()
      });
      await adminUser.save();
      console.log('Default admin user created: email: admin@datamartx.com, password: admin123');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Routes
const auth = require('./middleware/auth');
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', auth, require('./routes/admin'));
app.use('/api/data', auth, require('./routes/data'));
app.use('/api/purchase', auth, require('./routes/purchase'));
app.use('/api/profile', require('./routes/profile'));

// ✅ Export the app for Vercel serverless
module.exports = app;
