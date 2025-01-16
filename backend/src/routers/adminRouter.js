const express = require('express');
const adminRouter = express.Router();
const { isAdmin, isSuperAdmin, isAdminLoggedIn, isAdminLoggedOut } = require('../middlewares/authMiddleware');
const { 
    handleAdminLogin, 
    handleAdminLogout, 
    createAdmin, 
    getAllAdmins, 
    deleteAdmin,
    banUserById,
    unbanUserById
} = require('../controllers/adminController');

const { 
    getAllUsers,
    getUserById,
} = require('../controllers/userController');


// Admin authentication routes
adminRouter.post('/login', isAdminLoggedOut, handleAdminLogin);
adminRouter.post('/logout', isAdminLoggedIn, handleAdminLogout);

// Super admin only routes
adminRouter.post('/create', isAdmin, isSuperAdmin, createAdmin);
adminRouter.get('/admins', isAdmin, isSuperAdmin, getAllAdmins);
adminRouter.delete('/admins/:id', isAdmin, isSuperAdmin, deleteAdmin);

// User management routes (accessible by both admin and superadmin)
adminRouter.get('/users', isAdmin, getAllUsers);
adminRouter.get('/users/:id', isAdmin, getUserById);
adminRouter.post('/users/:id/ban', isAdmin, banUserById);
adminRouter.post('/users/:id/unban', isAdmin, unbanUserById);

module.exports = adminRouter;