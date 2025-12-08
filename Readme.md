# QuickCart - Grocery Management System

**QuickCart** is a fully responsive web-based grocery management system designed to simplify online grocery shopping and management. It provides an intuitive user interface for customers to explore the grocery catalog, add items to the cart, view the total cost, and proceed to checkout with Stripe payment integration. On the administrative side, QuickCart allows administrators to manage the grocery inventory by adding, updating, and removing products, as well as tracking orders and updating order statuses efficiently.

**Tech Stack**:  
- **Frontend**: Vite + React
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Payment Gateway**: Stripe

## Features
- **User**: Browse the grocery catalog, add items to cart, view total, and checkout for payment.
- **Admin**: Add, remove, and list grocery products; manage orders and update order status.
- Fully responsive interface adaptable to any device.
- Real-time inventory management for grocery items.
- Secure payment processing with Stripe integration.
- Order tracking and delivery management system.

## Setup Instructions

### 1. Project Structure
This repository contains three main folders:
   - **Frontend**: Contains the user interface code.
   - **Backend**: Manages backend logic, including database operations and authentication.
   - **Admin**: Contains the admin interface.

### 2. Prerequisites
- **Node.js** and **npm** installed on your machine.
- **MongoDB** account with a configured cluster.
- **Stripe** account for payment functionality.

### 3. Steps to Clone and Run Locally

#### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/QuickCart.git
```
Or download the zip file and extract it.

#### Step 2: Frontend Setup (User Interface)
1. Navigate to the `Frontend` folder:
   ```bash
   cd QuickCart/Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the localhost link from the console to view the frontend interface.

#### Step 3: Backend Setup
1. Configure MongoDB:
   - Create a MongoDB account and set up a cluster.
   - Obtain the MongoDB connection URI and add it to `db.js` in `Backend/config`.
2. Configure Environment Variables:
   - Create a `.env` file in the `Backend` folder and add the following keys:
     ```plaintext
     JWT_SECRET="random#secret"
     STRIPE_SECRET_KEY="your_stripe_secret_key"
     ```
3. Start the backend server:
   - In a new terminal, navigate to the `Backend` folder:
     ```bash
     cd QuickCart/Backend
     ```
   - Start the backend server:
     ```bash
     npm run server
     ```
   - The backend should be running on `localhost:4000`.

#### Step 4: Admin Interface Setup
1. In a new terminal, navigate to the `Admin` folder:
   ```bash
   cd QuickCart/Admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the admin development server:
   ```bash
   npm run dev
   ```
4. Access the admin interface via the localhost link in the console.

