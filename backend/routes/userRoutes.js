const express = require('express');
const router = express.Router();

// FIX: Added curly braces around { protect }
const { protect } = require('../middleware/authMiddleware'); 
const { getAllUsers, getMe, updateMe } = require('../controllers/UserController');

router.get('/', getAllUsers);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;