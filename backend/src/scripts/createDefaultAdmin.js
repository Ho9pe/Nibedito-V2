const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminModel');
const { mongodbURL, superAdminEmail, superAdminPassword, superAdminPhone } = require('../secret');

const createDefaultAdmins = async () => {
    try {
        await mongoose.connect(mongodbURL);
        console.log('Database connected for admin creation');

        // Clear all existing admins
        await Admin.deleteMany({});
        console.log('Cleared existing admins');

        // Hash password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(superAdminPassword, salt);
        
        console.log('Creating admin with:', {
            email: superAdminEmail,
            phone: superAdminPhone,
            originalPassword: superAdminPassword,
            hashedPassword: hashedPassword
        });

        const defaultAdmin = {
            name: 'Super Admin',
            email: superAdminEmail,
            password: hashedPassword,
            phone: superAdminPhone,
            role: 'superadmin'
        };

        // Create admin
        const createdAdmin = await Admin.create(defaultAdmin);
        console.log('Created admin:', {
            email: createdAdmin.email,
            role: createdAdmin.role,
            id: createdAdmin._id
        });

        // Verify the password can be compared
        const isMatch = await bcrypt.compare(superAdminPassword, createdAdmin.password);
        console.log('Verification test:', {
            originalPassword: superAdminPassword,
            hashedPassword: createdAdmin.password,
            isMatch: isMatch
        });

        await mongoose.disconnect();
        console.log('Database disconnected');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createDefaultAdmins();