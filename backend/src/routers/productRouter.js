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
    isLoggedIn,
    isAdmin,
    uploadProduct.array("image", 10),
    validateProduct,
    validateRequest,
    createProduct
); //create a product

productRouter.get("/", getProducts); //get all products

productRouter.get("/:slug", getProduct); //get a product by slug

productRouter.delete("/:slug", isLoggedIn, isAdmin, deleteProduct); //delete a product by slug

productRouter.put(
    "/:slug",
    isLoggedIn,
    isAdmin,
    uploadProduct.array("image", 10),
    validateProduct,
    validateRequest,
    updateProduct
); //update a product by slug

module.exports = productRouter;
