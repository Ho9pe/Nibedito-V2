const createError = require('http-errors');
const { cloudinary } = require('../config/cloudinary');

const getPublicIdFromUrl = (imageUrl) => {
    try {
        if (!imageUrl) return null;
        
        // Extract everything after '/upload/'
        const matches = imageUrl.match(/upload\/(.+)/);
        if (!matches || !matches[1]) {
            throw new Error('Invalid image URL format');
        }
        
        // Get the full path including folder structure but remove file extension
        const fullPath = matches[1].split('.')[0];
        
        // For URLs like: .../upload/nibedito/categories/categories-1738158607667-995553041.jpg
        // This will return: nibedito/categories/categories-1738158607667-995553041
        return fullPath;
    } catch (error) {
        console.error('Error extracting public ID:', error);
        return null;
    }
};

const transformImageUrl = (url, options = {}) => {
    if (!url || !url.includes('cloudinary')) return url;
    
    const [baseUrl, imagePath] = url.split('/upload/');
    const transformations = [];
    
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    
    return transformations.length > 0
        ? `${baseUrl}/upload/${transformations.join(',')}/`
        : url;
};

const uploadImage = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, { folder });
        return result.secure_url;
    } catch (error) {
        throw createError(500, 'Error uploading image to cloudinary');
    }
};

const deleteImage = async (imageUrl) => {
    try {
        if (!imageUrl) return;
        
        // Extract the public ID including the folder path
        const matches = imageUrl.match(/upload\/v\d+\/(.+?)\./);
        if (!matches || !matches[1]) {
            throw new Error('Invalid image URL format');
        }
        
        const publicId = matches[1]; // This will include the folder path
        console.log('Attempting to delete image with public ID:', publicId);
        
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result !== 'ok') {
            console.error('Cloudinary delete result:', result);
            throw new Error('Failed to delete image from cloudinary');
        }
        
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw createError(500, 'Error deleting image from cloudinary');
    }
};

module.exports = {
    getPublicIdFromUrl,
    transformImageUrl,
    uploadImage,
    deleteImage
};
