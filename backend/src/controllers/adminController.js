const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const { successResponse } = require('./responseController');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtAccessKey } = require('../secret');

const handleAdminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            throw createError(404, 'Admin not found');
        }

        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        if (!isPasswordMatch) {
            throw createError(401, 'Invalid credentials');
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        const adminInfo = {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        };

        const accessToken = createJSONWebToken(adminInfo, jwtAccessKey, '1h');

        res.cookie('accessToken', accessToken, {
            maxAge: 60 * 60 * 1000, // 1 hour
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return successResponse(res, {
            statusCode: 200,
            message: 'Admin logged in successfully',
            payload: { adminInfo }
        });
    } catch (error) {
        next(error);
    }
};

const handleAdminLogout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return successResponse(res, {
            statusCode: 200,
            message: 'Admin logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

const createAdmin = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        
        const adminExists = await Admin.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (adminExists) {
            throw createError(409, 'Admin already exists with this email or phone');
        }

        const newAdmin = new Admin({
            name,
            email,
            password,
            phone,
            role: 'admin' // default role
        });

        await newAdmin.save();
        
        return successResponse(res, {
            statusCode: 201,
            message: 'Admin created successfully'
        });
    } catch (error) {
        next(error);
    }
};

const getAllAdmins = async (req, res, next) => {
    try {
        const admins = await Admin.find({}, { password: 0 });
        return successResponse(res, {
            statusCode: 200,
            message: 'Admins retrieved successfully',
            payload: { admins }
        });
    } catch (error) {
        next(error);
    }
};

const deleteAdmin = async (req, res, next) => {
    try {
        const adminId = req.params.id;
        
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw createError(404, 'Admin not found');
        }

        if (admin.role === 'superadmin') {
            throw createError(403, 'Super admin cannot be deleted');
        }

        await Admin.findByIdAndDelete(adminId);
        
        return successResponse(res, {
            statusCode: 200,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

const banUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if (!user) {
            throw createError(404, 'User not found');
        }

        if (user.isBanned) {
            throw createError(400, 'User is already banned');
        }

        user.isBanned = true;
        await user.save();

        return successResponse(res, {
            statusCode: 200,
            message: 'User banned successfully'
        });
    } catch (error) {
        next(error);
    }
};

const unbanUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if (!user) {
            throw createError(404, 'User not found');
        }

        if (!user.isBanned) {
            throw createError(400, 'User is not banned');
        }

        user.isBanned = false;
        await user.save();

        return successResponse(res, {
            statusCode: 200,
            message: 'User unbanned successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleAdminLogin,
    handleAdminLogout,
    createAdmin,
    getAllAdmins,
    deleteAdmin,
    banUserById,
    unbanUserById
};