const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const { successResponse } = require('./responseController');
const { jwtAccessKey, jwtRefreshKey } = require('../secret');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { clientURL } = require('../secret');
const { emailWithNodeMailer } = require('../helper/email');
const { jwtActivationKey } = require('../secret');


const handleLogin = async (req, res, next) => {
    try {
        const { emailOrPhone, password } = req.body;
        const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailOrPhone);
        const isPhone = /^\d{10}$/.test(emailOrPhone);
        let user;
        if (isEmail) {
            user = await User.findOne({ email: emailOrPhone });
        } else if (isPhone) {
            user = await User.findOne({ phone: emailOrPhone });
        } else {
            throw createError(400, 'Invalid email or phone number format');
        }
        if (!user) {
            throw createError(404, 'User not found. Please register.');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw createError(401, 'Email/Phone or password did not match');
        }
        if (user.isBanned) {
            throw createError(403, 'You are banned. Please contact support.');
        }
        const userInfo = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            addresses: user.addresses,
            profilePicture: user.profilePicture,
            isBanned: user.isBanned,
            verificationStatus: user.verificationStatus
        };
        
        const accessToken = createJSONWebToken(
            userInfo,
            jwtAccessKey,
            '15m'
        );
        const refreshToken = createJSONWebToken(
            userInfo,
            jwtRefreshKey,
            '7d'
        );

        res.cookie('accessToken', accessToken, {
            maxAge: 15 * 60 * 1000, // 15 minutes
            httpOnly: true,
            secure: false, // Set to true when in HTTPS
            sameSite: 'strict'
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: false, // Set to true when in HTTPS
            sameSite: 'strict'
        });

        console.log('User logged in successfully', userInfo);
        return successResponse(res, {
            statusCode: 200,
            message: 'User logged in successfully',
            payload: { user: userInfo }
        });
    } catch (error) {
        console.error('Error in handleLogin:', error);
        next(error);
    }
};

const handleLogout = async (req, res, next) => {
    try {
        // Clear the cookies regardless of their current contents
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: false, // Set to true when using HTTPS
            sameSite: 'strict'
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false, // Set to true when using HTTPS
            sameSite: 'strict'
        });
        console.log('User logged out successfully', req.user);
        return successResponse(res, {
            statusCode: 200,
            message: 'User logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { emailOrPhone } = req.body;
        if (!emailOrPhone) {
            throw createError(400, 'Email or phone number is required');
        }
        
        let user;
        const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailOrPhone);
        const isPhone = /^\d{10}$/.test(emailOrPhone);

        if (isEmail) {
            user = await User.findOne({ email: emailOrPhone });
        } else if (isPhone) {
            user = await User.findOne({ phone: emailOrPhone });
        } else {
            throw createError(400, 'Invalid email or phone number format');
        }

        if (!user) {
            throw createError(404, 'User not found with this email or phone number');
        }

        const token = createJSONWebToken({ id: user._id }, jwtActivationKey, '10m');
        const resetURL = `${clientURL}/reset-password?token=${token}`;
        console.log('Reset URL:', resetURL);
        if (isEmail) {
            const emailData = {
                email: user.email,
                subject: 'Password Reset Link',
                html: `
                    <h2>Hello ${user.name}</h2>
                    <p>Please click on the following link to reset your password:</p>
                    <p><a href="${resetURL}">${resetURL}</a></p>
                    <p>This link will expire in 10 minutes.</p>
                `
            };
            try {
                await emailWithNodeMailer(emailData);
                console.log('Password reset email sent successfully');
            } catch (emailError) {
                console.error('Error sending password reset email:', emailError);
                throw createError(500, `Failed to send password reset email: ${emailError.message}`);
            }
        } else if (isPhone) {
            // Implement SMS logic here if needed
            console.log(`SMS would be sent to ${user.phone} with reset URL: ${resetURL}`);
        } else {
            throw createError(400, 'Invalid email or phone number format');
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please check your ${isEmail ? 'email' : 'phone'} for password reset instructions`,
        });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            throw createError(400, 'Token and new password are required');
        }
        let decoded;
        try {
            decoded = jwt.verify(token, jwtActivationKey);
        } catch (jwtError) {
            throw createError(401, 'Invalid or expired token');
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            throw createError(404, 'User not found');
        }
        user.password = newPassword;
        await user.save();
        return successResponse(res, {
            statusCode: 200,
            message: 'Password has been reset successfully',
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        next(error);
    }
};

const handleRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw createError(401, 'No refresh token found');
        }
        const decoded = jwt.verify(refreshToken, jwtRefreshKey);
        const user = await User.findById(decoded._id).select('-password');
        if (!user) {
            throw createError(401, 'No user found with this token');
        }
        // Generate new access token
        const accessToken = createJSONWebToken(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                isBanned: user.isBanned,
                verificationStatus: user.verificationStatus
            },
            jwtAccessKey,
            '15m'
        );
        // Set the new access token as a cookie
        res.cookie('accessToken', accessToken, {
            maxAge: 15 * 60 * 1000, // 15 minutes
            httpOnly: true,
            secure: false, // Set to true when in HTTPS
            sameSite: 'strict'
        });
        return successResponse(res, {
            statusCode: 200,
            message: 'New access token generated successfully',
            payload: { accessToken }
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(createError(401, 'Invalid refresh token'));
        }
        if (error.name === 'TokenExpiredError') {
            return next(createError(401, 'Refresh token has expired'));
        }
        next(error);
    }
};

const processRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;
        if (!name || !email || !password || !phone || !address) {
            throw createError(400, 'All fields are required');
        }

        // Validate address fields
        if (!address.street || !address.city || !address.state || !address.postalCode) {
            throw createError(400, 'All address fields are required');
        }

        // Check if user already exists with this email or phone
        const userExists = await User.findOne({ 
            $or: [
                { email, 'verificationStatus.email': true }, 
                { phone, 'verificationStatus.phone': true }
            ] 
        });

        if (userExists) {
            if (userExists.email === email) {
                throw createError(409, 'User already exists with this email, please login');
            } else {
                throw createError(409, 'User already exists with this phone number');
            }
        }

        // Create and save unverified user
        const newUser = new User({ 
            name, 
            email, 
            password, 
            phone,
            addresses: [{
                ...address,
                isDefault: true
            }],
            verificationStatus: {
                email: false,
                phone: false
            }
        });

        try {
            await newUser.validate();
            await newUser.save();
        } catch (validationError) {
            const errors = Object.values(validationError.errors).map(err => err.message);
            return next(createError(400, errors.join(', ')));
        }

        // Create jsonwebtoken
        const token = createJSONWebToken({ 
            userId: newUser._id,
            email: email
        }, jwtActivationKey, '10m');

        // Prepare email with activation link
        const emailData = {
            email,
            subject: 'Account Activation Email',
            html: `
                <h1>Hello ${name}!</h1>
                <h1>Welcome to our website</h1>
                <p>
                    Please click on the link below to activate your account.<br>
                    <a target="_blank" href="${clientURL}/activate-account?token=${token}">
                        Activate Account
                    </a>
                </p>
            `
        };
        // Send email
        try {
            await emailWithNodeMailer(emailData);
        } catch (emailError) {
            await User.findByIdAndDelete(newUser._id);
            return next(createError(500, 'Error in sending email'));
        }
        return successResponse(res, {
            statusCode: 200,
            message: `Verification Required, an email has been sent to ${email}`,
        });
    } catch (error) {
        next(error);
    }
};

const activeUserAccount = async (req, res, next) => {
    try{
        const token = req.body.token;
        if(!token){throw createError(400, 'Token is required');}

        let decodedToken;
        try{
            decodedToken = jwt.verify(token, jwtActivationKey);
        } catch(jwtError) {
            if(jwtError.name === 'TokenExpiredError') {
                throw createError(401, 'Token expired, please register again');
            } else if (jwtError.name === 'JsonWebTokenError') {
                throw createError(400, 'Invalid token');
            } else {
                throw jwtError;
            }
        }
        const user = await User.findOne({ 
            _id: decodedToken.userId,
            email: decodedToken.email,
            'verificationStatus.email': false
        });

        if (!user) {
            throw createError(404, 'Invalid activation link or account already verified');
        }

        user.verificationStatus.email = true;
        await user.save();

        return successResponse(res, {
            statusCode: 200,
            message: 'Account activated successfully. You can now login.',
        });
    } catch (error) {
        next(error);
    }
};

const verifyNewEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) throw createError(400, 'Token is required');

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, jwtActivationKey);
        } catch (error) {
            throw createError(401, 'Invalid or expired token');
        }

        const user = await User.findById(decodedToken.userId);
        if (!user) throw createError(404, 'User not found');

        if (user.newEmail !== decodedToken.email) {
            throw createError(400, 'Email verification failed');
        }

        user.email = user.newEmail;
        user.newEmail = undefined;
        await user.save();

        return successResponse(res, {
            statusCode: 200,
            message: 'Email updated successfully',
        });
    } catch (error) {
        next(error);
    }
};

const resendVerification = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) throw createError(400, 'Email is required');

        // Find user by email, but don't check isVerified status yet
        const user = await User.findOne({ email });
        if (!user) throw createError(404, 'User not found');

        if (user.verificationStatus.email) {
            throw createError(400, 'User is already verified');
        }

        // Create activation token
        const token = createJSONWebToken({ 
            userId: user._id,
            email: user.email
        }, jwtActivationKey, '10m');

        // Prepare email data
        const emailData = {
            email,
            subject: 'Account Activation Email',
            html: `
                <h1>Hello ${user.name}!</h1>
                <h1>Welcome to our website</h1>
                <p>
                    Please click on the link below to activate your account.<br>
                    <a target="_blank" href="${clientURL}/activate-account?token=${token}">
                        Activate Account
                    </a>
                </p>
            `
        };

        try {
            await emailWithNodeMailer(emailData);
        } catch (emailError) {
            return next(createError(500, 'Error in sending verification email'));
        }

        return successResponse(res, {
            statusCode: 200,
            message: `A new verification email has been sent to ${email}`
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    handleLogin, 
    handleLogout, 
    forgotPassword, 
    resetPassword,
    handleRefreshToken,
    processRegister,
    activeUserAccount,
    verifyNewEmail,
    resendVerification
};