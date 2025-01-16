const express = require('express');
const userRouter = express.Router();

const { upload } = require('../config/cloudinary');
const { updateUserValidator } = require('../validators/auth');
const { validateRequest } = require('../middlewares/validateRequest');
const { isLoggedIn, isOwner, isLoggedOut } = require('../middlewares/authMiddleware');
const { 
    getUserById,
    updateUserInfo,
    updateUserProfilePicture,
} = require('../controllers/userController');


// Public Routes


// Protected Routes (logged-in users)
userRouter.get('/:id', isLoggedIn, isOwner, getUserById);
userRouter.put('/update/:id', isLoggedIn, isOwner, updateUserValidator, validateRequest, updateUserInfo);
userRouter.put('/profile/:id', isLoggedIn, isOwner, upload.single('profilePicture'), updateUserProfilePicture);


module.exports = userRouter;