const express = require('express');
const router = express.Router();

const { generateShareLink, accessShareLink } = require('../controllers/shareController');
const authMiddleware = require('../middleware/authMiddleware');
const protect = authMiddleware.protect ? authMiddleware.protect : authMiddleware;
router.post('/generate/:vaultId', protect, generateShareLink);
router.post('/access/:token', accessShareLink);
module.exports = router;