const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/UserController');

router.get('/', getAllUsers);

module.exports = router;