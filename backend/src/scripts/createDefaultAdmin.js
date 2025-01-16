const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const { mongodbURL, superAdminEmail, superAdminPassword, superAdminPhone } = require('../secret');

const defaultAdmins = [
    {
        name: 'Super Admin',
        email: superAdminEmail,
        password: superAdminPassword,
        phone: superAdminPhone,
        role: 'superadmin'
    },
    {
        name: 'Test Admin',
        email: 'admin@example.com',
        password: 'Admin@123',
        phone: '9876543210',
        role: 'admin'
    }
];

const createDefaultAdmins = async () => {
    try {
        await mongoose.connect(mongodbURL);
        console.log('Database connected for admin creation');

        // Clear all existing admins
        await Admin.deleteMany({});
        console.log('Cleared existing admins');

        // Create admins
        const createdAdmins = await Admin.create(defaultAdmins);
        console.log('Created admins:');
        createdAdmins.forEach(admin => {
            console.log(`- ${admin.role}: ${admin.email}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error creating admins:', error);
        process.exit(1);
    }
};

createDefaultAdmins();