const { check } = require('express-validator');

const validateAddToCart = [
    check('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID'),
    
    check('variantId')
        .notEmpty()
        .withMessage('Variant ID is required')
        .isMongoId()
        .withMessage('Invalid variant ID'),
    
    check('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer')
];

const validateUpdateCart = [
    check('itemId')
        .notEmpty()
        .withMessage('Item ID is required')
        .isMongoId()
        .withMessage('Invalid item ID'),
    
    check('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer')
];

const validateRemoveFromCart = [
    check('itemId')
        .notEmpty()
        .withMessage('Item ID is required')
        .isMongoId()
        .withMessage('Invalid item ID')
];

module.exports = {
    validateAddToCart,
    validateUpdateCart,
    validateRemoveFromCart
}; 