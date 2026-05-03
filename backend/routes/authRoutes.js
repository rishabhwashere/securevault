const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  registerUser, 
  loginUser, 
  requestNomineeLogin, 
  checkNomineeStatus, 
  resolveNomineeLogin 
} = require('../controllers/authController');

// ==========================================
// STANDARD AUTH ROUTES
// ==========================================
router.post('/register', registerUser);
router.post('/login', loginUser);

// ==========================================
// NOMINEE AUTH ROUTES
// ==========================================

// 1. Nominee requests access
router.post('/nominee-login', requestNomineeLogin);

// 2. Nominee polls to see if main user approved them
router.get('/nominee-status/:ownerId', checkNomineeStatus);

// 3. Main user approves/denies the request (Requires them to be logged in)
router.post('/resolve-nominee', protect, resolveNomineeLogin);

module.exports = router;