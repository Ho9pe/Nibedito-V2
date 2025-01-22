const { check } = require('express-validator');

const validateCategory = [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3-100 characters'),
    
    check('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters')
];

module.exports = { validateCategory }; 