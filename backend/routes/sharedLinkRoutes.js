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
router.get('/:shareId/preview', previewSharedDocument);
router.get('/:shareId/download', downloadSharedDocument);

module.exports = router;
