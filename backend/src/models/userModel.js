const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const { defaultPicture } = require('../secret');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name can\'t be less than 3 characters'],
        maxlength: [30, 'Name can\'t be more than 30 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        validate: {
            validator: function(v) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/.test(v);
            },
            message: props => `Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)`
        },
    },
    profilePicture: {
        type: String,
        default: defaultPicture,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    verificationStatus: {
        email: { type: Boolean, default: false },
        phone: { type: Boolean, default: false }
    }
}, { timestamps: true });

// Add the same password hashing pre-save hook as before
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = model('User', userSchema);
module.exports = User;