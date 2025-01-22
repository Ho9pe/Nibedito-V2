const createError = require('http-errors');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

const validateStock = async (productId, variantId, quantity) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw createError(400, "Invalid product ID format");
    }
    if (!mongoose.Types.ObjectId.isValid(variantId)) {
        throw createError(400, "Invalid variant ID format");
    }
    const product = await Product.findById(productId);
    if (!product) {
        throw createError(404, "Product not found");
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
        throw createError(404, "Variant not found");
    }

    if (variant.quantity < quantity) {
        throw createError(400, `Only ${variant.quantity} items available in stock`);
    }

    return { product, variant };
};

const calculateItemCost = (quantity, price) => {
    return quantity * price;
};

module.exports = {
    validateStock,
    calculateItemCost
}; 