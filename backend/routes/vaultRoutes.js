const express = require('express');
const router = express.Router();

const validateVaultInput = require('../middleware/validateVaultInput');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { createSharedLink } = require('../controllers/sharedLinkController');
const { 
  createVaultEntry, 
  getVaultEntryById,
  getAllVaultEntries,
  updateVaultEntry,
  deleteVaultEntry,
  requestVaultAccessApproval,
  approveVaultAccessRequest,
  previewVaultAttachment,
  downloadVaultAttachment
} = require('../controllers/vaultController');
console.log("Checking protect:", protect);
console.log("Checking getAllVaultEntries:", getAllVaultEntries);
router.get('/', protect, getAllVaultEntries);
router.get('/:id', protect, getVaultEntryById);
router.get('/:id/attachments/:attachmentIndex/preview', protect, previewVaultAttachment);
router.get('/:id/attachments/:attachmentIndex/download', protect, downloadVaultAttachment);
router.post('/:id/request-approval', protect, requestVaultAccessApproval);
router.post('/:id/approve-access', protect, approveVaultAccessRequest);
router.post('/', protect, upload.array('files', 10), validateVaultInput, createVaultEntry);
router.post('/:id/share-link', protect, createSharedLink);
router.put('/:id', protect, upload.array('files', 10), validateVaultInput, updateVaultEntry);
router.delete('/:id', protect, deleteVaultEntry);
module.exports = router;
