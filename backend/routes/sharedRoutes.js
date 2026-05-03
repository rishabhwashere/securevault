const express = require('express');
const router = express.Router();
const {
  getSharedLinkInfo,
  verifySharedLinkPassword,
  downloadSharedDocument,
  previewSharedDocument
} = require('../controllers/sharedLinkController');

// ==========================================
// PUBLIC ROUTES (No 'protect' middleware)
// ==========================================

// 1. Get basic info about the link (e.g., file type)
router.get('/:shareId', getSharedLinkInfo);

// 2. Verify the password and get a temporary download token
router.post('/:shareId/verify', verifySharedLinkPassword);

// 3. Download the actual file
router.get('/:shareId/download', downloadSharedDocument);

// 4. Preview the image inline
router.get('/:shareId/preview', previewSharedDocument);

module.exports = router;