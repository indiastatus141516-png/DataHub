const express = require('express');
const path = require('path');

const router = express.Router();

console.log('[routes] Current directory:', __dirname);
console.log('[routes] Routes directory:', path.join(__dirname));

// Basic test route
router.get('/test', (req, res) => {
  res.json({ ok: true, message: 'API test route' });
});

// Mount route modules with comprehensive logging
const routeModules = [
  { path: '/auth', file: 'auth.js', required: true },
  { path: '/admin', file: 'admin.js', required: false },
  { path: '/data', file: 'data.js', required: false },
  { path: '/profile', file: 'profile.js', required: false },
  { path: '/purchase', file: 'purchase.js', required: false },
  { path: '/userData', file: 'userData.js', required: false },
];

routeModules.forEach(({ path: routePath, file, required }) => {
  try {
    const filePath = path.join(__dirname, file);
    console.log(`[routes] Attempting to load ${file} from ${filePath}`);
    const module = require(filePath);
    router.use(routePath, module);
    console.log(`[routes] Loaded ${routePath} from ${file}`);
  } catch (err) {
    const level = required ? 'error' : 'warn';
    console[level](`[routes] Failed to load ${file} for ${routePath}:`, err.message);
    console[level](`[routes] Error details:`, err.stack);
    if (required) throw err;
  }
});

module.exports = router;
