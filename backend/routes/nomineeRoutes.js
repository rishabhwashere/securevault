const express = require('express');
const router = express.Router();
const { getNominee, saveNominee, removeNominee } = require('../controllers/nomineeController');
const { protect } = require('../middleware/authMiddleware'); // Your JWT auth middleware

// All nominee routes must be protected (logged in users only)
router.use(protect);

router.get('/', getNominee);
router.post('/', saveNominee);
router.delete('/', removeNominee);

module.exports = router;