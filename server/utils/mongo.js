const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Do not throw at import time; allow callers to handle missing env in serverless envs
  console.warn('Warning: MONGODB_URI is not defined');
}

let cached = global.__mongooseConnection || null;

async function connectToDatabase() {
  if (cached) return cached;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not provided');
  }

  // Use mongoose to connect and cache the connection on the global object
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // options left to mongoose defaults; set if needed
    });
    cached = conn;
    global.__mongooseConnection = cached;
    console.log('MongoDB connected (cached)');
    return cached;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}

module.exports = { connectToDatabase };
