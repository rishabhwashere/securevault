const multer = require('multer');
const cloudinary = require('cloudinary').v2; // We keep v2 here for logging in
const multerCloudinary = require('multer-storage-cloudinary');
require('dotenv').config();

// 1. Log in to Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Define the storage rules
const storageOptions = {
  cloudinary: require('cloudinary'), // <--- THE FIX! We hand it the base package, not .v2!
  params: {
    folder: 'vaultx_uploads', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'], 
    resource_type: 'auto' 
  },
};

// 3. The Bulletproof Check! 
let storage;
if (multerCloudinary.CloudinaryStorage) {
  storage = new multerCloudinary.CloudinaryStorage(storageOptions);
} else {
  storage = multerCloudinary(storageOptions);
}

// 4. Hand the engine to Multer
const upload = multer({ storage: storage });

module.exports = upload;