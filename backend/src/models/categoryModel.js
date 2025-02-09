const mongoose = require('mongoose');

// name, slug, description, image, productCount, isActive
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Category name must be at least 3 characters'],
        maxlength: [100, 'Category name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: false,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    image: {
        type: String,
        required: false
    },
    productCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Add this static method to the category schema
categorySchema.statics.recalculateProductCounts = async function() {
    const categories = await this.find({});
    const Product = mongoose.model('Product');
    
    for (const category of categories) {
        const count = await Product.countDocuments({ category: category._id });
        await this.findByIdAndUpdate(category._id, { productCount: count });
    }
};

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
