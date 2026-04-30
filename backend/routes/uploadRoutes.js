const express = require('express');
const router = express.Router();
const protect  = require('../middleware/authMiddleware'); 
const upload = require('../middleware/uploadMiddleware');    

router.post('/', protect, upload.single('document'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

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
