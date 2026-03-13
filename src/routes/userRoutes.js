const express = require('express');
const router = express.Router();
const { createUser, registerUser, getAllUsers,loginUser } = require('../controllers/UserController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/', createUser);
router.get('/', getAllUsers);

module.exports = router;