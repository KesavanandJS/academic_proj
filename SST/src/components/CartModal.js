import React from 'react';
import './CartModal.css';

const CartModal = ({ cart, setCart, onClose, updateCartQuantity, removeFromCart }) => {
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    updateCartQuantity(productId, newQuantity);
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Shopping Cart ({getTotalItems()} items)</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <h4>Your cart is empty</h4>
              <p>Add some products to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item._id} className="cart-item">
                    <img src={item.images?.[0] || item.image || 'https://via.placeholder.com/80x80?text=No+Image'} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-brand">{item.brand}</p>
                      <p className="item-price">{formatPrice(item.price)}</p>
                    </div>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <div className="item-total">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item._id)}
                      className="remove-item-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="total-section">
                  <div className="total-line">
                    <span>Subtotal:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="total-line">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="total-line total">
                    <span>Total:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
                
                <div className="checkout-actions">
                  <button className="continue-shopping" onClick={onClose}>
                    Continue Shopping
                  </button>
                  <button className="checkout-btn">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
