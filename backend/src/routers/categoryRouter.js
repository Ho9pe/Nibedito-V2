const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");
const { runValidation } = require("../validators/validation");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const categoryRouter = express.Router();

//POST /api/categories common path
categoryRouter.post(
  "/",
  validateCategory,
  runValidation,
  isLoggedIn,
  createCategory
);

//GET /api/categories common path
categoryRouter.get("/", getCategories);
categoryRouter.get("/:slug", getCategory);

//PUT /api/categories common path
categoryRouter.put("/:slug", updateCategory);

//DELETE /api/categories common path
categoryRouter.delete("/:slug", deleteCategory);

module.exports = categoryRouter;
