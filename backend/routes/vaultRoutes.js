const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); 
const validateVaultInput = require('../middleware/validateVaultInput');
const upload = require('../middleware/uploadMiddleware');
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

router.route('/entries')
  .get(protect, getAllVaultEntries)
  .post(protect, upload.array('files', 10), validateVaultInput, createVaultEntry);

router.route('/:id')
  .get(protect, getVaultEntryById)
  .put(protect, upload.array('files', 10), validateVaultInput, updateVaultEntry)
  .delete(protect, deleteVaultEntry);

router.get('/:id/share-links', protect, getSharedLinks); // ✨ NEW: Fetch links
router.post('/:id/share-link', protect, createSharedLink);
router.post('/:id/request-approval', protect, requestVaultAccessApproval);
router.post('/:id/approve-access', protect, approveVaultAccessRequest);

router.get('/:id/attachments/:attachmentIndex/preview', protect, previewVaultAttachment);
router.get('/:id/attachments/:attachmentIndex/download', protect, downloadVaultAttachment);

module.exports = router;