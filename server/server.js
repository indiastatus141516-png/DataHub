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

app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');

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
      console.log('Default admin user created');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
