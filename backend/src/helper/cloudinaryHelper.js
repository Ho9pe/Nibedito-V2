const createError = require('http-errors');
const { cloudinary } = require('../config/cloudinary');

const getPublicIdFromUrl = (url) => {
    try {
        if (!url) return null;
        const matches = url.match(/upload\/v\d+\/(.+?)\./);
        return matches ? matches[1] : null;
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

const uploadImage = async (file, type, identifier) => {
    try {
        let folder;
        let publicId;

        switch (type) {
            case 'profile':
                folder = 'nibedito/profiles';
                publicId = `profiles-${identifier}`;
                break;
            case 'category':
                folder = 'nibedito/categories';
                publicId = `categories-${identifier}`;
                break;
            case 'product-thumbnail':
                folder = 'nibedito/products/thumbnails';
                publicId = `thumbnails-${identifier}`;
                break;
            case 'product-variant':
                folder = 'nibedito/products/variants';
                publicId = `variants-${identifier}`;
                break;
            default:
                throw new Error('Invalid image type');
        }

        const result = await cloudinary.uploader.upload(file.path, {
            folder,
            public_id: publicId,
            overwrite: true
        });
        return result.secure_url;
    } catch (error) {
        throw createError(500, 'Error uploading image to cloudinary');
    }
};

const deleteImage = async (url) => {
    try {
        if (!url) return;
        
        // Get public ID from URL
        const publicId = getPublicIdFromUrl(url);
        if (!publicId) {
            throw new Error('Invalid image URL format');
        }
        
        console.log('Attempting to delete image with public ID:', publicId);
        
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result !== 'ok') {
            console.error('Cloudinary delete result:', result);
            throw new Error('Failed to delete image from cloudinary');
        }
        
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        // Don't throw error, just log it and continue
        return null;
    }
};

module.exports = {
    getPublicIdFromUrl,
    transformImageUrl,
    uploadImage,
    deleteImage
};
