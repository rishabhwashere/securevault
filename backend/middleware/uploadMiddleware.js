const crypto = require('crypto');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const multerCloudinary = require('multer-storage-cloudinary');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


function createOpaquePublicId() {
  return crypto.randomBytes(18).toString('hex');
}

const storageOptions = {
  cloudinary: require('cloudinary'),
  params: (req, file, cb) => {
    cb(undefined, {
      folder: 'vaultx_uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'webp'],
      resource_type: 'auto',
      public_id: createOpaquePublicId(),
      use_filename: false,
      unique_filename: false
    });
  }
};

const createVaultEntry = async (req, res) => {
  try {
    const { title, data, category, tags, url, username, password, notes } = req.body;

    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      uploadedFiles = req.files.map((file) => file.secure_url || file.path);
    }

module.exports = upload;
