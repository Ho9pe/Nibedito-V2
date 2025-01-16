const { body } = require('express-validator');

const registerValidator = [
    body('name')
        .isLength({ min: 3, max: 30 })
        .withMessage('Name must be between 3 and 30 characters'),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('phone')
        .matches(/^\d{10}$/)
        .withMessage('Phone number must be 10 digits'),
    body('address')
        .notEmpty()
        .withMessage('Address is required')
];

const loginValidator = [
    body('emailOrPhone')
        .notEmpty()
        .withMessage('Email or phone number is required')
        .custom((value) => {
            const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            const isPhone = /^\d{10}$/.test(value);
            if (!isEmail && !isPhone) {
                throw new Error('Invalid email or phone number format');
            }
            return true;
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const updateUserValidator = [
    body('name')
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage('Name must be between 3 and 30 characters'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email address'),
    body('phone')
        .optional()
        .matches(/^\d{10}$/)
        .withMessage('Phone number must be 10 digits'),
    body('address')
        .optional()
        .notEmpty()
        .withMessage('Address cannot be empty if provided'),
    body('isBanned')
        .optional()
        .isBoolean()
        .withMessage('isBanned must be a boolean')
];

const forgotPasswordValidator = [
    body('emailOrPhone')
        .notEmpty()
        .withMessage('Email or phone number is required')
        .custom((value) => {
            const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            const isPhone = /^\d{10}$/.test(value);
            if (!isEmail && !isPhone) {
                throw new Error('Invalid email or phone number format');
            }
            return true;
        }),
];

const resetPasswordValidator = [
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('token')
        .notEmpty()
        .withMessage('Token is required')
];

module.exports = { 
    registerValidator, 
    loginValidator, 
    updateUserValidator, 
    forgotPasswordValidator,
    resetPasswordValidator
};