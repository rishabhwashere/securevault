const express = require('express');
const router = express.Router();
const validateVaultInput = require('../middleware/validateVaultInput');
const { previewVaultData, getAllVaultData } = require('../controllers/vaultController');
router.post('/preview', validateVaultInput, previewVaultData);
router.get('/', getAllVaultData);

module.exports = router;