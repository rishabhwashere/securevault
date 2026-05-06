const express = require('express');
const router = express.Router();
const {
  getSharedLinkInfo,
  verifySharedLinkPassword,
  downloadSharedDocument,
  previewSharedDocument
} = require('../controllers/sharedLinkController');
router.get('/:shareId', getSharedLinkInfo);
router.post('/:shareId/verify', verifySharedLinkPassword);
router.get('/:shareId/download', downloadSharedDocument);
router.get('/:shareId/preview', previewSharedDocument);

module.exports = router;