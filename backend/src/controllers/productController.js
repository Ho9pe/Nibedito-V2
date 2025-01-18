const createError = require("http-errors"); // error-handling middleware
const { successResponse } = require("./responseController");
const Product = require("../models/productModel");
const cloudinary = require("../config/cloudinary");
const { default: slugify } = require("slugify");
const { publicIDfromURL } = require("../helper/cloudinaryHelper");

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, variants, shipping, category } = req.body;

    // Check if image is uploaded
    const images = req.files;
    if (!images || images.length === 0) {
      throw createError(400, "Image is required");
    }
    // Check each image size
    for (const image of images) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "Each image should be less than 2MB");
      }
    }

    //console.log("Uploaded Image:", images);

    // Check if product with the same name exists
    const productExist = await Product.exists({ name: name });
    if (productExist) {
      throw createError(409, "Product with this name already exists!.");
    }

    /* //print product data
    console.log("Product Data: ", {
      name,
      description,
      price,
      quantity,
      shipping,
      image,
      category,
    }); */

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const image of images) {
      const response = await cloudinary.uploader.upload(image.path, {
        folder: "ecommerce/products",
      });
      imageUrls.push(response.secure_url);
    }

    // Parse and validate variants
    let parsedVariants = [];
    if (variants) {
      parsedVariants = JSON.parse(variants); // Parse JSON string to an array
      parsedVariants.forEach((variant) => {
        if (!variant.quantity || variant.quantity < 0) {
          throw createError(400, "Each variant must have a valid quantity.");
        }
      });
    }

    //create product
    const product = await Product.create({
      name: name,
      slug: slugify(name),
      description: description,
      price: price,
      variants: parsedVariants,
      shipping: shipping,
      image: imageUrls,
      category: category,
    });

    return successResponse(res, {
      statusCode: 200,
      message: `Product created successfully`,
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    // Pagination and search query parameters
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    // Search filter and options for pagination
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      $or: [
        { name: { $regex: searchRegExp } },
        { description: { $regex: searchRegExp } },
      ],
    };
    const options = {};

    // Get products from database
    const products = await Product.find(filter, options)
      .limit(limit)
      .skip(limit * (page - 1))
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    // Check if products exist
    if (!products || products.length === 0)
      throw createError(404, "No Products found!");

    // Get total count of products
    const count = await Product.find(filter).countDocuments();

    return successResponse(res, {
      statusCode: 200,
      message: "Products were returned successfully!",
      payload: {
        products: products,
        pagination: {
          totalproducts: count,
          totalpages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page > 1 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    // Get product by slug
    const { slug } = req.params;

    // Find product from database
    const product = await Product.findOne({ slug }).populate("category");

    // Check if product exists
    if (!product) {
      throw createError(404, "Product not found!");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Products were returned succesfully!",
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    // Get product by slug
    const { slug } = req.params;

    // Find product from database
    const productExist = await Product.findOne({ slug: slug });

    // Check if product exists
    if (!productExist) {
      throw createError(404, "Product not found!");
    }

    // Delete product images from Cloudinary
    if (productExist.image.length > 0) {
      for (const image of productExist.image) {
        const publicID = await publicIDfromURL(image);
        const { result } = await cloudinary.uploader.destroy(
          `ecommerce/products/${publicID}`
        );
        if (result !== "ok") {
          throw createError(
            500,
            "Failed to delete product image from Cloudinary"
          );
        }
      }
    }

    // Delete product from database
    const product = await Product.findOneAndDelete({ slug });

    return successResponse(res, {
      statusCode: 200,
      message: "Product deleted successfully!",
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    // Get product by slug
    const { slug } = req.params;

    // Find product from database
    const productExist = await Product.findOne({ slug: slug });

    // Check if product exists
    if (!productExist) {
      throw createError(404, "Product not found!");
    }

    // update fileds and alllowed fields to update
    let updates = {};
    const allowedfields = [
      "name",
      "description",
      "price",
      "variants",
      "shipping",
    ];
    // Check if the request body contains the allowed fields
    for (const key in req.body) {
      if (allowedfields.includes(key)) {
        // check if key is variants
        if (key === "variants" && typeof req.body[key] === "string") {
          updates[key] = JSON.parse(req.body[key]);
        } else {
          updates[key] = req.body[key];
        }
      }
    }
    console.log("Request Body:", req.body);
    console.log("Updates:", updates);

    //check if name is updated
    if (updates.name) {
      updates.slug = slugify(updates.name);
    }

    const updateoptions = { new: true, context: "query" };
    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      updates,
      updateoptions
    );

    // Check if product was updated
    if (!updatedProduct) {
      throw createError(404, "Product not found!");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Product was updated successfully!",
      payload: { updatedProduct },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
