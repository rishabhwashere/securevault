const express = require('express');
const router = express.Router();

const validateVaultInput = require('../middleware/validateVaultInput');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { 
  createVaultEntry, 
  getVaultEntryById,
  getAllVaultEntries, 
  updateVaultEntry, 
  deleteVaultEntry 
} = require('../controllers/vaultController');

router.get('/', protect, getAllVaultEntries);
router.get('/:id', protect, getVaultEntryById);
router.post('/', protect, upload.array('files', 10), validateVaultInput, createVaultEntry);
router.put('/:id', protect, upload.array('files', 10), updateVaultEntry);
router.delete('/:id', protect, deleteVaultEntry);
module.exports = router;
