const express = require("express");

const { uploadProduct } = require("../config/cloudinary");

const {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
} = require("../controllers/productController");
const { validateProduct } = require("../validators/product");
const { validateRequest } = require("../middlewares/validateRequest");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");

const productRouter = express.Router();

// /api/products common path
productRouter.post(
    "/",
    isAdmin,
    uploadProduct,
    validateProduct,
    validateRequest,
    createProduct
); //create a product

productRouter.get("/", getProducts); //get all products

productRouter.get("/:slug", getProduct); //get a product by slug

productRouter.delete("/:slug", isLoggedIn, isAdmin, deleteProduct); //delete a product by slug

productRouter.put(
    "/:slug",
    isAdmin,
    uploadProduct,
    validateProduct,
    validateRequest,
    updateProduct
); //update a product by slug

module.exports = productRouter;
