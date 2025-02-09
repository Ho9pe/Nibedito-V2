const express = require("express");
const { uploadCategory } = require("../config/cloudinary");
const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    recalculateProductCounts
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
    uploadCategory.single("image"),
    validateCategory,
    validateRequest,
    createCategory
);

//POST /api/categories/recalculate-counts
categoryRouter.post("/recalculate-counts", isLoggedIn, isAdmin, recalculateProductCounts);

//GET /api/categories common path
categoryRouter.get("/", getCategories);
categoryRouter.get("/:slug", getCategory);

//PUT /api/categories common path
categoryRouter.put(
    "/:slug",
    isLoggedIn,
    isAdmin,
    uploadCategory.single("image"),
    validateCategory,
    validateRequest,
    updateCategory
);

//DELETE /api/categories common path
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, deleteCategory);

module.exports = categoryRouter;
