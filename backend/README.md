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

### Category Management
- Create new categories (Admin only)
- List all categories
- Get category by slug
- Update category details (Admin only)
- Delete category (Admin only)
- Category image upload using Cloudinary

### Product Management
- Create new products with variants (Admin only)
- List all products with pagination
- Get product by slug
- Update product details (Admin only)
- Delete product (Admin only)
- Multiple product images upload using Cloudinary
- Product variant management
- Stock management

### Cart Management
- Add items to cart
- View cart contents
- Update cart item quantities
- Remove items from cart
- Clear entire cart
- Stock validation
- Price calculations

## API Endpoints

### Public Endpoints

| Method | Endpoint | Request Body | Response Payload | Description |
|--------|----------|--------------|------------------|-------------|
| GET | /test | - | message | Test endpoint to verify API is working |
| POST | /api/users/process-register | {name, email, password, phone, address} | message | Register new user |
| POST | /api/users/activate | {token} | message | Activate user account |
| POST | /api/users/verify-email | {email} | message | Verify user email |
| POST | /api/auth/login | {emailOrPhone, password} | {user, token} | User login |
| POST | /api/auth/forgot-password | {emailOrPhone} | message | Request password reset |
| POST | /api/auth/reset-password | {token, newPassword} | message | Reset password |

### Protected User Endpoints

| Method | Endpoint | Request Body | Response Payload | Description |
|--------|----------|--------------|------------------|-------------|
| GET | /api/users/:id | - | {user} | Get user profile |
| PUT | /api/users/update/:id | {name, email, phone, address} | {user} | Update user info |
| PUT | /api/users/profile/:id | FormData(profilePicture) | {user} | Update profile picture |
| POST | /api/auth/logout | - | message | User logout |
| GET | /api/auth/refresh-token | - | {token} | Refresh access token |

### Admin Endpoints

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

### Category Endpoints

| Method | Endpoint | Request Body | Response Payload | Description | Access |
|--------|----------|--------------|------------------|-------------|---------|
| POST | /api/categories | {name, description, image: File} | {category} | Create new category | Admin |
| GET | /api/categories | - | {categories[]} | Get all categories | Public |
| GET | /api/categories/:slug | - | {category} | Get category by slug | Public |
| PUT | /api/categories/:slug | {name, description, image: File} | {category} | Update category | Admin |
| DELETE | /api/categories/:slug | - | message | Delete category | Admin |

### Product Endpoints

| Method | Endpoint | Request Body | Response Payload | Description | Access |
|--------|----------|--------------|------------------|-------------|---------|
| POST | /api/products | {name, description, price, category, shipping, variants, image: File[]} | {product} | Create new product | Admin |
| GET | /api/products | query: {search, page, limit, category} | {products[], pagination} | Get all products | Public |
| GET | /api/products/:slug | - | {product} | Get product by slug | Public |
| PUT | /api/products/:slug | {name, description, price, category, shipping, variants, image: File[]} | {product} | Update product | Admin |
| DELETE | /api/products/:slug | - | message | Delete product | Admin |

### Cart Endpoints

| Method | Endpoint | Request Body | Response Payload | Description | Access |
|--------|----------|--------------|------------------|-------------|---------|
| POST | /api/cart/add-item | {productId, variantId, quantity} | {cart} | Add item to cart | User |
| GET | /api/cart | - | {cart} | Get cart contents | User |
| PUT | /api/cart/update | {itemId, quantity} | {cart} | Update cart item | User |
| DELETE | /api/cart/remove | {itemId} | {cart} | Remove item from cart | User |
| DELETE | /api/cart/clear | - | message | Clear entire cart | User |

## Implementation References
- Server Setup: `server/src/app.js`

- User Routes: `server/src/routers/userRouter.js`
- Admin Routes: `server/src/routers/adminRouter.js`
- Auth Routes: `server/src/routers/authRouter.js`
- Category Routes: `server/src/routers/categoryRouter.js`
- Product Routes: `server/src/routers/productRouter.js`
- Cart Routes: `server/src/routers/cartRouter.js`

- User Controller: `server/src/controllers/userController.js`
- Admin Controller: `server/src/controllers/adminController.js`
- Auth Controller: `server/src/controllers/authController.js`
- Category Controller: `server/src/controllers/categoryController.js`
- Product Controller: `server/src/controllers/productController.js`
- Cart Controller: `server/src/controllers/cartController.js`