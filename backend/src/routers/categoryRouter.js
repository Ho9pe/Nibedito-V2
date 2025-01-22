const express = require("express");
const { uploadCategoryImage } = require("../middlewares/uploadfile");
const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");
const { validateRequest } = require("../middlewares/validateRequest");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");

const categoryRouter = express.Router();

//POST /api/categories common path
categoryRouter.post(
    "/",
    isLoggedIn,
    isAdmin,
    uploadCategoryImage.single("image"),
    validateCategory,
    validateRequest,
    createCategory
);

//GET /api/categories common path
categoryRouter.get("/", getCategories);
categoryRouter.get("/:slug", getCategory);

//PUT /api/categories common path
categoryRouter.put(
    "/:slug",
    isLoggedIn,
    isAdmin,
    uploadCategoryImage.single("image"),
    validateCategory,
    validateRequest,
    updateCategory
);

//DELETE /api/categories common path
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, deleteCategory);

module.exports = categoryRouter;
