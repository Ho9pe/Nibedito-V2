const express = require('express');
const authRouter = express.Router();

const { validateRequest } = require('../middlewares/validateRequest');
const { 
    handleLogin, 
    handleLogout, 
    forgotPassword, 
    resetPassword,
    handleRefreshToken,
    processRegister,
    activeUserAccount,
    verifyNewEmail,
    resendVerification,
} = require('../controllers/authController');
const { isLoggedIn, isLoggedOut } = require('../middlewares/authMiddleware');
const { 
    registerValidator, 
    loginValidator, 
    forgotPasswordValidator, 
    resetPasswordValidator
} = require('../validators/auth');



// FOR ALL USERS
authRouter.post('/login', isLoggedOut, loginValidator, validateRequest, handleLogin);
authRouter.post('/logout', isLoggedIn, handleLogout);
authRouter.post('/process-register', isLoggedOut, registerValidator, validateRequest, processRegister);
authRouter.post('/forgot-password', isLoggedOut, forgotPasswordValidator, validateRequest, forgotPassword);
authRouter.post('/reset-password', isLoggedOut, resetPasswordValidator, validateRequest, resetPassword);
authRouter.get('/refresh-token', handleRefreshToken);
authRouter.post('/activate-account', activeUserAccount);
authRouter.post('/verify-email', isLoggedOut, verifyNewEmail);
authRouter.post('/resend-verification', resendVerification);


module.exports = authRouter;