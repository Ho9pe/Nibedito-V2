const mongoose = require('mongoose');
const User = require('../../models/userModel');
const { mongodbURL, defaultUserPassword } = require('../../secret');

const users = [
    {
        name: 'Verified User',
        email: 'verified@example.com',
        password: defaultUserPassword,
        phone: '9801234567',
        addresses: [
            {
                street: 'Test Street 1',
                city: 'Test City',
                state: 'Test State',
                postalCode: '12345',
                isDefault: true
            },
            {
                street: 'Test Street 1B',
                city: 'Another City',
                state: 'Another State',
                postalCode: '54321',
                isDefault: false
            },
            {
                street: 'Test Street 1C',
                city: 'Third City',
                state: 'Third State',
                postalCode: '98765',
                isDefault: false
            }
        ],
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
        addresses: [
            {
                street: 'Test Street 2',
                city: 'Test City',
                state: 'Test State',
                postalCode: '12345',
                isDefault: true
            },
            {
                street: 'Test Street 2B',
                city: 'Second City',
                state: 'Second State',
                postalCode: '67890',
                isDefault: false
            }
        ],
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
        addresses: [
            {
                street: 'Test Street 3',
                city: 'Test City',
                state: 'Test State',
                postalCode: '12345',
                isDefault: true
            },
            {
                street: 'Test Street 3B',
                city: 'Ban City',
                state: 'Ban State',
                postalCode: '11111',
                isDefault: false
            },
            {
                street: 'Test Street 3C',
                city: 'Block City',
                state: 'Block State',
                postalCode: '22222',
                isDefault: false
            }
        ],
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
            console.log(`  Addresses: ${user.addresses.length}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();