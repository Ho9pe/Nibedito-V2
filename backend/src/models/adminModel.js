const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new Schema({
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
        unique: true,
        trim: true,
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
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin'],
        default: 'admin'
    },
    lastLogin: {
        type: Date
    }
}, { timestamps: true });

adminSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
        if (!passwordRegex.test(this.password)) {
            next(new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)'));
        }
    }
    next();
});

adminSchema.methods.isSuperAdmin = function() {
    return this.role === 'superadmin';
};

adminSchema.index({ role: 1 });

const Admin = model('Admin', adminSchema);
module.exports = Admin;