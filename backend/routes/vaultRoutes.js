const express = require('express');
const router = express.Router();

// ==========================================
// 1. IMPORTS & MIDDLEWARE
// ==========================================
const { protect } = require('../middleware/authMiddleware'); 
const validateVaultInput = require('../middleware/validateVaultInput');
const upload = require('../middleware/uploadMiddleware');

// ==========================================
// 2. CONTROLLERS
// ==========================================
const { createSharedLink, getSharedLinks } = require('../controllers/sharedLinkController');
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

// ==========================================
// 3. SPECIFIC ROUTES (Must go BEFORE dynamic /:id routes)
// ==========================================

// Matches EXACTLY /api/vault/entries
router.route('/entries')
  .get(protect, getAllVaultEntries)
  .post(protect, upload.array('files', 10), validateVaultInput, createVaultEntry);


// ==========================================
// 4. DYNAMIC ROUTES (Acts as a wildcard catching /api/vault/12345abcde)
// ==========================================

// Base ID Routes
router.route('/:id')
  .get(protect, getVaultEntryById)
  .put(protect, upload.array('files', 10), validateVaultInput, updateVaultEntry)
  .delete(protect, deleteVaultEntry);

// Access and Sharing Routes
router.get('/:id/share-links', protect, getSharedLinks); // ✨ NEW: Fetch links
router.post('/:id/share-link', protect, createSharedLink);
router.post('/:id/request-approval', protect, requestVaultAccessApproval);
router.post('/:id/approve-access', protect, approveVaultAccessRequest);

// Attachment Routes
router.get('/:id/attachments/:attachmentIndex/preview', protect, previewVaultAttachment);
router.get('/:id/attachments/:attachmentIndex/download', protect, downloadVaultAttachment);

module.exports = router;