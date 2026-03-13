const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/UserController');

// Only routes related to fetching/modifying user data go here
router.get('/', getAllUsers);

module.exports = router;