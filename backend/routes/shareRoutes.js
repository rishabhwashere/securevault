const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { generateShareLink, accessShareLink } = require('../controllers/shareController');

// Route to create a link (requires login)
router.post('/generate/:vaultId', protect, generateShareLink);

// Route to view a link (public, requires password)
router.post('/access/:token', accessShareLink);

module.exports = router;