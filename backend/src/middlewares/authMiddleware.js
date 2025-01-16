const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const { jwtAccessKey } = require('../secret');
const Admin = require('../models/adminModel');

const isLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw createError(401, 'You are not logged in');
        }
        const decoded = jwt.verify(token, jwtAccessKey);
        req.user = {
            _id: decoded._id,
            name: decoded.name,
            email: decoded.email,
            profilePicture: decoded.profilePicture,
            isBanned: decoded.isBanned,
            verificationStatus: decoded.verificationStatus
        };
        next();
    } catch (error) {
        next(error);
    }
};

const isOwner = (req, res, next) => {
    try {
        const userId = req.params.id;
        const loggedInUserId = req.user._id;
        if (userId !== loggedInUserId.toString()) {
            throw createError(403, 'Not authorized, You can only access your own data');
        }
        next();
    } catch (error) {
        next(error);
    }
};

const isLoggedOut = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (token) {
            try {
                const decoded = jwt.verify(token, jwtAccessKey);
                if (decoded) {
                    throw createError(401, 'You are already logged in');
                }
            } catch (error) {
                next(error);
            }
        }
        else {
            next();
        }
    } catch (error) {
        next(error);
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw createError(401, 'Access denied. No token provided');
        }
        const decoded = jwt.verify(token, jwtAccessKey);
        const admin = await Admin.findOne({ 
            _id: decoded._id,
            email: decoded.email 
        });
        if (!admin) {
            throw createError(403, 'Access denied. Admin privileges required');
        }
        // Add admin info to request object
        req.admin = {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        };
        next();
    } catch (error) {
        next(error);
    }
};

const isSuperAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw createError(401, 'Access denied. No token provided');
        }
        const decoded = jwt.verify(token, jwtAccessKey);
        const admin = await Admin.findOne({ 
            _id: decoded._id, 
            email: decoded.email 
        });
        if (!admin || admin.role !== 'superadmin') {
            throw createError(403, 'Access denied. Super admin privileges required');
        }
        next();
    } catch (error) {
        next(error);
    }
};

const isAdminLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw createError(401, 'Admin not logged in');
        }
        const decoded = jwt.verify(token, jwtAccessKey);
        const admin = await Admin.findOne({ 
            _id: decoded._id,
            email: decoded.email 
        });
        if (!admin) {
            throw createError(403, 'Admin not found');
        }
        req.admin = {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        };
        next();
    } catch (error) {
        next(error);
    }
};

const isAdminLoggedOut = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (token) {
            const decoded = jwt.verify(token, jwtAccessKey);
            const admin = await Admin.findOne({ 
                _id: decoded._id,
                email: decoded.email 
            });
            if (admin) {
                throw createError(400, 'Admin already logged in');
            }
        }
        next();
    } catch (error) {
        next(error);
    }
};



module.exports = { 
    isLoggedIn, 
    isOwner, 
    isLoggedOut, 
    isAdmin, 
    isSuperAdmin,
    isAdminLoggedIn,
    isAdminLoggedOut
};