const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai-shop/products', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Allowed image formats
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // Resize images
  },
});

// Create multer upload middleware
const upload = multer({ storage: storage });

// Export both cloudinary instance and upload middleware
module.exports = {
  cloudinary,
  upload,
};