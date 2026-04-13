const multer = require('multer');
const cloudinary = require('cloudinary').v2; 
const multerCloudinary = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storageOptions = {
  cloudinary: require('cloudinary'),
  params: {
    folder: 'vaultx_uploads', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf','webp'], 
    resource_type: 'auto' 
  },
};

let storage;
if (multerCloudinary.CloudinaryStorage) {
  storage = new multerCloudinary.CloudinaryStorage(storageOptions);
} else {
  storage = multerCloudinary(storageOptions);
}

const upload = multer({ storage: storage });

module.exports = upload;