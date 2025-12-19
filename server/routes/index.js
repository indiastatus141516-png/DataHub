const express = require('express');

const router = express.Router();

// Basic test route
router.get('/test', (req, res) => {
  res.json({ ok: true, message: 'API test route' });
});

// Mount existing route modules safely
try {
  router.use('/auth', require('./auth'));
} catch (err) {
  console.error('Failed to load ./auth route:', err.message);
}

try {
  router.use('/admin', require('./admin'));
} catch (err) {
  // Admin routes might be optional in some deployments
  console.warn('Admin routes not loaded:', err.message);
}

try {
  router.use('/data', require('./data'));
} catch (err) {
  console.warn('Data routes not loaded:', err.message);
}

try {
  router.use('/profile', require('./profile'));
} catch (err) {
  console.warn('Profile routes not loaded:', err.message);
}

try {
  router.use('/purchase', require('./purchase'));
} catch (err) {
  console.warn('Purchase routes not loaded:', err.message);
}

try {
  router.use('/userData', require('./userData'));
} catch (err) {
  console.warn('UserData routes not loaded:', err.message);
}

module.exports = router;
