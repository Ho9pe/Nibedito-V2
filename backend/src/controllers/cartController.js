const { successResponse } = require("./responseController");
const createError = require("http-errors");

const Cart = require("../models/cartModel");
const { default: mongoose } = require("mongoose");
const Product = require("../models/productModel");

const addItemToCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, variantId, quantity } = req.body;

    if (!productId || !quantity || !variantId) {
      throw createError(
        400,
        "Please provide product id, variant id and quantity"
      );
    }

    // Ensure quantity is a number
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      throw createError(400, "Invalid quantity");
    }
    //console.log("Quantity:", quantity);
    //console.log("Parsed Quantity:", parsedQuantity);

    // check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw createError(404, "Product not found");
    }
    // check if variant exists
    const variant = product.variants.find(
      (variant) => variant._id.toString() === variantId
    );
    if (!variant) {
      throw createError(404, "Variant not found");
    }

    let cart = await Cart.findOne({ user: userId }); // find cart by user id

    //console.log("Cart:", cart);
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }
    //console.log("Cart:", cart);

    // Check if the product already exists in the cart
    const existOrderItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId
    );
    //console.log("Exist Order Item:", existOrderItem);

    // update quantity
    if (existOrderItem) {
      existOrderItem.quantity += parsedQuantity;
      existOrderItem.cost += parsedQuantity * product.price;
    } else {
      cart.items.push({
        product: productId,
        variant: variantId,
        quantity: parsedQuantity,
        cost: parsedQuantity * product.price,
      });
    }

    // update total price
    cart.totalPrice += parsedQuantity * product.price;
    cart = await cart.save();

    return successResponse(res, {
      statusCode: 201,
      message: "Cart created successfully",
      payload: cart,
    });
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw createError(404, "Cart not found");
    }

    const cartDetails = {
      _id: cart._id,
      user: cart.user,
      totalPrice: cart.totalPrice,
      items: [...cart.items],
    };

    for (let i = 0; i < cartDetails.items.length; i++) {
      const item = cartDetails.items[i];
      const product = await Product.findById(item.product);
      const variant = product.variants.find(
        (variant) => variant._id.toString() === item.variant.toString()
      );

      // Construct item details
      const updatedItem = {
        ...item._doc, // Spread the existing item properties
        productDetails: {
          name: product.name,
          price: product.price,
        },
        variantDetails: {
          color: variant?.color || "N/A",
          size: variant?.size || "N/A",
        },
      };

      // Replace the item in cartDetails.items
      cartDetails.items[i] = updatedItem;
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Cart fetched successfully",
      payload: cartDetails,
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { itemId, quantity } = req.body;

    if (!itemId || !quantity) {
      throw createError(400, "Please provide item id and quantity");
    }

    // Ensure quantity is a number
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      throw createError(400, "Invalid quantity");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw createError(404, "Cart not found");
    }

    const item = cart.items.find((item) => item._id.toString() === itemId);
    if (!item) {
      throw createError(404, "Item not found");
    }

    const product = await Product.findById(item.product);
    if (!product) {
      throw createError(404, "Product not found");
    }

    const prevCost = item.cost;
    item.quantity = parsedQuantity;
    item.cost = parsedQuantity * product.price;

    cart.totalPrice = cart.totalPrice - prevCost + item.cost;

    await cart.save();

    return successResponse(res, {
      statusCode: 200,
      message: "Cart was updated successfully",
      payload: cart,
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

    // Ensure itemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw createError(400, "Invalid item id");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw createError(404, "Cart not found");
    }

    const item = cart.items.find((item) => item._id.toString() === itemId);
    if (!item) {
      throw createError(404, "Item not found");
    }

    cart.totalPrice -= item.cost;
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    //check if cart is empty
    if (cart.items.length === 0) {
      //delete cart
      await cart.deleteOne({ _id: cart._id });
      cart = null;
    } else {
      await cart.save();
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Item was removed from cart successfully",
      payload: cart,
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw createError(404, "Cart not found");
    }

    await cart.deleteOne({ _id: cart._id });

    return successResponse(res, {
      statusCode: 200,
      message: "Cart was cleared successfully",
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
  clearCart,
};
