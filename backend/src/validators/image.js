const createError = require('http-errors');

const validateImage = (file) => {
    if (!file) {
        throw createError(400, 'Image is required');
    }
    
    if (file.size > 1024 * 1024 * 2) {
        throw createError(400, 'Image size should be less than 2MB');
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
        throw createError(400, 'Only .jpg, .png and .webp format allowed');
    }
};

module.exports = { validateImage }; 