const express = require('express');
const router = express.Router();
const protect  = require('../middleware/authMiddleware'); // Need this to secure the route!
const upload = require('../middleware/uploadMiddleware');    // Your multer config

// @desc    Upload a file locally
// @route   POST /api/upload
router.post('/', protect, upload.single('document'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully!',
            filePath: req.file.path,
            fileName: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;