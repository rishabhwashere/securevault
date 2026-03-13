console.log("routes loaded");
const express = require('express');
const router = express.Router();
const validateVaultInput = require('../middleware/validateVaultInput');
<<<<<<< HEAD
const { previewVaultData, getAllVaultData } = require('../controllers/vaultController');
router.post('/preview', validateVaultInput, previewVaultData);
router.get('/', getAllVaultData);

=======

const {
  createVaultEntry,
  getAllVaultEntries
} = require('../controllers/vaultController');

router.post('/', validateVaultInput, createVaultEntry);
router.get('/', getAllVaultEntries);

>>>>>>> 67b2b6df99205598c89ca9a27547f3cb2a9cc876
module.exports = router;