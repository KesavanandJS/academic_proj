import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: 'Sri Saravana Textile',
    price: '',
    originalPrice: '',
    images: [''],
    category: 'Tapes',
    description: '',
    specifications: {
      material: '',
      width: '',
      thickness: '',
      color: '',
      pattern: '',
      length: '',
      weight: '',
      tensileStrength: '',
      washable: '',
      shrinkage: '',
      origin: '',
      gsm: '',
      weave: ''
    },
    features: [''],
    stock: '',
    unit: 'Kg',
    minimumOrder: 1
  });

  const categories = ['Tapes', 'Wicks', 'Cotton Wicks', 'Fabric Tapes', 'Binding Tapes', 'Elastic Tapes', 'Twill Tapes', 'Herringbone Tapes'];
  const units = ['Kg', 'Meters', 'Pieces'];
  const orderStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products');
      const result = await response.json();
      if (result.success) {
        setProducts(result.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/analytics');
      const data = await response.json();
      setAnalytics(data || {});
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics({});
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchProducts(); // Refresh products
        setShowConfirmDelete(null);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchUsers(); // Refresh users
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewProduct(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      brand: 'Sri Saravana Textile',
      price: '',
      originalPrice: '',
      images: [''],
      category: 'Tapes',
      description: '',
      specifications: {
        material: '',
        width: '',
        thickness: '',
        color: '',
        pattern: '',
        length: '',
        weight: '',
        tensileStrength: '',
        washable: '',
        shrinkage: '',
        origin: '',
        gsm: '',
        weave: ''
      },
      features: [''],
      stock: '',
      unit: 'Kg',
      minimumOrder: 1
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          addedBy: admin?.username || 'admin'
        })
      });

      const result = await response.json();
      if (result.success) {
        setProducts([result.product, ...products]);
        resetForm();
        setShowAddForm(false);
        alert('Product added successfully!');
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Only show admin dashboard if user has admin role
  if (admin.role !== 'admin') {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1>Access Denied</h1>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
        <div className="admin-main">
          <p>You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>Sri Saravana Textile - Admin Dashboard</h1>
          <div className="admin-nav">
            <span className="welcome-text">Welcome, {admin?.username || 'Admin'}</span>
            <button onClick={onLogout} className="logout-btn">
              <i className="logout-icon">🚪</i> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        <nav className="admin-sidebar">
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="menu-icon">📊</span>
              Dashboard
            </button>
            <button 
              className={`menu-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <span className="menu-icon">📦</span>
              Products
            </button>
            <button 
              className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span className="menu-icon">🛒</span>
              Orders
            </button>
            <button 
              className={`menu-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="menu-icon">👥</span>
              Users
            </button>
            <button 
              className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="menu-icon">⚙️</span>
              Settings
            </button>
          </div>
        </nav>

        <main className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-tab">
              <div className="tab-header">
                <h2>Dashboard Overview</h2>
                <div className="header-actions">
                  <button className="refresh-btn" onClick={() => {
                    fetchProducts();
                    fetchOrders();
                    fetchUsers();
                    fetchAnalytics();
                  }}>
                    🔄 Refresh
                  </button>
                </div>
              </div>

              <div className="dashboard-stats">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <h3>Total Products</h3>
                    <p className="stat-number">{products.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <h3>In Stock</h3>
                    <p className="stat-number">{products.filter(p => p.stock > 0).length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">❌</div>
                  <div className="stat-content">
                    <h3>Out of Stock</h3>
                    <p className="stat-number">{products.filter(p => p.stock === 0).length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🛒</div>
                  <div className="stat-content">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{orders.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h3>Total Users</h3>
                    <p className="stat-number">{users.length}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🧵</div>
                  <div className="stat-content">
                    <h3>Tapes & Wicks</h3>
                    <p className="stat-number">{products.filter(p => p.category.includes('Tape') || p.category.includes('Wick')).length}</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-charts">
                <div className="chart-card">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">📦</span>
                      <span>Latest product added</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">🛒</span>
                      <span>Recent orders: {orders.slice(0, 3).length}</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">👥</span>
                      <span>New users registered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="products-tab">
              <div className="tab-header">
                <h2>Product Management</h2>
                <div className="header-actions">
                  <button 
                    onClick={() => setShowAddForm(!showAddForm)} 
                    className="add-btn"
                  >
                    <span className="btn-icon">➕</span>
                    {showAddForm ? 'Cancel' : 'Add Product'}
                  </button>
                </div>
              </div>

              {showAddForm && (
                <div className="add-product-form">
                  <h3>🧵 Add New Tape/Wick Product</h3>
                  <form onSubmit={handleAddProduct}>
                    <div className="form-section">
                      <h4>📋 Basic Information</h4>
                      <div className="form-row">
                        <input
                          type="text"
                          name="name"
                          placeholder="Product Name (e.g., Cotton Tape 25mm)"
                          value={newProduct.name}
                          onChange={handleInputChange}
                          required
                        />
                        <input
                          type="text"
                          name="brand"
                          placeholder="Brand"
                          value={newProduct.brand}
                          onChange={handleInputChange}
                          required
                          readOnly
                        />
                      </div>
                      <div className="form-row">
                        <input
                          type="number"
                          name="price"
                          placeholder="Price per Kg (₹)"
                          value={newProduct.price}
                          onChange={handleInputChange}
                          required
                        />
                        <input
                          type="number"
                          name="originalPrice"
                          placeholder="Original Price (₹)"
                          value={newProduct.originalPrice}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-row">
                        <select
                          name="category"
                          value={newProduct.category}
                          onChange={handleInputChange}
                          required
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <select
                          name="unit"
                          value={newProduct.unit}
                          onChange={handleInputChange}
                          required
                        >
                          {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-row">
                        <input
                          type="number"
                          name="stock"
                          placeholder="Stock Quantity"
                          value={newProduct.stock}
                          onChange={handleInputChange}
                          required
                        />
                        <input
                          type="number"
                          name="minimumOrder"
                          placeholder="Minimum Order"
                          value={newProduct.minimumOrder}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="submit-btn">Add Product</button>
                      <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Date Added</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="no-products">
                          No products found. Add your first product!
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product._id || product.id}>
                          <td>
                            <div className="product-info">
                              <strong>{product.name}</strong>
                              <span className="product-brand">{product.brand}</span>
                            </div>
                          </td>
                          <td>
                            <span className="category-badge">{product.category}</span>
                          </td>
                          <td>
                            <div className="price-info">
                              <span className="current-price">{formatPrice(product.price)}</span>
                              {product.originalPrice && (
                                <span className="original-price">{formatPrice(product.originalPrice)}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                              {product.stock > 0 ? `${product.stock} ${product.unit || 'Kg'}` : 'Out of Stock'}
                            </span>
                          </td>
                          <td>
                            {new Date(product.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="edit-btn"
                                onClick={() => setEditingProduct(product)}
                              >
                                ✏️
                              </button>
                              <button 
                                className="delete-btn"
                                onClick={() => setShowConfirmDelete(product)}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-tab">
              <div className="tab-header">
                <h2>Order Management</h2>
                <div className="header-actions">
                  <button className="filter-btn">🔍 Filter Orders</button>
                </div>
              </div>

              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="no-orders">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id || order.id}>
                          <td>#{order._id?.slice(-6) || order.id}</td>
                          <td>
                            <div className="customer-info">
                              <strong>{order.customerName || 'Anonymous'}</strong>
                              <span>{order.customerEmail}</span>
                            </div>
                          </td>
                          <td>{order.items?.length || 0} items</td>
                          <td>{formatPrice(order.total || 0)}</td>
                          <td>
                            <select 
                              value={order.status || 'pending'}
                              onChange={(e) => updateOrderStatus(order._id || order.id, e.target.value)}
                              className={`status-select ${order.status || 'pending'}`}
                            >
                              {orderStatuses.map(status => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                          <td>
                            <button 
                              className="view-btn"
                              onClick={() => setSelectedOrder(order)}
                            >
                              👁️ View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-tab">
              <div className="tab-header">
                <h2>User Management</h2>
                <div className="header-actions">
                  <button className="export-btn">📊 Export Users</button>
                </div>
              </div>

              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="no-users">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user._id || user.id}>
                          <td>
                            <div className="user-info">
                              <strong>{user.username || user.name}</strong>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role || 'user'}`}>
                              {user.role || 'User'}
                            </span>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                          <td>
                            <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="edit-btn"
                                onClick={() => console.log('Edit user:', user._id)}
                              >
                                ✏️
                              </button>
                              {user.role !== 'admin' && (
                                <button 
                                  className="delete-btn"
                                  onClick={() => deleteUser(user._id || user.id)}
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="tab-header">
                <h2>System Settings</h2>
              </div>

              <div className="settings-sections">
                <div className="settings-card">
                  <h3>🏪 Store Settings</h3>
                  <div className="settings-group">
                    <label>Store Name</label>
                    <input type="text" defaultValue="Sri Saravana Textile" />
                  </div>
                  <div className="settings-group">
                    <label>Store Description</label>
                    <textarea defaultValue="Premium quality tapes and wicks manufacturer"></textarea>
                  </div>
                  <div className="settings-group">
                    <label>Contact Email</label>
                    <input type="email" defaultValue="info@ssttextile.com" />
                  </div>
                  <button className="save-btn">💾 Save Changes</button>
                </div>

                <div className="settings-card">
                  <h3>🔐 Security Settings</h3>
                  <div className="settings-group">
                    <label>Change Admin Password</label>
                    <input type="password" placeholder="New Password" />
                  </div>
                  <div className="settings-group">
                    <label>Confirm Password</label>
                    <input type="password" placeholder="Confirm Password" />
                  </div>
                  <button className="save-btn">🔒 Update Password</button>
                </div>

                <div className="settings-card">
                  <h3>📊 System Info</h3>
                  <div className="info-group">
                    <span>Total Products: {products.length}</span>
                    <span>Total Orders: {orders.length}</span>
                    <span>Total Users: {users.length}</span>
                    <span>System Version: 1.0.0</span>
                  </div>
                </div>

                <div className="settings-card danger-zone">
                  <h3>⚠️ Danger Zone</h3>
                  <p>These actions cannot be undone. Please be careful.</p>
                  <div className="danger-actions">
                    <button className="danger-btn">🗑️ Clear All Data</button>
                    <button className="danger-btn">🔄 Reset System</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modals */}
      {showConfirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>🗑️ Delete Product</h3>
            <p>Are you sure you want to delete "{showConfirmDelete.name}"?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="confirm-btn"
                onClick={() => deleteProduct(showConfirmDelete._id || showConfirmDelete.id)}
              >
                Yes, Delete
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setShowConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="modal-overlay">
          <div className="order-modal">
            <div className="modal-header">
              <h3>📋 Order Details - #{selectedOrder._id?.slice(-6)}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="order-info">
                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Total:</strong> {formatPrice(selectedOrder.total)}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="order-items">
                <h4>Items:</h4>
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
