const express = require("express");

const { uploadProductImage } = require("../middlewares/uploadfile");

const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const { validateProduct } = require("../validators/product");
const { runValidation } = require("../validators/validation");

const productRouter = express.Router();

// /api/products common path
productRouter.post(
  "/",
  uploadProductImage.array("image", 10),
  validateProduct,
  runValidation,
  createProduct
); //create a product

productRouter.get("/", getProducts); //get all products

productRouter.get("/:slug", getProduct); //get a product by slug

productRouter.delete("/:slug", deleteProduct); //delete a product by slug

productRouter.put("/:slug", updateProduct); //update a product by slug

module.exports = productRouter;
