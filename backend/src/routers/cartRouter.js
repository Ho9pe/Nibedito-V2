const express = require("express");

const { isLoggedIn } = require("../middlewares/auth");
const { validateAddToCart, validateUpdateCart, validateRemoveFromCart } = require("../validators/cart");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  addItemToCart,
  getCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cartController");

const cartRouter = express.Router();

// /api/cart common path
cartRouter.post("/add-item", isLoggedIn, validateAddToCart, validateRequest, addItemToCart); // Add item to cart

cartRouter.get("/", isLoggedIn, getCart); // Get cart

cartRouter.put("/update", isLoggedIn, validateUpdateCart, validateRequest, updateCartItem); // Update item in cart

cartRouter.delete("/remove", isLoggedIn, validateRemoveFromCart, validateRequest, removeItemFromCart); // Remove item from cart

cartRouter.delete("/clear", isLoggedIn, clearCart); // Remove item from cart

module.exports = cartRouter;
