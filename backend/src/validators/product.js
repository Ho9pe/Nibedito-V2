const { check } = require('express-validator');

const validateProduct = [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 3, max: 300 })
        .withMessage('Product name must be between 3-300 characters'),
    
    check('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters'),
    
    check('price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
    
    check('category')
        .notEmpty()
        .withMessage('Category is required')
        .isMongoId()
        .withMessage('Invalid category ID'),

    check('variants')
        .optional()
        .custom((value) => {
            try {
                const variants = JSON.parse(value);
                if (!Array.isArray(variants)) throw new Error('Variants must be an array');
                
                variants.forEach(variant => {
                    if (!variant.color) throw new Error('Variant color is required');
                    if (!variant.size) throw new Error('Variant size is required');
                    if (!variant.quantity || variant.quantity < 0) throw new Error('Valid quantity is required');
                });
                return true;
            } catch (error) {
                throw new Error(error.message);
            }
        }),
    
    check('shipping')
        .optional()
        .isBoolean()
        .withMessage('Shipping must be an object')
];

module.exports = { validateProduct }; 