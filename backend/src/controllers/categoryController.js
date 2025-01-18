const { successResponse } = require("./responseController");
const createError = require("http-errors");

const Category = require("../models/categoryModel");

const { default: slugify } = require("slugify");

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    //console.log(name);

    const newCategory = await Category.create({
      name: name,
      slug: slugify(name, { lower: true }),
    });

    return successResponse(res, {
      statusCode: 201,
      message: "Category created successfully",
      payload: { newCategory },
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).select("name slug").lean();

    return successResponse(res, {
      statusCode: 200,
      message: "Category fetched successfully",
      payload: { categories },
    });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.find({ slug }).select("name slug").lean();
    if (!category) {
      throw createError(404, "Category not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Category fetched successfully",
      payload: { category },
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;

    const filter = { slug };
    const updates = { $set: { name: name, slug: slugify(name) } };
    const options = { new: true };

    const updatedCategory = await Category.findOneAndUpdate(
      filter,
      updates,
      options
    );
    if (!updatedCategory) {
      console.log("Category not found");
      throw createError(404, "Category not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Category was updated successfully",
      payload: { updatedCategory },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const deletedCategory = await Category.findOneAndDelete({ slug });
    if (!deletedCategory) {
      throw createError(404, "Category not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Category was deleted successfully",
      payload: { deletedCategory },
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
  deleteCategory,
};
