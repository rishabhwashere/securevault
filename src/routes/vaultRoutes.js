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

// CREATE & READ (Applies to all notes)
router.get('/', protect, getAllVaultEntries);
router.post('/', protect, validateVaultInput, createVaultEntry);

// UPDATE & DELETE (Requires a specific note ID in the URL)
router.put('/:id', protect, updateVaultEntry);
router.delete('/:id', protect, deleteVaultEntry);

module.exports = router;