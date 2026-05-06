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

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/nominee-login', requestNomineeLogin);
router.get('/nominee-status/:ownerId', checkNomineeStatus);
router.post('/resolve-nominee', protect, resolveNomineeLogin);

module.exports = router;