import React, { useState } from 'react';
import './Cart.css';

const Cart = ({ isOpen, onClose, cartItems, updateCartItems, user }) => {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const coupons = {
    'FASHION10': { discount: 10, minAmount: 8000 },
    'NEWUSER15': { discount: 15, minAmount: 16000 },
    'SAVE20': { discount: 20, minAmount: 40000 }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    updateCartItems(updatedItems);
  };

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    updateCartItems(updatedItems);
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
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const tax = (subtotal - discountAmount) * 0.18;
    const shipping = subtotal > 8000 ? 0 : 200;
    return subtotal - discountAmount + tax + shipping;
  };

  const applyCoupon = () => {
    const coupon = coupons[couponCode.toUpperCase()];
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (coupon && subtotal >= coupon.minAmount) {
      setDiscount(coupon.discount);
      alert(`Coupon applied! ${coupon.discount}% discount`);
    } else if (coupon) {
      alert(`Minimum order amount ${formatPrice(coupon.minAmount)} required for this coupon`);
    } else {
      alert('Invalid coupon code');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.18; // 18% GST
  const shipping = subtotal > 8000 ? 0 : 200; // Free shipping over ₹8000
  const total = getTotalPrice();

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          items: cartItems,
          total: getTotalPrice(),
          couponCode: couponCode,
          discount: discountAmount
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Order placed successfully!');
        updateCartItems([]);
        setDiscount(0);
        setCouponCode('');
        onClose();
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Shopping Cart ({cartItems.length} items)</h2>
          <button className="close-cart" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p className="cart-item-specs">{item.specs?.material || item.category}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-price">
                      <p>{formatPrice(item.price * item.quantity)}</p>
                      <button 
                        className="remove-item"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="coupon-section">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                  />
                  <button onClick={applyCoupon} className="apply-coupon">Apply</button>
                </div>
                
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="price-row discount">
                      <span>Discount ({discount}%):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="price-row">
                    <span>GST (18%):</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="price-row">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
                
                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : `Checkout - ${formatPrice(getTotalPrice())}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
    
