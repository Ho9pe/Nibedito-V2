const cloudinary = require('../config/cloudinary');
const createError = require('http-errors');

const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    try {
        const splitUrl = url.split('/');
        const filename = splitUrl[splitUrl.length - 1];
        return filename.split('.')[0];
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

const deleteImage = async (imageUrl, folder) => {
    try {
        const publicID = await getPublicIdFromUrl(imageUrl);
        const { result } = await cloudinary.uploader.destroy(`${folder}/${publicID}`);
        if (result !== 'ok') {
            throw createError(500, 'Failed to delete image from cloudinary');
        }
    } catch (error) {
        throw createError(500, 'Error deleting image from cloudinary');
    }
};

module.exports = {
    getPublicIdFromUrl,
    transformImageUrl,
    uploadImage,
    deleteImage
};
