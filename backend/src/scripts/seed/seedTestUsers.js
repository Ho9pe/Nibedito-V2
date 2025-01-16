const mongoose = require('mongoose');
const User = require('../../models/userModel');
const { mongodbURL, defaultUserPassword } = require('../../secret');

const users = [
    {
        name: 'Verified User',
        email: 'verified@example.com',
        password: defaultUserPassword,
        phone: '9801234567',
        address: 'Test Address 1, City',
        verificationStatus: {
            email: true,
            phone: true
        }
    },
    {
        name: 'Unverified User',
        email: 'unverified@example.com',
        password: defaultUserPassword,
        phone: '9807654321',
        address: 'Test Address 2, City',
        verificationStatus: {
            email: false,
            phone: false
        }
    },
    {
        name: 'Banned User',
        email: 'banned@example.com',
        password: defaultUserPassword,
        phone: '9807654322',
        address: 'Test Address 3, City',
        verificationStatus: {
            email: true,
            phone: true
        },
        isBanned: true
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(mongodbURL);
        console.log('Database connected for seeding users');

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create new users
        const createdUsers = await User.create(users);
        console.log('Created users:');
        createdUsers.forEach(user => {
            console.log(`- ${user.name}: ${user.email} (${user.isBanned ? 'Banned' : 'Active'})`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();