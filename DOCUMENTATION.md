# QuickCart - Complete Application Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [Admin Documentation](#admin-documentation)
6. [API Endpoints](#api-endpoints)
7. [Database Schema](#database-schema)
8. [Configuration Files](#configuration-files)
9. [Deployment](#deployment)
10. [Environment Variables](#environment-variables)

---

## Project Overview

**QuickCart** is a full-stack grocery management system built with:
- **Frontend**: React + Vite (Customer-facing application)
- **Backend**: Node.js + Express.js (REST API)
- **Admin**: React + Vite (Administrative panel)
- **Database**: MongoDB (via Mongoose)
- **Payment**: Stripe integration
- **Deployment**: Vercel (Frontend/Admin) + Railway (Backend)

### Key Features
- User authentication (Login/Register)
- Product catalog browsing
- Shopping cart functionality
- Order placement and tracking
- Stripe payment integration
- Dark/Light mode theme toggle
- Admin panel for product and order management
- Responsive design

---

## Project Structure

```
QuickCart/
├── Frontend/          # Customer-facing React application
├── Backend/           # Node.js/Express API server
├── Admin/             # Administrative React application
├── .gitignore         # Git ignore rules
├── Readme.md          # Project README
├── DEPLOYMENT.md      # Deployment guide
└── DEPLOYMENT_STEPS.md # Step-by-step deployment instructions
```

---

## Backend Documentation

### Root Files

#### `Backend/server.js`
**Purpose**: Main entry point for the Express server

**Functionality**:
- Initializes Express application
- Configures middleware (JSON parser, CORS)
- Sets up database connection
- Registers API routes
- Starts HTTP server on port 4000 (or PORT env variable)

**Key Features**:
- CORS configuration for frontend and admin apps
- Static file serving for uploaded images (`/images` route)
- Health check endpoint (`GET /`)

**Dependencies**: express, cors, dotenv

---

#### `Backend/package.json`
**Purpose**: Node.js project configuration and dependencies

**Scripts**:
- `npm run server`: Development server with nodemon (auto-restart)
- `npm start`: Production server (used by Railway)

**Key Dependencies**:
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcrypt`: Password hashing
- `jsonwebtoken`: JWT authentication
- `stripe`: Payment processing
- `multer`: File upload handling
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management

---

### Configuration Files

#### `Backend/config/db.js`
**Purpose**: MongoDB database connection configuration

**Functionality**:
- Connects to MongoDB using connection string from `MONGO_DBurl` environment variable
- Uses Mongoose for database operations
- Logs connection status

**Environment Variable**: `MONGO_DBurl` (MongoDB Atlas connection string)

---

#### `Backend/Procfile`
**Purpose**: Railway deployment configuration

**Content**: `web: npm start`

**Functionality**: Tells Railway how to start the application in production

---

#### `Backend/railway.json`
**Purpose**: Railway-specific build and deployment configuration

**Configuration**:
- Build command: `npm install`
- Start command: `npm start`
- Uses Nixpacks builder

---

### Models (`Backend/models/`)

#### `Backend/models/userModel.js`
**Purpose**: User data model/schema

**Schema Fields**:
- `name` (String, required): User's full name
- `email` (String, required, unique): User's email address
- `password` (String, required): Hashed password
- `cartData` (Object, default: {}): User's shopping cart items stored as `{itemId: quantity}`

**Features**:
- Email uniqueness enforced
- Cart data preserved even when empty (`minimize: false`)

---

#### `Backend/models/foodModel.js`
**Purpose**: Product/Grocery item data model

**Schema Fields**:
- `name` (String, required): Product name
- `description` (String, required): Product description
- `price` (Number, required): Product price in INR
- `image` (String, required): Image filename (stored in uploads folder)
- `category` (String, required): Product category

**Categories Used**:
- Personal Care
- Fruits & Veggies
- Dairy, Bread & Eggs
- Masala & Dry Fruits
- Meat, Fish & Eggs
- Atta, Rice, Oil & Dals
- Packaged Food
- Breakfast & Sauces

---

#### `Backend/models/orderModel.js`
**Purpose**: Order data model

**Schema Fields**:
- `userId` (String, required): User ID who placed the order
- `items` (Array, required): Array of ordered items with quantities
- `amount` (Number, required): Total order amount
- `address` (Object, required): Delivery address details
- `status` (String, default: "Food is Getting Ready!"): Order status
- `date` (Date, default: Date.now()): Order placement date
- `payment` (Boolean, default: false): Payment status

---

### Middleware (`Backend/middleware/`)

#### `Backend/middleware/auth.js`
**Purpose**: JWT authentication middleware

**Functionality**:
- Extracts JWT token from request headers (`token` header)
- Verifies token using `JWT_SECRET`
- Extracts user ID from token and adds to `req.body.userId`
- Protects routes that require authentication

**Usage**: Applied to routes that need user authentication (cart, orders)

**Error Handling**: Returns error response if token is missing or invalid

---

### Controllers (`Backend/controllers/`)

#### `Backend/controllers/userController.js`
**Purpose**: User authentication and registration logic

**Functions**:

1. **`registerUser(req, res)`**
   - Validates email format using validator
   - Checks password strength (minimum 8 characters)
   - Checks if user already exists
   - Hashes password using bcrypt (salt rounds: 10)
   - Creates new user in database
   - Generates JWT token
   - Returns token on success

2. **`loginUser(req, res)`**
   - Finds user by email
   - Compares provided password with hashed password
   - Generates JWT token on successful authentication
   - Returns token

3. **`createToken(id)`**
   - Helper function to generate JWT token
   - Uses user ID and `JWT_SECRET` environment variable

---

#### `Backend/controllers/foodController.js`
**Purpose**: Product management logic

**Functions**:

1. **`addFood(req, res)`**
   - Handles product creation
   - Receives image file via multer middleware
   - Creates food document with name, description, price, category, image filename
   - Saves to database

2. **`listfood(req, res)`**
   - Retrieves all products from database
   - Returns array of all food items

3. **`removeFood(req, res)`**
   - Deletes product by ID
   - Removes associated image file from uploads folder
   - Deletes product document from database

---

#### `Backend/controllers/cartController.js`
**Purpose**: Shopping cart management logic

**Functions**:

1. **`addToCart(req, res)`**
   - Requires authentication (userId from token)
   - Adds item to user's cart or increments quantity
   - Updates user's cartData in database

2. **`removeFromCart(req, res)`**
   - Requires authentication
   - Decrements item quantity in cart
   - Removes item if quantity reaches 0

3. **`getCart(req, res)`**
   - Requires authentication
   - Retrieves user's current cart data
   - Returns cart object with item IDs and quantities

---

#### `Backend/controllers/orderController.js`
**Purpose**: Order processing and payment integration

**Functions**:

1. **`placeOrder(req, res)`**
   - Requires authentication
   - Creates order document in database
   - Clears user's cart after order creation
   - Creates Stripe checkout session
   - Configures line items for Stripe (products + delivery charges)
   - Sets success/cancel URLs with order ID
   - Returns Stripe session URL for payment

2. **`verifyOrder(req, res)`**
   - Verifies payment status after Stripe redirect
   - Updates order payment status to true if successful
   - Deletes order if payment failed

3. **`userOrders(req, res)`**
   - Requires authentication
   - Retrieves all orders for logged-in user
   - Returns order history

4. **`listOrders(req, res)`**
   - Retrieves all orders (for admin)
   - Returns complete order list

5. **`updateStatus(req, res)`**
   - Updates order status (for admin)
   - Changes order status field

**Stripe Integration**:
- Currency: INR (Indian Rupees)
- Converts price to paise (price * 100 * 80)
- Includes delivery charges as separate line item

---

### Routes (`Backend/routes/`)

#### `Backend/routes/userRoute.js`
**Purpose**: User authentication routes

**Endpoints**:
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login

---

#### `Backend/routes/foodRoute.js`
**Purpose**: Product management routes

**Endpoints**:
- `POST /api/food/add` - Add new product (requires image upload via multer)
- `GET /api/food/list` - Get all products
- `POST /api/food/remove` - Remove product

**Multer Configuration**:
- Storage: Disk storage
- Destination: `uploads/` folder
- Filename: `Date.now() + originalname` (prevents naming conflicts)

---

#### `Backend/routes/cartRoute.js`
**Purpose**: Shopping cart routes (all require authentication)

**Endpoints**:
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/get` - Get user's cart

**Middleware**: All routes use `authMiddleware` to verify JWT token

---

#### `Backend/routes/orderRoute.js`
**Purpose**: Order management routes

**Endpoints**:
- `POST /api/order/place` - Create order and Stripe session (requires auth)
- `POST /api/order/verify` - Verify payment after Stripe redirect
- `POST /api/order/userorders` - Get user's orders (requires auth)
- `GET /api/order/list` - Get all orders (admin)
- `POST /api/order/status` - Update order status (admin)

---

## Frontend Documentation

### Root Files

#### `Frontend/src/main.jsx`
**Purpose**: Application entry point

**Functionality**:
- Renders React app to DOM
- Wraps app with providers:
  - `BrowserRouter`: React Router for navigation
  - `ThemeProvider`: Theme context (dark/light mode)
  - `StoreContextProvider`: Global state management

---

#### `Frontend/src/App.jsx`
**Purpose**: Main application component with routing

**Functionality**:
- Manages login popup state
- Defines application routes:
  - `/` - Home page
  - `/cart` - Shopping cart
  - `/placeorder` - Checkout page
  - `/verify` - Payment verification page
  - `/myorders` - User's order history
- Renders Navbar and Footer on all pages

**State Management**:
- `showLogin`: Controls login popup visibility

---

#### `Frontend/src/index.css`
**Purpose**: Global styles and CSS variables for theming

**Key Features**:
- CSS variables for dark/light themes
- Theme switching via `data-theme` attribute
- Global resets and base styles
- Smooth transitions for theme changes

**CSS Variables**:
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`: Background colors
- `--text-primary`, `--text-secondary`, `--text-tertiary`: Text colors
- `--accent-color`: Primary accent color (yellow)
- `--border-color`, `--card-bg`, etc.: UI element colors

---

#### `Frontend/package.json`
**Purpose**: Frontend dependencies and scripts

**Scripts**:
- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

**Dependencies**:
- `react`, `react-dom`: React library
- `react-router-dom`: Client-side routing
- `axios`: HTTP client for API calls

---

#### `Frontend/vercel.json`
**Purpose**: Vercel deployment configuration

**Configuration**:
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Rewrites: All routes redirect to `index.html` (for React Router)

---

### Context (`Frontend/src/context/`)

#### `Frontend/src/context/StoreContext.jsx`
**Purpose**: Global state management for application data

**State Variables**:
- `cartItem`: Object storing cart items `{itemId: quantity}`
- `token`: JWT authentication token
- `food_list`: Array of all products from backend

**Functions**:
- `addToCart(itemId)`: Adds item to cart (local + backend if logged in)
- `removeFromCart(itemId)`: Removes item from cart
- `getTotalCartAmount()`: Calculates total cart value
- `fetchFoodList()`: Fetches all products from API
- `loadcartData(token)`: Loads user's cart from backend

**API URL**: Uses `VITE_API_URL` environment variable (falls back to localhost)

**Persistence**: Token stored in localStorage, cart synced with backend when user is logged in

---

#### `Frontend/src/context/ThemeContext.jsx`
**Purpose**: Theme management (dark/light mode)

**Functionality**:
- Manages theme state (`dark` or `light`)
- Persists theme preference in localStorage
- Applies theme to document root via `data-theme` attribute
- Provides `toggleTheme()` function

**State**:
- `theme`: Current theme ("dark" or "light")
- `isDark`: Boolean helper

---

### Pages (`Frontend/src/Pages/`)

#### `Frontend/src/Pages/Home/Home.jsx`
**Purpose**: Home page component

**Functionality**:
- Displays hero section (Header)
- Shows category menu (ExploreMenu)
- Displays product catalog (FoodDisplay)
- Shows app download section (AppDownload)

**State**:
- `category`: Currently selected category filter ("All" or specific category)

---

#### `Frontend/src/Pages/Cart/Cart.jsx`
**Purpose**: Shopping cart page

**Functionality**:
- Displays all items in cart
- Shows item details: image, name, price, quantity, total
- Calculates subtotal, delivery fee, and total
- Allows removing items from cart
- "Checkout" button navigates to place order page

**Features**:
- Promo code input (UI only, not functional)
- Real-time cart total calculation
- Delivery fee: ₹5 (if cart not empty)

---

#### `Frontend/src/Pages/PlaceOrder/PlaceOrder.jsx`
**Purpose**: Checkout and order placement page

**Functionality**:
- Collects delivery address information:
  - First Name, Last Name
  - Email, Phone
  - Street, City, State, Zip Code, Country
- Displays cart summary with totals
- Creates order and redirects to Stripe payment
- Validates user authentication and cart contents

**Form Fields**:
- All fields are required
- Email validation
- Phone number input

**Order Creation**:
- Prepares order data with items and quantities
- Calculates total amount (cart total + delivery fee)
- Calls backend API to create Stripe session
- Redirects to Stripe checkout

---

#### `Frontend/src/Pages/Verify/Verify.jsx`
**Purpose**: Payment verification page

**Functionality**:
- Handles Stripe redirect after payment
- Extracts `success` and `orderId` from URL parameters
- Verifies payment with backend
- Redirects to `/myorders` on success
- Redirects to home on failure

**UI**: Shows loading spinner during verification

---

#### `Frontend/src/Pages/Orders/MyOrders.jsx`
**Purpose**: User order history page

**Functionality**:
- Fetches and displays user's order history
- Shows order details:
  - Order items and quantities
  - Total amount
  - Number of items
  - Order status
- "Track Order" button refreshes order list

**Data Display**:
- Order items formatted as "Item Name x Quantity"
- Status displayed with colored indicator
- Order amount in INR

---

### Components (`Frontend/src/components/`)

#### `Frontend/src/components/Navbar/Navbar.jsx`
**Purpose**: Main navigation bar

**Functionality**:
- Logo linking to home
- Navigation menu (home, menu, mobile-app, contact us)
- Theme toggle button (sun/moon icon)
- Shopping cart icon with badge (if items in cart)
- User profile dropdown (if logged in):
  - Orders link
  - Logout option
- Sign in button (if not logged in)

**Features**:
- Active menu state highlighting
- Cart badge showing item count
- Responsive design (menu hidden on mobile)

---

#### `Frontend/src/components/Footer/Footer.jsx`
**Purpose**: Footer component

**Functionality**:
- Brand information and logo
- Company links (home, delivery, privacy policy)
- Contact information (phone, email)
- Social media icons (Facebook, Twitter, LinkedIn)
- Copyright notice

**Links**:
- "home" link navigates to `/` route

---

#### `Frontend/src/components/Header/Header.jsx`
**Purpose**: Hero section on home page

**Functionality**:
- Displays hero image background
- Shows promotional text
- "View Menu" button (scrolls to menu section)

**Styling**: Responsive background image with overlay content

---

#### `Frontend/src/components/ExploreMenu/ExploreMenu.jsx`
**Purpose**: Category selection menu

**Functionality**:
- Displays category icons/images
- Allows selecting category filter
- Highlights active category
- Clicking active category resets to "All"

**Props**:
- `category`: Current selected category
- `setCategory`: Function to update category

**Data Source**: `menu_list` from assets

---

#### `Frontend/src/components/FoodItem/FoodItem.jsx`
**Purpose**: Individual product card component

**Functionality**:
- Displays product image, name, description, price
- Shows rating stars
- Add to cart button (if not in cart)
- Quantity controls (if in cart):
  - Remove button (decrements)
  - Quantity display
  - Add button (increments)

**Props**:
- `id`: Product ID
- `name`: Product name
- `price`: Product price
- `description`: Product description
- `image`: Image filename

**Image Loading**: Loads from backend `/images/` route

---

#### `Frontend/src/components/foodDisplay/FoodDisplay.jsx`
**Purpose**: Product catalog display

**Functionality**:
- Filters products by selected category
- Displays products in grid layout
- Shows "All" products or filtered by category

**Props**:
- `category`: Category filter ("All" or specific category)

**Data Source**: `food_list` from StoreContext

---

#### `Frontend/src/components/Login/LoginPopUp.jsx`
**Purpose**: Login/Registration modal

**Functionality**:
- Toggle between Login and Sign Up modes
- Form validation
- Email and password input
- Name input (only for Sign Up)
- Terms and conditions checkbox
- API calls to backend for authentication
- Stores JWT token in localStorage on success

**States**:
- `currState`: "Login" or "Sign Up"
- `data`: Form data (name, email, password)

**API Endpoints**:
- `/api/user/login` for login
- `/api/user/register` for registration

---

#### `Frontend/src/components/AppDownload/AppDownload.jsx`
**Purpose**: App download section

**Functionality**:
- Displays promotional text
- Shows app store badges (App Store, Play Store)
- Links to download pages (currently placeholder)

---

### Assets (`Frontend/src/assets/`)

#### `Frontend/src/assets/assets.js`
**Purpose**: Centralized asset imports and data

**Exports**:
- Image imports for icons, logos, food items
- `menu_list`: Array of category menu items with names and images
- All asset references used throughout the app

---

## Admin Documentation

### Root Files

#### `Admin/src/main.jsx`
**Purpose**: Admin app entry point

**Functionality**:
- Renders admin React app
- Uses React Router for navigation
- No theme provider (admin uses default styling)

---

#### `Admin/src/App.jsx`
**Purpose**: Main admin application component

**Functionality**:
- Defines admin routes:
  - `/add` - Add products page
  - `/list` - List products page
  - `/orders` - Orders management page
- Renders Navbar and Sidebar
- Passes API URL to child components

**API URL**: Uses `VITE_API_URL` environment variable

---

#### `Admin/package.json`
**Purpose**: Admin dependencies

**Key Dependencies**:
- `react-toastify`: Toast notifications for success/error messages
- `axios`: HTTP client
- `react-router-dom`: Routing

---

### Components (`Admin/src/components/`)

#### `Admin/src/components/Nabar/Navbar.jsx`
**Purpose**: Admin navigation bar

**Functionality**:
- Displays admin logo
- Simple header for admin panel

**Note**: Folder name is "Nabar" (typo, but kept for consistency)

---

#### `Admin/src/components/Sidebar/Sidebar.jsx`
**Purpose**: Admin sidebar navigation

**Functionality**:
- Navigation links:
  - Add Items
  - List Items
  - Orders
- Active route highlighting via NavLink

---

### Pages (`Admin/src/pages/`)

#### `Admin/src/pages/Add/Add.jsx`
**Purpose**: Add new products page

**Functionality**:
- Product creation form:
  - Image upload (with preview)
  - Product name
  - Description (textarea)
  - Category selection (dropdown)
  - Price input
- Form submission creates product via API
- Shows success/error toast notifications
- Resets form after successful submission

**Categories**: Same as frontend categories

**Image Upload**: Uses FormData for multipart/form-data submission

---

#### `Admin/src/pages/List/List.jsx`
**Purpose**: Product management page

**Functionality**:
- Fetches and displays all products
- Shows product table with:
  - Product image
  - Name
  - Category
  - Price
  - Remove button (X)
- Allows deleting products
- Refreshes list after deletion

**API Calls**:
- `GET /api/food/list` - Fetch products
- `POST /api/food/remove` - Delete product

---

#### `Admin/src/pages/Orders/Orders.jsx`
**Purpose**: Order management page

**Functionality**:
- Fetches all orders from database
- Displays order details:
  - Order items and quantities
  - Customer name
  - Delivery address
  - Phone number
  - Total amount
  - Order status dropdown
- Allows updating order status:
  - "Item is Getting Ready!"
  - "Out for delivery"
  - "Delivered"

**Status Updates**: Calls API to update order status

---

### Assets (`Admin/src/assets/`)

#### `Admin/src/assets/assets.js`
**Purpose**: Admin asset imports

**Exports**:
- Logo, icons, images used in admin panel
- API URL (from environment variable)

---

## API Endpoints

### User Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/api/user/register` | No | Register new user |
| POST | `/api/user/login` | No | Login user |

**Request Body (Register)**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Request Body (Login)**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt_token_here"
}
```

---

### Food/Product Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/api/food/add` | No* | Add new product |
| GET | `/api/food/list` | No | Get all products |
| POST | `/api/food/remove` | No* | Remove product |

**Add Product (multipart/form-data)**:
- `name`: Product name
- `description`: Product description
- `price`: Product price (number)
- `category`: Product category
- `image`: Image file

**Remove Product**:
```json
{
  "id": "product_id_here"
}
```

---

### Cart Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/api/cart/add` | Yes | Add item to cart |
| POST | `/api/cart/remove` | Yes | Remove item from cart |
| POST | `/api/cart/get` | Yes | Get user's cart |

**Headers**: `{ "token": "jwt_token" }`

**Request Body (Add/Remove)**:
```json
{
  "itemId": "product_id_here"
}
```

---

### Order Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/api/order/place` | Yes | Create order and Stripe session |
| POST | `/api/order/verify` | No | Verify payment |
| POST | `/api/order/userorders` | Yes | Get user's orders |
| GET | `/api/order/list` | No | Get all orders (admin) |
| POST | `/api/order/status` | No | Update order status |

**Place Order Request**:
```json
{
  "items": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 100,
      "quantity": 2
    }
  ],
  "amount": 205,
  "address": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipcode": "12345",
    "country": "Country",
    "phone": "1234567890"
  }
}
```

**Verify Payment Request**:
```json
{
  "success": "true",
  "orderId": "order_id_here"
}
```

**Update Status Request**:
```json
{
  "orderId": "order_id_here",
  "status": "Out for delivery"
}
```

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  cartData: Object {
    itemId: quantity,
    ...
  }
}
```

### Food Collection

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  image: String (filename),
  category: String
}
```

### Order Collection

```javascript
{
  _id: ObjectId,
  userId: String,
  items: Array [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  amount: Number,
  address: Object {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    phone: String
  },
  status: String,
  date: Date,
  payment: Boolean
}
```

---

## Configuration Files

### `.gitignore`
**Purpose**: Files and folders to exclude from Git

**Ignored**:
- `node_modules/` - Dependencies
- `.env` files - Environment variables
- `dist/`, `build/` - Build outputs
- `uploads/` - User-uploaded files
- OS files (`.DS_Store`, `Thumbs.db`)
- IDE files (`.vscode/`, `.idea/`)

---

### Environment Variables

#### Backend (Railway)
- `MONGO_DBurl`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `FRONTEND_URL`: Frontend deployment URL
- `ADMIN_URL`: Admin deployment URL
- `PORT`: Server port (default: 4000)

#### Frontend (Vercel)
- `VITE_API_URL`: Backend API URL

#### Admin (Vercel)
- `VITE_API_URL`: Backend API URL

---

## Deployment

### Backend (Railway)
- Platform: Railway.app
- Root Directory: `Backend`
- Build: Auto-detected (npm install)
- Start: `npm start`
- Port: Auto-assigned by Railway

### Frontend (Vercel)
- Platform: Vercel
- Root Directory: `Frontend`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### Admin (Vercel)
- Platform: Vercel
- Root Directory: `Admin`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

---

## File Upload Handling

### Backend
- Uses Multer middleware for file uploads
- Storage: Local disk (`uploads/` folder)
- Filename: `Date.now() + originalname`
- Route: `/images/:filename` serves uploaded images

### Frontend/Admin
- Images loaded from: `{API_URL}/images/{filename}`
- Admin uploads via FormData

---

## Security Features

1. **Password Hashing**: bcrypt with salt rounds 10
2. **JWT Authentication**: Token-based auth for protected routes
3. **Email Validation**: Validator library for email format
4. **Password Strength**: Minimum 8 characters
5. **CORS**: Configured for specific origins
6. **Environment Variables**: Sensitive data stored in env vars

---

## Theme System

### Implementation
- CSS variables for theme values
- `data-theme` attribute on document root
- Theme persisted in localStorage
- Smooth transitions between themes

### Theme Variables
- Dark theme: Dark backgrounds, light text
- Light theme: Light backgrounds, dark text
- Accent color remains consistent (yellow)

---

## Payment Flow

1. User fills checkout form
2. Frontend calls `/api/order/place`
3. Backend creates order in database
4. Backend creates Stripe checkout session
5. User redirected to Stripe payment page
6. After payment, Stripe redirects to `/verify?success=true&orderId=xxx`
7. Verify page calls `/api/order/verify`
8. Backend updates order payment status
9. User redirected to `/myorders`

---

## Error Handling

### Backend
- Try-catch blocks in all controllers
- Error responses: `{success: false, message: "Error"}`
- Console logging for debugging

### Frontend
- API error handling in axios calls
- User-friendly error messages
- Toast notifications in admin panel

---

## Performance Optimizations

1. **Image Optimization**: Images served as static files
2. **Lazy Loading**: Components loaded on demand
3. **State Management**: Context API for global state
4. **Route-based Code Splitting**: React Router handles splitting

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile devices
- CSS Grid and Flexbox for layouts

---

## Future Enhancements

1. Promo code functionality
2. Email notifications
3. Product search functionality
4. User reviews and ratings
5. Wishlist feature
6. Order tracking with real-time updates
7. Multi-language support
8. Cloud storage for images (AWS S3, Cloudinary)

---

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check environment variables in Railway
2. **Database Connection**: Verify MongoDB connection string
3. **Image Loading**: Ensure uploads folder exists and is accessible
4. **Payment Errors**: Check Stripe keys and URL format
5. **Build Failures**: Verify all dependencies are installed

---

## Contact & Support

For issues or questions:
- Check deployment logs in Railway/Vercel
- Review browser console for frontend errors
- Verify environment variables are set correctly
- Test API endpoints directly using Postman

---

**Documentation Version**: 1.0  
**Last Updated**: December 2025  
**Application Version**: Production

