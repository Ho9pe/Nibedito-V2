const express = require('express');
const userRouter = express.Router();

const { uploadProfile } = require('../config/cloudinary');
const { updateUserValidator } = require('../validators/auth');
const { validateRequest } = require('../middlewares/validateRequest');
const { isLoggedIn, isOwner, isLoggedOut } = require('../middlewares/authMiddleware');
const { 
    getUserById,
    updateUserInfo,
    updateUserProfilePicture,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress
} = require('../controllers/userController');

// Protected Routes (logged-in users)
userRouter.get('/:id', isLoggedIn, isOwner, getUserById);
userRouter.put('/update/:id', isLoggedIn, isOwner, updateUserValidator, validateRequest, updateUserInfo);
userRouter.put('/profile/:id', isLoggedIn, isOwner, uploadProfile.single('profilePicture'), updateUserProfilePicture);

// Address Routes
userRouter.post('/:id/addresses', isLoggedIn, isOwner, addUserAddress);
userRouter.put('/:id/addresses/:addressId', isLoggedIn, isOwner, updateUserAddress);
userRouter.delete('/:id/addresses/:addressId', isLoggedIn, isOwner, deleteUserAddress);

module.exports = userRouter;