const express = require('express');
const router = express.Router();

const validateVaultInput = require('../middleware/validateVaultInput');
const protect = require('../middleware/authMiddleware');

const { 
  createVaultEntry, 
  getAllVaultEntries, 
  updateVaultEntry, 
  deleteVaultEntry 
} = require('../controllers/vaultController');
console.log("Checking protect:", protect);
console.log("Checking getAllVaultEntries:", getAllVaultEntries);
router.get('/', protect, getAllVaultEntries);
router.post('/', protect, validateVaultInput, createVaultEntry)
router.put('/:id', protect, updateVaultEntry);
router.delete('/:id', protect, deleteVaultEntry);
module.exports = router;