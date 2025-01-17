const express = require('express');
const adminRouter = express.Router();

const { isAdmin, isSuperAdmin, isAdminLoggedIn, isAdminLoggedOut } = require('../middlewares/authMiddleware');
const { 
    // Admin authentication
    handleAdminLogin,
    handleAdminLogout,
    // Admin management
    createAdmin,
    getAllAdmins,
    deleteAdmin,
    // User management
    getAllUsers,
    getUserById,
    getUserStats,
    updateUserById,
    deleteUserById,
    banUserById,
    unbanUserById
} = require('../controllers/adminController');

// Admin authentication routes
adminRouter.post('/login', isAdminLoggedOut, handleAdminLogin);
adminRouter.post('/logout', isAdminLoggedIn, handleAdminLogout);

// Super admin only routes
adminRouter.post('/create', isAdmin, isSuperAdmin, createAdmin);
adminRouter.get('/admins', isAdmin, isSuperAdmin, getAllAdmins);
adminRouter.delete('/admins/:id', isAdmin, isSuperAdmin, deleteAdmin);

// User Management
adminRouter.get('/users', isAdmin, getAllUsers);
adminRouter.get('/users/:id', isAdmin, getUserById);
adminRouter.get('/users/stats', isAdmin, getUserStats);
adminRouter.put('/users/:id', isAdmin, updateUserById);
adminRouter.delete('/users/:id', isAdmin, deleteUserById);
adminRouter.put('/users/:id/ban', isAdmin, banUserById);
adminRouter.put('/users/:id/unban', isAdmin, unbanUserById);

module.exports = adminRouter;