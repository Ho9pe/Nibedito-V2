# E-commerce Backend API Documentation

## Implementation Overview

### Core Setup
- Express server with middleware configuration
- MongoDB database connection
- MVC architecture implementation
- Error handling middleware
- Rate limiting and security features
- CORS configuration

### Authentication System
- JWT-based authentication
- Cookie-based token management
- Password hashing using bcrypt
- Email verification system
- Password reset functionality

### User Management
- User registration with email/phone verification
- User profile management
- Profile picture upload using Cloudinary
- User banning system

### Admin System
- Admin authentication
- User management capabilities
- Admin role management (admin/superadmin)
- User banning/unbanning functionality

## API Endpoints

### Public Routes

| Method | Endpoint | Request Body | Response Payload | Description |
|--------|----------|--------------|------------------|-------------|
| GET | /test | - | message | Test endpoint to verify API is working |
| POST | /api/users/process-register | {name, email, password, phone, address} | message | Register new user |
| POST | /api/users/activate | {token} | message | Activate user account |
| POST | /api/users/verify-email | {email} | message | Verify user email |
| POST | /api/auth/login | {emailOrPhone, password} | {user, token} | User login |
| POST | /api/auth/forgot-password | {emailOrPhone} | message | Request password reset |
| POST | /api/auth/reset-password | {token, newPassword} | message | Reset password |

### Protected User Routes

| Method | Endpoint | Request Body | Response Payload | Description |
|--------|----------|--------------|------------------|-------------|
| GET | /api/users/:id | - | {user} | Get user profile |
| PUT | /api/users/update/:id | {name, email, phone, address} | {user} | Update user info |
| PUT | /api/users/profile/:id | FormData(profilePicture) | {user} | Update profile picture |
| POST | /api/auth/logout | - | message | User logout |
| GET | /api/auth/refresh-token | - | {token} | Refresh access token |

### Admin Routes

| Method | Endpoint | Request Body | Response Payload | Description |
|--------|----------|--------------|------------------|-------------|
| POST | /api/admin/login | {email, password} | {admin, token} | Admin login |
| POST | /api/admin/logout | - | message | Admin logout |
| POST | /api/admin/create | {name, email, password, phone, role} | message | Create new admin (Super Admin only) |
| GET | /api/admin/admins | - | {admins[]} | Get all admins (Super Admin only) |
| DELETE | /api/admin/admins/:id | - | message | Delete admin (Super Admin only) |
| GET | /api/admin/users | - | {users[]} | Get all users |
| GET | /api/admin/users/:id | - | {user} | Get user by ID |
| GET | /api/admin/users/stats | - | {stats} | Get user statistics |
| PUT | /api/admin/users/:id | {name, email, phone, isBanned} | {user} | Update user |
| DELETE | /api/admin/users/:id | - | message | Delete user |
| PUT | /api/admin/users/:id/ban | - | {user} | Ban user |
| PUT | /api/admin/users/:id/unban | - | {user} | Unban user |

## Implementation References

- Server Setup: `server/src/app.js`
- User Routes: `server/src/routers/userRouter.js`
- Admin Routes: `server/src/routers/adminRouter.js`
- Auth Routes: `server/src/routers/authRouter.js`
- User Controller: `server/src/controllers/userController.js`
- Admin Controller: `server/src/controllers/adminController.js`
- Auth Controller: `server/src/controllers/authController.js`