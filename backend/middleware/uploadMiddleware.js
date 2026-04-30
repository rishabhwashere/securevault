const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure an "uploads" folder exists in your backend root
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'vault-file-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize the upload middleware
const upload = multer({ storage: storage });

// Export the upload instance directly
module.exports = upload;
