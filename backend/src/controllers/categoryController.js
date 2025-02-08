const createError = require("http-errors");
const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const slugify = require("slugify");
const { getPublicIdFromUrl, uploadImage } = require("../helper/cloudinaryHelper");
const { deleteImage } = require("../helper/cloudinaryHelper");

const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const image = req.file;
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            throw createError(409, "Category already exists");
        }

        let imageUrl = '';
        if (image) {
            imageUrl = await uploadImage(image, 'category', slugify(name).toLowerCase());
        }

        const category = await Category.create({
            name,
            slug: slugify(name),
            description,
            image: imageUrl,
            productCount: 0
        });
        return successResponse(res, {
            statusCode: 201,
            message: "Category created successfully",
            payload: { category }
        });
    } catch (error) {
        next(error);
    }
};

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).select("name slug description image productCount isActive").lean();
        return successResponse(res, {
            statusCode: 200,
            message: "Categories fetched successfully",
            payload: { categories }
        });
    } catch (error) {
        next(error);
    }
};

const getCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug }).select("name slug description image productCount isActive").lean();
        
        if (!category) {
            throw createError(404, "Category not found");
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Category fetched successfully",
            payload: { category }
        });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const { name, description } = req.body;
        const image = req.file;

        const category = await Category.findOne({ slug });
        if (!category) {
            throw createError(404, "Category not found");
        }

        const updates = { description };

        if (name && name !== category.name) {
            const categoryExists = await Category.findOne({ name });
            if (categoryExists) {
                throw createError(409, "Category with this name already exists");
            }
            updates.name = name;
            updates.slug = slugify(name);
        }

        if (image) {
            try {
                if (category.image) {
                    await deleteImage(category.image);
                }
                updates.image = await uploadImage(image, 'category', slugify(name).toLowerCase());
            } catch (error) {
                console.error('Error handling image update:', error);
                // Continue with update even if image deletion fails
            }
        }

        const updatedCategory = await Category.findOneAndUpdate(
            { slug },
            updates,
            { new: true }
        );

        return successResponse(res, {
            statusCode: 200,
            message: "Category updated successfully",
            payload: { category: updatedCategory }
        });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const category = await Category.findOne({ slug });

        if (!category) {
            throw createError(404, "Category not found");
        }

        const hasProducts = await Product.exists({ category: category._id });
        if (hasProducts) {
            throw createError(400, "Cannot delete category with existing products");
        }

        if (category.image) {
            try {
                await deleteImage(category.image);
                console.log('Category image deleted from Cloudinary:', category.image);
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        }

        await Category.findOneAndDelete({ slug });

        return successResponse(res, {
            statusCode: 200,
            message: "Category deleted successfully",
            payload: { category }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
};
