const express = require('express');
const router = express.Router();
const { 
  getNominee, saveNominee, removeNominee, 
  triggerNomineeAccessAlert, approveAccess, denyAccess, checkAccessStatus 
} = require('../controllers/nomineeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request-access', triggerNomineeAccessAlert); 
router.get('/status/:ownerId', checkAccessStatus);         
router.get('/approve/:token', approveAccess); 
router.get('/deny/:token', denyAccess);       
router.use(protect);
router.get('/', getNominee);
router.post('/', saveNominee);
router.delete('/', removeNominee);

module.exports = router;