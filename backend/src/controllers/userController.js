const createError = require('http-errors');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { findWithID } = require('../services/findItem');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtActivationKey, clientURL } = require('../secret');
const { emailWithNodeMailer } = require('../helper/email');
const { cloudinary } = require('../config/cloudinary');

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

const updateUserInfo = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { name, currentPassword, newPassword, newEmail, phone } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            throw createError(404, 'User not found');
        }

        // Update basic info
        if (name) user.name = name;
        if (phone) {
            user.phone = phone;
            user.verificationStatus.phone = false;  // Reset phone verification status
        }
        
        // Handle password update
        if (currentPassword && newPassword) {
            const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordMatch) {
                throw createError(401, 'Current password is incorrect');
            }
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
            if (!passwordRegex.test(newPassword)) {
                throw createError(400, 'Password must meet security requirements');
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Handle email update
        if (newEmail && newEmail !== user.email) {
            const token = createJSONWebToken(
                { name: user.name, email: newEmail, userId: user._id },
                jwtActivationKey,
                '10m'
            );
            
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
            
            try {
                await emailWithNodeMailer(emailData);   
            } catch (emailError) {
                throw createError(500, 'Failed to send verification email');
            }
            user.newEmail = newEmail;
        }

        await user.save();
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

const addUserAddress = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const addressData = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            throw createError(404, 'User not found');
        }

        if (user.addresses.length >= 5) {
            throw createError(400, 'Maximum number of addresses (5) reached');
        }

        // If this is the first address or isDefault is true
        if (addressData.isDefault || user.addresses.length === 0) {
            user.addresses.forEach(addr => addr.isDefault = false);
            addressData.isDefault = true;
        }

        user.addresses.push(addressData);
        await user.save();

        return successResponse(res, {
            statusCode: 200,
            message: 'Address added successfully',
            payload: { user }
        });
    } catch (error) {
        next(error);
    }
};

const updateUserAddress = async (req, res, next) => {
    try {
        const { id: userId, addressId } = req.params;
        const addressData = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            throw createError(404, 'User not found');
        }

        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            throw createError(404, 'Address not found');
        }

        // If setting as default, update other addresses
        if (addressData.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        // Update the address while preserving existing fields
        user.addresses[addressIndex] = {
            ...user.addresses[addressIndex].toObject(),
            ...addressData
        };

        await user.save();

        return successResponse(res, {
            statusCode: 200,
            message: 'Address updated successfully',
            payload: { user }
        });
    } catch (error) {
        next(error);
    }
};

const deleteUserAddress = async (req, res, next) => {
    try {
        const { id: userId, addressId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            throw createError(404, 'User not found');
        }

        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            throw createError(404, 'Address not found');
        }

        // If deleting default address, make another address default
        if (user.addresses[addressIndex].isDefault && user.addresses.length > 1) {
            const newDefaultIndex = addressIndex === 0 ? 1 : 0;
            user.addresses[newDefaultIndex].isDefault = true;
        }

        user.addresses.splice(addressIndex, 1);
        await user.save();

        return successResponse(res, {
            statusCode: 200,
            message: 'Address deleted successfully',
            payload: { user }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    getUserById, 
    updateUserInfo,
    updateUserProfilePicture,
    updateUserAddress,
    deleteUserAddress,
    addUserAddress
};