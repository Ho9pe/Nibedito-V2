const mongoose = require('mongoose');

// color, size, quantity, images of a product variant
const variantSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity cannot be negative']
    },
    images: [{
        type: String,
        required: true
    }]
});

//name, slug, description, price, thumbnailImage, category, variants, shipping, ratings, averageRating, totalSold, isActive
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [3, 'Product name must be at least 3 characters'],
        maxlength: [300, 'Product name cannot exceed 300 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [10, 'Description must be at least 10 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    thumbnailImage: {
        type: String,
        required: [true, 'Thumbnail image is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required']
    },
    variants: [variantSchema],
    shipping: {
        type: Boolean,
        default: true
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    totalSold: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

productSchema.pre('save', function(next) {
    if (this.ratings && this.ratings.length > 0) {
        const totalRating = this.ratings.reduce((sum, item) => sum + item.rating, 0);
        this.averageRating = totalRating / this.ratings.length;
    }
    next();
});

productSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate();
    if (update.price) {
        try {
            // Get the Cart model using mongoose.models
            const Cart = mongoose.model('Cart');
            const carts = await Cart.find({ 'items.product': this._conditions._id });
            
            for (const cart of carts) {
                cart.items.forEach(item => {
                    if (item.product.toString() === this._conditions._id.toString()) {
                        item.cost = item.quantity * update.price;
                    }
                });
                await cart.save();
            }
        } catch (error) {
            console.error('Error updating carts:', error);
        }
    }
    next();
});

productSchema.post('save', async function() {
    if (this.isNew) {
        const Category = mongoose.model('Category');
        await Category.findByIdAndUpdate(
            this.category,
            { $inc: { productCount: 1 } }
        );
    }
});

productSchema.pre('save', async function() {
    if (!this.isNew && this.isModified('category')) {
        const Category = mongoose.model('Category');
        await Category.findByIdAndUpdate(
            this._original.category,
            { $inc: { productCount: -1 } }
        );
        await Category.findByIdAndUpdate(
            this.category,
            { $inc: { productCount: 1 } }
        );
    }
});

productSchema.pre('findOneAndDelete', async function() {
    const product = await this.model.findOne(this.getQuery());
    if (product) {
        const Category = mongoose.model('Category');
        await Category.findByIdAndUpdate(
            product.category,
            { $inc: { productCount: -1 } }
        );
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
