const createError = require("http-errors");
const { successResponse } = require("./responseController");
const Product = require("../models/productModel");
const { default: slugify } = require("slugify");
const Category = require("../models/categoryModel");
const { uploadImage, deleteImage } = require("../helper/cloudinaryHelper");
const { validateImage } = require("../validators/image");

const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, variants, shipping, category } = req.body;
        const files = req.files;

        // Validate thumbnail
        if (!files?.thumbnail?.[0]) {
            throw createError(400, "Thumbnail image is required");
        }

        const productExist = await Product.exists({ name });
        if (productExist) {
            throw createError(409, "Product with this name already exists");
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            throw createError(404, "Category not found");
        }

        // Upload thumbnail
        const thumbnailImage = files.thumbnail[0];
        validateImage(thumbnailImage);
        const thumbnailUrl = await uploadImage(
            thumbnailImage, 
            'product-thumbnail',
            slugify(name).toLowerCase()
        );

        // Process variants
        let parsedVariants = [];
        if (variants) {
            parsedVariants = JSON.parse(variants);
            
            // Handle variant images
            if (files.variantImages) {
                let processedImageCount = 0;
                
                for (let variantIndex = 0; variantIndex < parsedVariants.length; variantIndex++) {
                    const variant = parsedVariants[variantIndex];
                    const variantImages = [];
                    
                    if (variant.imageIndices?.length > 0) {
                        if (variant.imageIndices.length > 5) {
                            throw createError(400, "Maximum 5 images allowed per variant");
                        }
                        
                        for (let i = 0; i < variant.imageIndices.length; i++) {
                            const image = files.variantImages[processedImageCount];
                            if (image) {
                                validateImage(image);
                                const imageUrl = await uploadImage(
                                    image,
                                    'product-variant',
                                    `${slugify(name).toLowerCase()}-variant${variantIndex}-${i}`
                                );
                                variantImages.push(imageUrl);
                                processedImageCount++;
                            }
                        }
                    }
                    variant.images = variantImages;
                }
            }
        }

        const product = await Product.create({
            name,
            slug: slugify(name),
            description,
            price,
            thumbnailImage: thumbnailUrl,
            variants: parsedVariants,
            shipping,
            category
        });

        return successResponse(res, {
            statusCode: 201,
            message: "Product created successfully",
            payload: { product }
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

        // Get total stats
        const allProducts = await Product.find(filter).lean();
        const totalStats = {
            totalValue: allProducts.reduce((sum, product) => sum + product.price, 0),
            totalVariants: allProducts.reduce((sum, product) => sum + (product.variants?.length || 0), 0),
            activeCategories: new Set(allProducts.map(product => product.category)).size
        };

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
                ...totalStats
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
        const { slug } = req.params;
        const product = await Product.findOne({ slug });

        if (!product) {
            throw createError(404, "Product not found!");
        }

        // Delete thumbnail - pass the full URL
        if (product.thumbnailImage) {
            try {
                await deleteImage(product.thumbnailImage);
                console.log('Product thumbnail deleted:', product.thumbnailImage);
            } catch (error) {
                console.error('Error deleting thumbnail:', error);
            }
        }

        // Delete variant images - pass the full URLs
        if (product.variants && product.variants.length > 0) {
            for (const variant of product.variants) {
                if (variant.images && variant.images.length > 0) {
                    for (const imageUrl of variant.images) {
                        try {
                            await deleteImage(imageUrl);
                            console.log('Variant image deleted:', imageUrl);
                        } catch (error) {
                            console.error('Error deleting variant image:', error);
                        }
                    }
                }
            }
        }

        // Delete the product from database
        const deletedProduct = await Product.findOneAndDelete({ slug });

        return successResponse(res, {
            statusCode: 200,
            message: "Product deleted successfully",
            payload: { product: deletedProduct }
        });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const { name, description, price, variants, shipping, category } = req.body;
        const files = req.files;

        const product = await Product.findOne({ slug });
        if (!product) {
            throw createError(404, "Product not found!");
        }

        // Initialize updates with existing product data
        let updates = {
            name: name || product.name,
            description: description || product.description,
            price: price || product.price,
            category: category || product.category,
            shipping: shipping !== undefined ? shipping : product.shipping,
            thumbnailImage: product.thumbnailImage // Keep existing thumbnail if not updating
        };

        // Handle name update and slug generation
        if (name && name !== product.name) {
            const productExists = await Product.exists({ 
                name, 
                _id: { $ne: product._id } 
            });
            if (productExists) {
                throw createError(409, "Product with this name already exists");
            }
            updates.slug = slugify(name);
        }

        // Handle thumbnail update
        if (files?.thumbnail?.[0]) {
            // Delete old thumbnail
            if (product.thumbnailImage) {
                const publicId = product.thumbnailImage;
                await deleteImage(publicId);
            }
            // Upload new thumbnail
            const thumbnailImage = files.thumbnail[0];
            validateImage(thumbnailImage);

            updates.thumbnailImage = await uploadImage(
                thumbnailImage, 
                'product-thumbnail',
                slugify(updates.name).toLowerCase()
            );
        }

        // Handle variants update
        if (variants) {
            const parsedVariants = JSON.parse(variants);
            
            // If there are new variant images
            if (files?.variantImages) {
                let processedImageCount = 0;
                
                for (let i = 0; i < parsedVariants.length; i++) {
                    const variant = parsedVariants[i];
                    
                    // Skip variants without updates
                    if (!variant.removedImageIndices && !variant.newImageCount) {
                        variant.images = product.variants[i]?.images || [];
                        continue;
                    }

                    let variantImages = [...(product.variants[i]?.images || [])];

                    // Remove specified images
                    if (variant.removedImageIndices?.length > 0) {
                        // Delete removed images from storage
                        for (const index of variant.removedImageIndices) {
                            if (variantImages[index]) {
                                const publicId = getPublicIdFromUrl(variantImages[index]);
                                await deleteImage(publicId);
                            }
                        }
                        
                        // Filter out removed images
                        variantImages = variantImages.filter((_, idx) => 
                            !variant.removedImageIndices.includes(idx)
                        );
                    }

                    // Add new images
                    if (variant.newImageCount > 0) {
                        for (let j = 0; j < variant.newImageCount; j++) {
                            const image = files.variantImages[processedImageCount];
                            if (image) {
                                validateImage(image);
                                const imageUrl = await uploadImage(
                                    image,
                                    'product-variant',
                                    `${slugify(updates.name || name).toLowerCase()}-variant${i}-${j}`
                                );
                                variantImages.push(imageUrl);
                                processedImageCount++;
                            }
                        }
                    }

                    variant.images = variantImages;
                    delete variant.removedImageIndices;
                    delete variant.newImageCount;
                }
            } else {
                // Keep existing variant images if no new images
                parsedVariants.forEach((variant, index) => {
                    if (!variant.images) {
                        variant.images = product.variants[index]?.images || [];
                    }
                });
            }
            
            updates.variants = parsedVariants;
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { slug },
            updates,
            { new: true, runValidators: true }
        ).populate('category');

        return successResponse(res, {
            statusCode: 200,
            message: "Product updated successfully",
            payload: { product: updatedProduct }
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
