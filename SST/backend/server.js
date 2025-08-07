const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT) || 8001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (supports both local and cloud)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SST';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
  socketTimeoutMS: 45000, // 45 seconds socket timeout
})
.then(() => {
  console.log('✅ MongoDB SST database connected successfully');
  console.log(`📍 Connected to: ${MONGODB_URI.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas (Cloud)'}`);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  console.log('💡 Tip: Check your internet connection and MongoDB Atlas whitelist settings');
});

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  cart: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  wishlist: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  compare: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Enhanced Product Schema for Tapes and Wicks
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    default: 'Sri Saravana Textile'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['Tapes', 'Wicks', 'Cotton Wicks', 'Fabric Tapes', 'Binding Tapes', 'Elastic Tapes', 'Twill Tapes', 'Herringbone Tapes']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  specifications: {
    material: String, // Cotton, Polyester, Nylon, etc.
    width: String, // Width in mm or inches
    thickness: String, // Thickness in mm
    color: String,
    pattern: String,
    length: String, // Length available per kg
    weight: String, // Weight per meter
    tensileStrength: String,
    washable: String,
    shrinkage: String,
    origin: String,
    gsm: String, // Grams per square meter
    weave: String // Plain, Twill, etc.
  },
  features: [String],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    default: 'Kg',
    enum: ['Kg', 'Meters', 'Pieces']
  },
  minimumOrder: {
    type: Number,
    default: 1,
    min: 1
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod'],
    default: 'cod'
  },
  couponCode: String,
  discount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  },
  shopName: {
    type: String,
    default: 'Sri Saravana Textile'
  }
});

const Admin = mongoose.model('Admin', adminSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to verify admin role
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// User Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;
    
    // Force role to be 'user' only - admin accounts are created separately
    const role = 'user';

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// User Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Admin Routes

// Admin login route
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { adminId: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Enhanced Add Product Route
app.post('/api/admin/products', async (req, res) => {
  try {
    const {
      name, brand, price, originalPrice, images, category, description,
      specifications, features, stock
    } = req.body;

    const newProduct = new Product({
      name,
      brand,
      price,
      originalPrice,
      images,
      category,
      description,
      specifications,
      features,
      stock
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product'
    });
  }
});

// Get All Products for Users
app.get('/api/products', async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sortBy, 
      isNew, 
      inStock 
    } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by new products
    if (isNew === 'true') {
      query.isNew = true;
    }

    // Filter by stock
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    let products = await Product.find(query);

    // Sort products
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          products = products.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          products = products.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          products = products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          products = products.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          products = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
});

// Search products
app.get('/api/products/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    });
    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products'
    });
  }
});

// Filter products
app.post('/api/products/filter', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, brand, rating } = req.body;
    let filter = { isActive: true };

    if (category && category !== 'All') filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (rating) filter.rating = { $gte: rating };

    const products = await Product.find(filter);
    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error filtering products'
    });
  }
});

// Create Order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentMethod, couponCode, discount } = req.body;

    const newOrder = new Order({
      userId: req.user.userId,
      items,
      total,
      shippingAddress,
      paymentMethod,
      couponCode,
      discount
    });

    await newOrder.save();

    // Update stock for each item
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
});

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// Enhanced Admin Product Routes

// Update product
app.put('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      product: deletedProduct
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
});

// Get admin dashboard stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    const outOfStock = await Product.countDocuments({ stock: 0 });
    
    const recentOrders = await Order.find()
      .populate('userId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        outOfStock
      },
      recentOrders
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
});

// ====== CART ROUTES ======

// Get user's cart
app.get('/api/user/cart', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('cart.productId')
      .select('cart');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Filter out any cart items where the product no longer exists
    const validCartItems = user.cart.filter(item => item.productId);
    
    res.json({
      success: true,
      cart: validCartItems
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart' });
  }
});

// Add item to cart
app.post('/api/user/cart', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(item => 
      item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({ productId, quantity });
    }

    await user.save();

    // Return updated cart with populated product data
    const updatedUser = await User.findById(userId)
      .populate('cart.productId')
      .select('cart');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: updatedUser.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Error adding to cart' });
  }
});

// Update cart item quantity
app.put('/api/user/cart/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartItemIndex = user.cart.findIndex(item => 
      item.productId.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('cart.productId')
      .select('cart');

    res.json({
      success: true,
      message: 'Cart updated',
      cart: updatedUser.cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Error updating cart' });
  }
});

// Remove item from cart
app.delete('/api/user/cart/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.cart = user.cart.filter(item => 
      item.productId.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('cart.productId')
      .select('cart');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedUser.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Error removing from cart' });
  }
});

// Clear entire cart
app.delete('/api/user/cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await User.findByIdAndUpdate(userId, { cart: [] });

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Error clearing cart' });
  }
});

// ====== WISHLIST ROUTES ======

// Get user's wishlist
app.get('/api/user/wishlist', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('wishlist.productId')
      .select('wishlist');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const validWishlistItems = user.wishlist.filter(item => item.productId);
    
    res.json({
      success: true,
      wishlist: validWishlistItems
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error fetching wishlist' });
  }
});

// Add item to wishlist
app.post('/api/user/wishlist', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if item already exists in wishlist
    const existingItem = user.wishlist.find(item => 
      item.productId.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ success: false, message: 'Item already in wishlist' });
    }

    user.wishlist.push({ productId });
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('wishlist.productId')
      .select('wishlist');

    res.json({
      success: true,
      message: 'Item added to wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error adding to wishlist' });
  }
});

// Remove item from wishlist
app.delete('/api/user/wishlist/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(item => 
      item.productId.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('wishlist.productId')
      .select('wishlist');

    res.json({
      success: true,
      message: 'Item removed from wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error removing from wishlist' });
  }
});

// ====== COMPARE ROUTES ======

// Get user's compare list
app.get('/api/user/compare', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('compare.productId')
      .select('compare');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const validCompareItems = user.compare.filter(item => item.productId);
    
    res.json({
      success: true,
      compare: validCompareItems
    });
  } catch (error) {
    console.error('Get compare error:', error);
    res.status(500).json({ success: false, message: 'Error fetching compare list' });
  }
});

// Add item to compare
app.post('/api/user/compare', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if compare list is already full (max 3 items)
    if (user.compare.length >= 3) {
      return res.status(400).json({ success: false, message: 'Compare list is full. Maximum 3 items allowed.' });
    }

    // Check if item already exists in compare list
    const existingItem = user.compare.find(item => 
      item.productId.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ success: false, message: 'Item already in compare list' });
    }

    user.compare.push({ productId });
    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('compare.productId')
      .select('compare');

    res.json({
      success: true,
      message: 'Item added to compare list',
      compare: updatedUser.compare
    });
  } catch (error) {
    console.error('Add to compare error:', error);
    res.status(500).json({ success: false, message: 'Error adding to compare list' });
  }
});

// Remove item from compare
app.delete('/api/user/compare/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.compare = user.compare.filter(item => 
      item.productId.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('compare.productId')
      .select('compare');

    res.json({
      success: true,
      message: 'Item removed from compare list',
      compare: updatedUser.compare
    });
  } catch (error) {
    console.error('Remove from compare error:', error);
    res.status(500).json({ success: false, message: 'Error removing from compare list' });
  }
});

// Clear entire compare list
app.delete('/api/user/compare', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await User.findByIdAndUpdate(userId, { compare: [] });

    res.json({
      success: true,
      message: 'Compare list cleared',
      compare: []
    });
  } catch (error) {
    console.error('Clear compare error:', error);
    res.status(500).json({ success: false, message: 'Error clearing compare list' });
  }
});

// Sample textile products data for initial setup
const sampleTextileProducts = [
  {
    name: "Cotton Binding Tape 25mm - White",
    brand: "Sri Saravana Textile",
    price: 180,
    originalPrice: 220,
    category: "Binding Tapes",
    description: "Premium quality cotton binding tape suitable for garment finishing, bag making, and craft projects. Soft texture with excellent durability.",
    specifications: {
      material: "100% Cotton",
      width: "25mm",
      thickness: "1.2mm",
      color: "White",
      pattern: "Plain",
      length: "500 meters per kg",
      weight: "2 grams per meter",
      tensileStrength: "150 N",
      washable: "Yes",
      shrinkage: "2-3%",
      gsm: "200",
      weave: "Plain",
      origin: "Tamil Nadu, India"
    },
    features: [
      "High tensile strength for durability",
      "Colorfast - won't bleed or fade",
      "Machine washable and dry cleanable", 
      "Soft texture for comfortable wear",
      "Eco-friendly cotton material",
      "Pre-shrunk to minimize further shrinkage"
    ],
    images: [
      "https://images.unsplash.com/photo-1586281010691-3d33ac5e7f4c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1559532173-d402e50b5fac?w=400&h=400&fit=crop"
    ],
    stock: 45,
    unit: "Kg",
    minimumOrder: 1,
    rating: 4.7
  },
  {
    name: "Cotton Wicks Round 3mm - Natural",
    brand: "Sri Saravana Textile", 
    price: 320,
    originalPrice: 380,
    category: "Cotton Wicks",
    description: "Pure cotton wicks for oil lamps, diyas, and spiritual purposes. Made from finest cotton fibers for consistent burning.",
    specifications: {
      material: "100% Pure Cotton",
      width: "3mm",
      thickness: "3mm", 
      color: "Natural White",
      pattern: "Round Braided",
      length: "2000 meters per kg",
      weight: "0.5 grams per meter",
      tensileStrength: "80 N",
      washable: "No",
      shrinkage: "Minimal",
      gsm: "50",
      weave: "Braided",
      origin: "Tamil Nadu, India"
    },
    features: [
      "Pure cotton for clean burning",
      "Consistent flame without smoke",
      "Long burning duration",
      "Spiritual and decorative use",
      "Eco-friendly and biodegradable",
      "Traditional hand-braided quality"
    ],
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551845041-63ad1e87d46d?w=400&h=400&fit=crop"
    ],
    stock: 28,
    unit: "Kg", 
    minimumOrder: 2,
    rating: 4.9
  },
  {
    name: "Elastic Tape 12mm - Black",
    brand: "Sri Saravana Textile",
    price: 240,
    originalPrice: 280,
    category: "Elastic Tapes",
    description: "High-quality elastic tape perfect for waistbands, cuffs, and stretchable garment applications. Excellent stretch recovery.",
    specifications: {
      material: "Cotton Polyester Blend with Rubber Core",
      width: "12mm",
      thickness: "2mm",
      color: "Black",
      pattern: "Plain",
      length: "800 meters per kg", 
      weight: "1.25 grams per meter",
      tensileStrength: "200 N",
      washable: "Yes",
      shrinkage: "1-2%",
      gsm: "125",
      weave: "Knitted", 
      origin: "Tamil Nadu, India"
    },
    features: [
      "Superior stretch and recovery",
      "Heat resistant up to 60°C",
      "Chlorine resistant for swimwear",
      "Latex-free and skin-friendly", 
      "Colorfast dye technology",
      "Pre-tested for durability"
    ],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop"
    ],
    stock: 52,
    unit: "Kg",
    minimumOrder: 1,
    rating: 4.6
  },
  {
    name: "Twill Tape 20mm - Khaki",
    brand: "Sri Saravana Textile",
    price: 195,
    originalPrice: 235,
    category: "Twill Tapes",
    description: "Strong twill weave tape ideal for reinforcement, straps, and heavy-duty applications. Military-grade quality.",
    specifications: {
      material: "100% Cotton Twill",
      width: "20mm", 
      thickness: "1.5mm",
      color: "Khaki",
      pattern: "Diagonal Twill",
      length: "600 meters per kg",
      weight: "1.67 grams per meter",
      tensileStrength: "300 N",
      washable: "Yes",
      shrinkage: "2%",
      gsm: "167",
      weave: "Twill",
      origin: "Tamil Nadu, India"
    },
    features: [
      "Military-grade strength and durability",
      "Diagonal weave for extra strength",
      "Fade-resistant natural dyes",
      "Suitable for outdoor applications",
      "Machine washable up to 90°C",
      "Fraying resistant edges"
    ],
    images: [
      "https://images.unsplash.com/photo-1582735689369-4fe89db0853c?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1566479179817-78fc5a4b2b4f?w=400&h=400&fit=crop"
    ],
    stock: 38,
    unit: "Kg",
    minimumOrder: 1,
    rating: 4.8
  },
  {
    name: "Herringbone Tape 15mm - Navy Blue",
    brand: "Sri Saravana Textile",
    price: 210,
    originalPrice: 250,
    category: "Herringbone Tapes",
    description: "Premium herringbone pattern tape for decorative and functional applications. Classic design with modern durability.",
    specifications: {
      material: "Cotton Polyester Blend",
      width: "15mm",
      thickness: "1.3mm", 
      color: "Navy Blue",
      pattern: "Herringbone",
      length: "700 meters per kg",
      weight: "1.43 grams per meter",
      tensileStrength: "180 N",
      washable: "Yes",
      shrinkage: "1.5%",
      gsm: "143",
      weave: "Herringbone",
      origin: "Tamil Nadu, India"
    },
    features: [
      "Classic herringbone pattern",
      "Decorative and functional",
      "Colorfast premium dyes",
      "Smooth finish for comfort",
      "Versatile for multiple uses", 
      "Professional appearance"
    ],
    images: [
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618047-61c5f888334d?w=400&h=400&fit=crop"
    ],
    stock: 35,
    unit: "Kg",
    minimumOrder: 2,
    rating: 4.7
  },
  {
    name: "Fabric Tape 30mm - Red",
    brand: "Sri Saravana Textile",
    price: 165,
    originalPrice: 200,
    category: "Fabric Tapes", 
    description: "Versatile fabric tape suitable for binding, trimming, and decorative purposes. Vibrant red color for eye-catching applications.",
    specifications: {
      material: "100% Cotton Fabric",
      width: "30mm",
      thickness: "1mm",
      color: "Red", 
      pattern: "Plain",
      length: "450 meters per kg",
      weight: "2.22 grams per meter",
      tensileStrength: "120 N",
      washable: "Yes",
      shrinkage: "3%",
      gsm: "222",
      weave: "Plain",
      origin: "Tamil Nadu, India"
    },
    features: [
      "Vibrant colorfast dyes",
      "Soft fabric texture",
      "Easy to work with",
      "Multiple decorative uses",
      "Iron-friendly material",
      "Budget-friendly option"
    ],
    images: [
      "https://images.unsplash.com/photo-1517707209946-5ff15023c749?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    ],
    stock: 42,
    unit: "Kg",
    minimumOrder: 1,
    rating: 4.5
  },
  {
    name: "Cotton Wicks Flat 5mm - Natural",
    brand: "Sri Saravana Textile",
    price: 280,
    originalPrice: 330,
    category: "Cotton Wicks",
    description: "Premium flat cotton wicks for oil lamps and traditional lighting. Provides steady, smokeless flame.",
    specifications: {
      material: "100% Pure Cotton",
      width: "5mm",
      thickness: "1mm",
      color: "Natural White",
      pattern: "Flat Woven",
      length: "1500 meters per kg",
      weight: "0.67 grams per meter", 
      tensileStrength: "60 N",
      washable: "No",
      shrinkage: "Minimal",
      gsm: "67",
      weave: "Plain",
      origin: "Tamil Nadu, India"
    },
    features: [
      "Traditional flat wick design",
      "Clean burning without smoke", 
      "Long-lasting flame",
      "Pure cotton for spiritual use",
      "Handcrafted quality",
      "Eco-friendly material"
    ],
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551845041-63ad1e87d46d?w=400&h=400&fit=crop"
    ],
    stock: 31,
    unit: "Kg",
    minimumOrder: 2,
    rating: 4.8
  },
  {
    name: "Elastic Tape 20mm - White",
    brand: "Sri Saravana Textile",
    price: 285,
    originalPrice: 340,
    category: "Elastic Tapes",
    description: "Wide elastic tape perfect for waistbands and wide applications. Superior stretch and recovery properties.",
    specifications: {
      material: "Cotton Spandex Blend",
      width: "20mm",
      thickness: "2.5mm",
      color: "White",
      pattern: "Plain",
      length: "600 meters per kg",
      weight: "1.67 grams per meter",
      tensileStrength: "250 N",
      washable: "Yes",
      shrinkage: "1%",
      gsm: "167",
      weave: "Knitted",
      origin: "Tamil Nadu, India"
    },
    features: [
      "Extra wide for waistbands",
      "Premium stretch recovery",
      "Comfortable against skin",
      "Heat and chemical resistant",
      "Professional grade quality",
      "Long-lasting elasticity"
    ],
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop"
    ],
    stock: 29,
    unit: "Kg",
    minimumOrder: 1,
    rating: 4.9
  }
];

// Database initialization function
async function initializeDatabase() {
  try {
    console.log('\n🔄 Initializing SST Database...');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'sst_admin' });
    
    if (!existingAdmin) {
      // Create admin user
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('SST@2025', saltRounds);

      const admin = new Admin({
        username: 'sst_admin',
        password: hashedPassword,
        role: 'admin',
        shopName: 'Sri Saravana Textile'
      });

      await admin.save();
      console.log('✅ Admin created successfully!');
      console.log('Admin Username: sst_admin');
      console.log('Admin Password: SST@2025');
    } else {
      console.log('📋 Admin already exists');
    }

    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      // Insert sample products
      await Product.insertMany(sampleTextileProducts);
      console.log(`✅ ${sampleTextileProducts.length} textile products added successfully!`);
    } else {
      console.log(`📦 Database already has ${existingProducts} products`);
    }
    
    console.log('\n🎉 Database initialization completed!');
    console.log('📝 Summary:');
    console.log(`• Database: SST (MongoDB)`);
    console.log(`• Admin User: sst_admin / SST@2025`);
    console.log(`• Total Products: ${await Product.countDocuments()}`);
    console.log(`• Categories: Tapes, Wicks, Cotton Wicks, Fabric Tapes, Binding Tapes, Elastic Tapes, Twill Tapes, Herringbone Tapes`);
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Start server with automatic database setup
const server = app.listen(PORT, async () => {
  console.log(`🚀 Sri Saravana Textile Server running on port ${PORT}`);
  
  // Wait for MongoDB connection before initializing database
  try {
    await mongoose.connection.asPromise();
    console.log('📡 Database connection established, initializing...');
    await initializeDatabase();
  } catch (error) {
    console.error('❌ Failed to establish database connection:', error);
    console.log('⚠️  Server running without database initialization');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying port ${PORT + 1}`);
    const fallbackServer = app.listen(PORT + 1, async () => {
      console.log(`🚀 Sri Saravana Textile Server running on port ${PORT + 1}`);
      
      // Wait for MongoDB connection before initializing database
      try {
        await mongoose.connection.asPromise();
        console.log('📡 Database connection established, initializing...');
        await initializeDatabase();
      } catch (error) {
        console.error('❌ Failed to establish database connection:', error);
        console.log('⚠️  Server running without database initialization');
      }
    });
    
    fallbackServer.on('error', (fallbackErr) => {
      if (fallbackErr.code === 'EADDRINUSE') {
        console.log(`Port ${PORT + 1} is also busy, trying port ${PORT + 2}`);
        app.listen(PORT + 2, async () => {
          console.log(`🚀 Sri Saravana Textile Server running on port ${PORT + 2}`);
          
          // Wait for MongoDB connection before initializing database
          try {
            await mongoose.connection.asPromise();
            console.log('📡 Database connection established, initializing...');
            await initializeDatabase();
          } catch (error) {
            console.error('❌ Failed to establish database connection:', error);
            console.log('⚠️  Server running without database initialization');
          }
        });
      }
    });
  } else {
    console.error('Server error:', err);
  }
});
