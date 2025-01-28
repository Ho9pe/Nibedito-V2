const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret } = require('../secret');

// Configure Cloudinary
cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret
});

// Create storage engine factory
const createStorage = (folder) => {
    return new CloudinaryStorage({
        cloudinary,
        params: {
            folder: `nibedito/${folder}`,
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
            transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
            public_id: (req, file) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                return `${folder}-${uniqueSuffix}`;
            }
        }
    });
};

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'), false);
    }
};

// Create upload middleware
const createUploader = (folder, fileSize = 5) => {
    return multer({
        storage: createStorage(folder),
        fileFilter,
        limits: { fileSize: fileSize * 1024 * 1024 }
    });
};

// Export configured uploaders
module.exports = {
    cloudinary,
    uploadProduct: createUploader('products'),
    uploadCategory: createUploader('categories'),
    uploadProfile: createUploader('profiles', 2), // 2MB limit for profiles
    deleteImage: async (publicId) => {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            return false;
        }
    }
};