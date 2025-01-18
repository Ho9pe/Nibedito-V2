const express = require("express");
const { userLogin, userLogout } = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const { validateUserLogin } = require("../validators/user");
const { runValidation } = require("../validators/validation");
const {
  addItemToCart,
  getCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cartController");

const cartRouter = express.Router();

// /api/cart common path
cartRouter.post("/add-item", isLoggedIn, addItemToCart); // Add item to cart

cartRouter.get("/", isLoggedIn, getCart); // Get cart

cartRouter.put("/update", isLoggedIn, updateCartItem); // Update item in cart

cartRouter.delete("/remove", isLoggedIn, removeItemFromCart); // Remove item from cart

cartRouter.delete("/clear", isLoggedIn, clearCart); // Remove item from cart

module.exports = cartRouter;
