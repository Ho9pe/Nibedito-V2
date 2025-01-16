const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { findWithID } = require('../services/findItem');
const { deleteImage } = require('../helper/deleteImage');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtActivationKey, clientURL } = require('../secret');
const { emailWithNodeMailer } = require('../helper/email');
const { cloudinary } = require('../config/cloudinary');

const getAllUsers = async (req, res, next) => {
    try {
        const search = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const searchRegExp = new RegExp('.*' + search + '.*', 'i');

        const filter = {
            $or: [
                {name: {$regex: searchRegExp}},
                {email: {$regex: searchRegExp}},
                {phone: {$regex: searchRegExp}},
            ],
        };
        const options = { password: 0 };

        const users = await User.find(filter, options)
                            .limit(limit)
                            .skip((page - 1) * limit);

        const totalUsers = await User.countDocuments(filter);

        if(users.length === 0) {
            throw createError(404, 'No users found');
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Users fetched successfully',
            payload: {
                totalUsers: totalUsers,
                users: users.map(user => ({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    address: user.address,
                    phone: user.phone,
                    isBanned: user.isBanned,
                    verificationStatus: user.verificationStatus
                })),
                pagination: {
                    totalPages: Math.ceil(totalUsers / limit),
                    currentPage: page,
                    previousPage: page > 1 ? page - 1 : null,
                    nextPage: page < Math.ceil(totalUsers / limit) ? page + 1 : null,
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

const updateUserInfo = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { name, address, currentPassword, newPassword, newEmail } = req.body;
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            throw createError(404, 'User not found');
        }
        // Update name if provided
        if (name) {
            user.name = name;
        }
        // Update address if provided
        if (address) {
            user.address = address;
        }
        // Handle password update
        if (currentPassword && newPassword) {
            const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordMatch) {
                throw createError(401, 'Current password is incorrect');
            }
            // Check if new password meets strength requirements
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
            if (!passwordRegex.test(newPassword)) {
                throw createError(400, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            }
            // Hash and set new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
        }  
        // Handle email update
        if (newEmail && newEmail !== user.email) {
            // Generate token for email verification
            const token = createJSONWebToken(
                { name: user.name, email: newEmail, userId: user._id },
                jwtActivationKey,
                '10m'
            );
            // Create email data
            const emailData = {
                email: newEmail,
                subject: 'Email Update Verification',
                html: `
                    <h2>Hello ${user.name}</h2>
                    <p>Please click here to verify your new email address: 
                    <a href="${clientURL}/verify-email?token=${token}">Verify Email</a>
                    </p>
                `
            };
            // Send verification email
            try {
                await emailWithNodeMailer(emailData);   
            } catch (emailError) {
                throw createError(500, 'Failed to send verification email');
            }
            // Store new email temporarily
            user.newEmail = newEmail;
        }
        // Save updated user
        await user.save();
        // Remove sensitive information
        user.password = undefined;
        return successResponse(res, {
            statusCode: 200,
            message: 'User information updated successfully',
            payload: { user }
        });
    } catch (error) {
        next(error);
    }
};

const updateUserProfilePicture = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!req.file) {
            throw createError(400, 'No file uploaded');
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        const profilePictureUrl = result.secure_url;
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilePicture: profilePictureUrl }, 
            { new: true }
        );
        if (!updatedUser) {
            throw createError(404, 'User not found');
        }
        updatedUser.password = undefined;
        return successResponse(res, {
            statusCode: 200,
            message: 'User profile picture updated successfully',
            payload: { user: updatedUser }
        });
    } catch (error) {
        next(error);
    }
};

//TODO: Admin only can update user info
const updateUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { name, email, phone, address, isBanned } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            throw createError(404, 'User not found');
        }

        // Update fields if provided and valid (validation already done by express-validator)
        if (name !== undefined) user.name = name;
        if (email !== undefined){
            user.email = email;
            user.verificationStatus.email = false;
        }
        if (phone !== undefined){
            user.phone = phone;
            user.verificationStatus.phone = false;
        }
        if (address !== undefined) user.address = address;
        if (isBanned !== undefined) user.isBanned = isBanned;

        await user.save();

        // Remove sensitive information
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
    getAllUsers, 
    getUserById, 
    deleteUserById, 
    updateUserInfo,
    updateUserProfilePicture,
    updateUserById
};
