# Sri Saravana Textile - Tapes & Wicks E-Commerce Platform

## 🧵 About Sri Saravana Textile

Sri Saravana Textile is a premium manufacturer and supplier of high-quality tapes and wicks, specializing in cotton products sold by kilogram. Our platform offers a comprehensive range of textile products including:

- **Cotton Wicks** - Pure cotton wicks for oil lamps and spiritual purposes
- **Binding Tapes** - Premium cotton binding tapes for garment finishing
- **Elastic Tapes** - High-quality elastic tapes for waistbands and cuffs
- **Twill Tapes** - Strong twill weave tapes for heavy-duty applications
- **Herringbone Tapes** - Decorative herringbone pattern tapes
- **Fabric Tapes** - Versatile fabric tapes for multiple applications

## 🌟 Key Features

### For Customers:
- **Product Catalog** - Browse extensive collection of tapes and wicks
- **User Registration & Login** - Secure user authentication system
- **Shopping Cart** - Add products and manage quantities (sold by kg)
- **Wishlist** - Save favorite products for later
- **Product Comparison** - Compare specifications across products
- **Detailed Product Info** - Comprehensive specifications including material, width, color, tensile strength
- **Search & Filter** - Advanced filtering by category, price, brand, and rating
- **Responsive Design** - Works seamlessly on all devices

### For Admin (Shop Owner):
- **Admin Dashboard** - Comprehensive management interface
- **Product Management** - Add, edit, and manage textile inventory
- **Stock Management** - Track stock levels and minimum order quantities
- **Order Management** - Process and track customer orders
- **Single Admin Access** - Only the shop owner can access admin features

## 🗂️ Product Categories

1. **Tapes**
   - Binding Tapes
   - Fabric Tapes
   - Elastic Tapes
   - Twill Tapes
   - Herringbone Tapes

2. **Wicks**
   - Cotton Wicks (Round)
   - Cotton Wicks (Flat)
   - Traditional Braided Wicks

## 🛠️ Technical Stack

### Frontend:
- **React.js** - Modern JavaScript framework
- **CSS3** - Custom styling with responsive design
- **JavaScript ES6+** - Modern JavaScript features

### Backend:
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database for data storage (Database: SST)
- **Mongoose** - MongoDB object modeling

### Security:
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sri-saravana-textile
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Start MongoDB**
   - For local MongoDB: Start your MongoDB service
   - For MongoDB Atlas: Ensure your connection string is configured

4. **Start the application**
   ```bash
   # Start backend server (includes automatic database setup)
   cd backend
   node server.js
   
   # In a new terminal, start frontend
   cd ..
   npm start
   ```

### Automatic Database Setup
The server now automatically sets up the database when it starts:
- Creates admin user (username: `sst_admin`, password: `SST@2025`)
- Populates database with 8 sample textile products
- Only runs setup if data doesn't already exist

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: Login with credentials above

## 📁 Project Structure

```
SST/
├── backend/
│   ├── server.js              # Main server with SST database
│   ├── createAdmin.js         # Admin user creation
│   ├── setupDatabase.js       # Database setup with textile products
│   └── package.json           # Backend dependencies
├── src/
│   ├── components/
│   │   ├── Home.js            # Main textile products page
│   │   ├── AdminDashboard.js  # Admin interface for product management
│   │   ├── Login.js           # User authentication
│   │   ├── Cart.js            # Shopping cart for kg-based purchases
│   │   └── *.css              # Component styles
│   └── data/
│       └── products.js        # Sample textile products data
└── package.json               # Frontend dependencies
```

## 🎯 Database Information

- **Database Name:** SST (MongoDB)
- **Collections:** 
  - `products` - Textile products (tapes & wicks)
  - `users` - Customer accounts
  - `admins` - Admin account (shop owner only)
  - `orders` - Customer orders

## 🎨 Product Features

- **Multiple Varieties:** Different sizes and colors of tapes and wicks
- **Kilogram-based Sales:** All products sold by weight (Kg)
- **Detailed Specifications:** Material, width, thickness, tensile strength, etc.
- **Stock Management:** Real-time inventory tracking
- **Minimum Orders:** Configurable minimum order quantities

## 📱 User Features

- **Customer Registration/Login** - Full user authentication system
- **Browse Products** - Extensive catalog of tapes and wicks
- **Shopping Cart** - Add products by kilogram quantities
- **Wishlist & Compare** - Save and compare products
- **Product Search** - Advanced filtering and search capabilities

## 🔐 Admin Features (Shop Owner Only)

- **Single Admin Login** - Only the textile shop owner has admin access
- **Product Management** - Add, edit, delete textile products
- **Inventory Control** - Manage stock levels and pricing
- **Order Processing** - Handle customer orders

---

**Sri Saravana Textile - Premium Tapes & Wicks Manufacturer** 🧵
- Admin dashboard for product management
- Responsive design for mobile and desktop

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
