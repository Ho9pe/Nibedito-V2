const { validationResult } = require('express-validator');
const createError = require('http-errors');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return next(createError(400, errorMessages.join(', ')));
    }
    next();
};

module.exports = { validateRequest };