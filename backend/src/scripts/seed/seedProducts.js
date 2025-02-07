const mongoose = require('mongoose');
const { mongodbURL } = require('../../secret');
const Product = require('../../models/productModel');
const Category = require('../../models/categoryModel');
const slugify = require('slugify');

const demoImageLink = "https://res.cloudinary.com/dzrgyxroo/image/upload/v1738870183/nibedito/products/products-1738870177418-461818337.jpg"
const products = [
    {
        name: "Nike Air Max 270",
        description: "The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it features the Air Max line's biggest heel Air unit yet, plus a super-breathable knit upper that helps keep you cool.",
        price: 150,
        categoryName: "Sports & Fitness",
        thumbnailImage: demoImageLink,
        variants: [
            {
                color: "Black",

                size: "42",
                quantity: 10,
                images: [demoImageLink]

            },
            {
                color: "Red",
                size: "43",
                quantity: 15,
                images: [demoImageLink]

            }
        ]
    },
    {
        name: "Samsung 4K Smart TV",
        description: "Experience crystal clear 4K resolution and smart features with this Samsung TV. Perfect for movies, gaming, and everyday entertainment with built-in streaming apps and voice control.",
        price: 799,
        categoryName: "Electronics",
        thumbnailImage: demoImageLink,
        variants: [
            {
                color: "Black",

                size: "43-inch",
                quantity: 5,
                images: [demoImageLink]

            },
            {
                color: "Black",
                size: "55-inch",
                quantity: 3,
                images: [demoImageLink]

            }
        ]
    },
    {
        name: "Organic Green Tea Set",
        description: "Premium organic green tea set with various flavors. Perfect for tea enthusiasts and health-conscious individuals. Includes jasmine, sencha, and matcha varieties.",
        price: 29.99,
        categoryName: "Health & Wellness",
        thumbnailImage: demoImageLink,

        variants: [
            {
                color: "Mixed",
                size: "30 Bags",
                quantity: 50,
                images: [demoImageLink]

            },
            {
                color: "Mixed",
                size: "60 Bags",
                quantity: 30,
                images: [demoImageLink]

            }
        ]
    },
    {
        name: "Luxury Diamond Watch",
        description: "Limited edition diamond-encrusted watch with 18K gold case. A masterpiece of horological craftsmanship featuring Swiss movement and rare gemstones.",
        price: 999999.99,
        categoryName: "Fashion & Accessories",
        thumbnailImage: demoImageLink,

        variants: [
            {
                color: "Gold",
                size: "40mm",
                quantity: 1,
                images: [demoImageLink]

            }
        ]
    },
    {
        name: "Custom Gaming PC",
        description: "Build your dream gaming PC with various configuration options.",
        price: 1499.99,
        categoryName: "Electronics",
        thumbnailImage: demoImageLink,

        variants: Array.from({ length: 20 }, (_, i) => ({
            color: i % 2 === 0 ? "Black" : "White",
            size: `Config ${i + 1}`,
            quantity: Math.floor(Math.random() * 10) + 1,
            images: [demoImageLink]

        }))
    },
    {
        name: "Limited Edition Sneakers",
        description: "Exclusive collaboration sneakers. Sold out immediately after release.",
        price: 299.99,
        categoryName: "Sports & Fitness",
        thumbnailImage: demoImageLink,

        variants: [
            {
                color: "Multi",
                size: "42",
                quantity: 0,
                images: [demoImageLink]

            }
        ]
    },
    {
        name: "Professional Camera Kit",
        description: "Professional-grade DSLR camera kit with everything you need for stunning photography. ".repeat(10),
        price: 2499.99,
        categoryName: "Electronics",
        thumbnailImage: demoImageLink,

        variants: [
            {
                color: "Black",
                size: "Standard",
                quantity: 5,
                images: [demoImageLink]

            }
        ]
    },
    {
        name: "Paper Clips",
        description: "Standard metal paper clips for office use.",
        price: 0.99,
        categoryName: "Office Supplies",
        thumbnailImage: demoImageLink,

        variants: [
            {
                color: "Silver",
                size: "Small",
                quantity: 1000,
                images: [demoImageLink]

            }
        ]
    },
    {
        name: "★ Special Edition PS5™ & Xbox® Bundle! (2024)",
        description: "Limited time gaming bundle with special characters in name!",
        price: 999.99,
        categoryName: "Electronics",
        thumbnailImage: demoImageLink,

        variants: [
            {
                color: "Mixed",
                size: "Bundle",
                quantity: 10,
                images: [demoImageLink]

            }
        ]
    },
    {
        name: "Classic Notebook",
        description: "Simple and elegant notebook for everyday use. Made with high-quality paper.",
        price: 9.99,
        categoryName: "Office Supplies",
        thumbnailImage: demoImageLink,
        variants: []

    },
    {
        name: "Digital Marketing eBook",
        description: "Comprehensive guide to modern digital marketing strategies and techniques.",
        price: 24.99,
        categoryName: "Books & Media",
        thumbnailImage: demoImageLink,
        variants: []

    },
    {
        name: "Basic White T-Shirt",
        description: "Essential cotton t-shirt for everyday wear.",
        price: 15.99,
        categoryName: "Fashion & Accessories",
        thumbnailImage: demoImageLink,
        variants: []

    },
    {
        name: "Digital Gift Card",
        description: "Perfect gift for any occasion. Can be used on any product in our store.",
        price: 50.00,
        categoryName: "Gift Cards",
        thumbnailImage: demoImageLink,
        variants: null

    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(mongodbURL);
        console.log('Database connected for product seeding');
        
        // Clear existing products
        await Product.deleteMany({});
        console.log('Existing products cleared');

        // Process each product
        const processedProducts = [];
        for (const product of products) {
            // Find category
            const category = await Category.findOne({ name: product.categoryName });
            if (!category) {
                console.log(`Category ${product.categoryName} not found, skipping product ${product.name}`);
                continue;
            }

            // Prepare product data
            const productData = {
                name: product.name,
                slug: slugify(product.name.toLowerCase()),
                description: product.description,
                price: product.price,
                thumbnailImage: product.thumbnailImage,
                category: category._id,
                variants: product.variants,
                shipping: true,
                isActive: true
            };

            processedProducts.push(productData);
        }

        // Insert products
        const result = await Product.insertMany(processedProducts);
        console.log(`${result.length} products seeded successfully`);

        // Update category product counts
        for (const category of await Category.find()) {
            const count = await Product.countDocuments({ category: category._id });
            await Category.findByIdAndUpdate(category._id, { productCount: count });
        }
        console.log('Category product counts updated');

    } catch (error) {
        console.error('Error seeding products:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected');
        process.exit(0);
    }
};

seedProducts(); 