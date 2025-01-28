const mongoose = require('mongoose');
const Category = require('../../models/categoryModel');
const { mongodbURL } = require('../../secret');
const slugify = require('slugify');

const categories = [
    {
        name: "Electronics",
        description: "Latest gadgets and electronic devices including smartphones, laptops, and accessories",
        image: "https://res.cloudinary.com/dzrgyxroo/image/upload/v1/nibedito/categories/electronics.jpg",
        isActive: true
    },
    {
        name: "Fashion & Clothing",
        description: "Trendy clothing, accessories, and footwear for men, women, and children",
        image: "https://res.cloudinary.com/dzrgyxroo/image/upload/v1/nibedito/categories/fashion.jpg",
        isActive: true
    },
    {
        name: "Home & Living",
        description: "Furniture, home decor, kitchen appliances, and household essentials",
        image: "https://res.cloudinary.com/dzrgyxroo/image/upload/v1/nibedito/categories/home.jpg",
        isActive: true
    },
    {
        name: "Books & Stationery",
        description: "Books, notebooks, writing instruments, and office supplies",
        image: "https://res.cloudinary.com/dzrgyxroo/image/upload/v1/nibedito/categories/books.jpg",
        isActive: true
    },
    {
        name: "Sports & Fitness",
        description: "Sports equipment, fitness gear, and outdoor activity essentials",
        image: "https://res.cloudinary.com/dzrgyxroo/image/upload/v1/nibedito/categories/sports.jpg",
        isActive: true
    },
    {
        name: "Beauty & Personal Care",
        description: "Cosmetics, skincare, haircare, and personal grooming products",
        image: "https://res.cloudinary.com/dzrgyxroo/image/upload/v1/nibedito/categories/beauty.jpg",
        isActive: true
    },
    {
        name: "Toys & Games",
        description: "Educational toys, board games, and entertainment for all ages",
        image: "https://res.cloudinary.com/dzrgyxroo/image/upload/v1/nibedito/categories/toys.jpg",
        isActive: true
    },
    {
        name: "Health & Wellness",
        description: "Health supplements, medical supplies, and wellness products",
        image: "https://res.cloudinary.com/dzrgyxroo/image/upload/v1/nibedito/categories/health.jpg",
        isActive: false
    }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(mongodbURL);
        console.log('Database connected for category seeding');
        
        // Clear existing categories
        await Category.deleteMany({});
        console.log('Existing categories cleared');

        // Add slug and default values to each category
        const categoriesWithSlug = categories.map(category => ({
            ...category,
            slug: slugify(category.name.toLowerCase()),
            productCount: 0
        }));

        // Insert categories
        const result = await Category.insertMany(categoriesWithSlug);
        console.log(`${result.length} categories seeded successfully`);

    } catch (error) {
        console.error('Error seeding categories:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected');
        process.exit(0);
    }
};

// Run the seeding
seedCategories(); 