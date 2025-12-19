const express = require('express');

const router = express.Router();

// Basic test route
router.get('/test', (req, res) => {
  res.json({ ok: true, message: 'API test route' });
});

// Mount route modules with comprehensive logging
const routeModules = [
  { path: '/auth', file: './auth', required: true },
  { path: '/admin', file: './admin', required: false },
  { path: '/data', file: './data', required: false },
  { path: '/profile', file: './profile', required: false },
  { path: '/purchase', file: './purchase', required: false },
  { path: '/userData', file: './userData', required: false },
];

routeModules.forEach(({ path, file, required }) => {
  try {
    const module = require(file);
    router.use(path, module);
    console.log(`[routes] Loaded ${path} from ${file}`);
  } catch (err) {
    const level = required ? 'error' : 'warn';
    console[level](`[routes] Failed to load ${file} for ${path}:`, err.message);
    if (required) throw err;
  }
});

module.exports = router;
