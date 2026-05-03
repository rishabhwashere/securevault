const express = require('express');
const router = express.Router();

// 1. ADD CURLY BRACES: This extracts the 'protect' function from the exported object
const { protect } = require('../middleware/authMiddleware'); 

// 2. Ensure your upload middleware is imported correctly
const upload = require('../middleware/uploadMiddleware');    

// 3. Keep your existing logic or use a controller function
router.post('/', protect, upload.single('document'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        // Use the Cloudinary or local path provided by your middleware
        const uploadedUrl = req.file.secure_url || req.file.path || req.file.url;

        if (!uploadedUrl) {
            return res.status(500).json({ success: false, message: 'Upload succeeded but no file URL was returned' });
        }

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully!',
            filePath: uploadedUrl,
            fileUrl: uploadedUrl,
            fileName: req.file.filename || req.file.originalname
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;