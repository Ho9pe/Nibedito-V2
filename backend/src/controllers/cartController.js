const { successResponse } = require("./responseController");
const createError = require("http-errors");
const Cart = require("../models/cartModel");
const { validateStock, calculateItemCost } = require("../helper/cartHelper");

const addItemToCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId, variantId, quantity } = req.body;
        
        const parsedQuantity = parseInt(quantity);
        
        // Check product, variant and stock availability
        const { product, variant } = await validateStock(productId, variantId, parsedQuantity);

        // Find or create cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalPrice: 0,
                status: 'active'
            });
        }

        // Check if item exists in cart
        const existingItem = cart.items.find(item =>
            item.product.toString() === productId &&
            item.variant._id.toString() === variantId
        );

        // Calculate total quantity and check stock before updating
        const totalQuantity = existingItem ? existingItem.quantity + parsedQuantity : parsedQuantity;
        if (variant.quantity < totalQuantity) {
            throw createError(400, `Only ${variant.quantity} items available in stock`);
        }

        if (existingItem) {
            existingItem.quantity = totalQuantity;
            existingItem.variant = {
                _id: variant._id,
                color: variant.color,
                size: variant.size
            };
            existingItem.cost = calculateItemCost(totalQuantity, product.price);
        } else {
            cart.items.push({
                product: productId,
                variant: {
                    _id: variant._id,
                    color: variant.color,
                    size: variant.size
                },
                quantity: parsedQuantity,
                cost: calculateItemCost(parsedQuantity, product.price)
            });
        }

        await cart.save();

        return successResponse(res, {
            statusCode: 200,
            message: "Item added to cart successfully",
            payload: { cart }
        });
    } catch (error) {
        next(error);
    }
};

const getCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name price thumbnailImage slug category'
            });

        if (!cart) {
            return successResponse(res, {
                statusCode: 200,
                message: "Cart is empty",
                payload: { cart: null }
            });
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Cart fetched successfully",
            payload: { cart }
        });
    } catch (error) {
        next(error);
    }
};

const updateCartItem = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { itemId, quantity } = req.body;
        
        const parsedQuantity = parseInt(quantity);

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw createError(404, "Cart not found");
        }

        const item = cart.items.find(item => item._id.toString() === itemId);
        if (!item) {
            throw createError(404, "Item not found");
        }

        // Check stock availability and get updated product/variant info
        const { product, variant } = await validateStock(item.product, item.variant._id, parsedQuantity);

        // Update quantity and variant details
        item.quantity = parsedQuantity;
        item.variant = {
            _id: variant._id,
            color: variant.color,
            size: variant.size
        };
        item.cost = calculateItemCost(parsedQuantity, product.price);

        await cart.save();

        return successResponse(res, {
            statusCode: 200,
            message: "Cart item updated successfully",
            payload: { cart }
        });
    } catch (error) {
        next(error);
    }
};

const removeItemFromCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { itemId } = req.body;

        if (!itemId) {
            throw createError(400, "Please provide item id");
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw createError(404, "Cart not found");
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            throw createError(404, "Item not found");
        }

        cart.items.splice(itemIndex, 1);

        if (cart.items.length === 0) {
            await Cart.deleteOne({ _id: cart._id });
            cart = null;
        } else {
            await cart.save();
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Item removed from cart successfully",
            payload: { cart }
        });
    } catch (error) {
        next(error);
    }
};

const clearCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        await Cart.deleteOne({ user: userId });

        return successResponse(res, {
            statusCode: 200,
            message: "Cart cleared successfully",
            payload: null
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addItemToCart,
    getCart,
    updateCartItem,
    removeItemFromCart,
    clearCart
};
