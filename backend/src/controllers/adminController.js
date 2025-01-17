const createError = require('http-errors');
const bcrypt = require('bcryptjs');

const { deleteImage } = require('../helper/deleteImage');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const { successResponse } = require('./responseController');
const { findWithID } = require('../services/findItem');
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
            phone: admin.phone,
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
        const { name, email, password, phone, role } = req.body;
        
        const adminExists = await Admin.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (adminExists) {
            throw createError(409, 'Admin already exists with this email or phone');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'admin'
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

const getUserStats = async (req, res, next) => {
    try {
        const stats = await User.aggregate([
            {
                $facet: {
                    // Basic user counts
                    'overview': [
                        {
                            $group: {
                                _id: null,
                                totalUsers: { $sum: 1 },
                                activeUsers: {
                                    $sum: { $cond: [{ $eq: ["$isBanned", false] }, 1, 0] }
                                },
                                bannedUsers: {
                                    $sum: { $cond: [{ $eq: ["$isBanned", true] }, 1, 0] }
                                }
                            }
                        }
                    ],
                    // Recent registrations (last 7 days)
                    'recentRegistrations': [
                        {
                            $match: {
                                createdAt: { 
                                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
                                }
                            }
                        },
                        { $count: 'count' }
                    ],
                    // Verification stats
                    'verificationStats': [
                        {
                            $group: {
                                _id: null,
                                emailVerified: {
                                    $sum: { $cond: [{ $eq: ["$verificationStatus.email", true] }, 1, 0] }
                                },
                                phoneVerified: {
                                    $sum: { $cond: [{ $eq: ["$verificationStatus.phone", true] }, 1, 0] }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        const formattedStats = {
            totalUsers: stats[0].overview[0]?.totalUsers || 0,
            activeUsers: stats[0].overview[0]?.activeUsers || 0,
            bannedUsers: stats[0].overview[0]?.bannedUsers || 0,
            recentRegistrations: stats[0].recentRegistrations[0]?.count || 0,
            verificationStats: {
                emailVerified: stats[0].verificationStats[0]?.emailVerified || 0,
                phoneVerified: stats[0].verificationStats[0]?.phoneVerified || 0
            }
        };

        return successResponse(res, {
            statusCode: 200,
            message: 'User statistics retrieved successfully',
            payload: formattedStats
        });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order || 'desc';
        const filter = req.query.filter || 'all'; // all, active, banned

        const searchRegex = new RegExp(search, 'i');
        const query = {
            $or: [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex }
            ]
        };

        // Apply filter
        if (filter === 'active') {
            query.isBanned = false;
        } else if (filter === 'banned') {
            query.isBanned = true;
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await User.countDocuments(query);

        return successResponse(res, {
            statusCode: 200,
            message: 'Users retrieved successfully',
            payload: {
                users,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    page,
                    limit
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithID(User, id, options);
        if (!user) {
            throw createError(404, 'User not found');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'User fetched successfully',
            payload: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithID(User, id, options);

        const userImagePath = user.profilePicture;
        if(userImagePath){
            deleteImage(userImagePath);
        }
        /*
        if (user.profilePicture !== defaultPicture) {
            await cloudinary.uploader.destroy(user.profilePicture);
        }
        */
        await User.findByIdAndDelete(id);

        return successResponse(res, {
            statusCode: 200,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

const updateUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { name, email, phone, isBanned } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            throw createError(404, 'User not found');
        }

        if (name) user.name = name;
        if (email) {
            user.email = email;
            user.verificationStatus.email = false;
        }
        if (phone) {
            user.phone = phone;
            user.verificationStatus.phone = false;
        }
        if (isBanned !== undefined) user.isBanned = isBanned;

        await user.save();
        user.password = undefined;

        return successResponse(res, {
            statusCode: 200,
            message: 'User updated successfully',
            payload: { user }
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    // Admin authentication
    handleAdminLogin,
    handleAdminLogout,
    // Admin management
    createAdmin,
    getAllAdmins,
    deleteAdmin,
    // User management
    getAllUsers,
    getUserById,
    getUserStats,
    updateUserById,
    deleteUserById,
    banUserById,
    unbanUserById
};