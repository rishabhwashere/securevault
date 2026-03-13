const multer = require('multer');
const path = require('path');

// Configure how and where Multer saves the file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save it to our new 'uploads' folder
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    // Give the file a highly secure, unique name so users don't overwrite each other's files
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'vault-file-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize Multer with our storage rules
const upload = multer({ storage: storage });

module.exports = upload;