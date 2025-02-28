# Nibedito E-commerce Platform

## Demo Screenshots
![Home Page](./frontend/public/images/demo/demo_homepage.png)
![Admin Dashboard](./frontend/public/images/demo/demo_adminpanel.png)
![Product List](./frontend/public/images/demo/demo_productlist.png)
![Product Details](./frontend/public/images/demo/demo_product.png)

## Overview
Nibedito is a full-stack e-commerce platform built with modern web technologies. It provides a seamless shopping experience with features like user authentication, profile management, and admin dashboard.

## Technologies Used

### Frontend
- Next.js 14 (App Router)
- React.js
- Vanilla CSS
- Axios for API calls
- JWT for authentication
- Local Storage for state persistence

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Cloudinary for image storage
- Nodemailer for email services
- Express Validator
- Express Rate Limiter

## Features Implemented

### User Features
- Authentication (Login/Register)
- Email & Phone verification
- Basic Profile management

### Admin Features
- Basic Admin Dashboard
- User management (View/Ban/Unban)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account
- SMTP server access for emails

### Backend Setup
1. Clone the repository
2. Navigate to backend directory: 
3. Run `npm install` to install dependencies
4. Set up environment variables
5. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to frontend directory: 
2. Run `npm install` to install dependencies
3. Set up environment variables
4. Start the frontend: `npm run dev`



## Next Steps

### Planned Features
1. Product Management
   - Product CRUD operations
   - Categories and tags
   - Image gallery
   - Stock management

2. Shopping Cart
   - Add/Remove items
   - Quantity management
   - Price calculations

3. Order System
   - Checkout process
   - Payment integration
   - Order tracking
   - Order history

4. Reviews & Ratings
   - Product reviews
   - Star ratings
   - Review moderation

5. Search & Filter
   - Product search
   - Advanced filtering
   - Sort options

6. Wishlist
   - Save for later
   - Share wishlist
