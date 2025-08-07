import React from 'react';
import './Wishlist.css';

const Wishlist = ({ items, onClose, onRemove, onAddToCart }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="wishlist-overlay">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2>My Wishlist ({items.length})</h2>
          <button className="close-wishlist" onClick={onClose}>×</button>
        </div>
        
        {items.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">♡</div>
            <h3>Your wishlist is empty</h3>
            <p>Save your favorite items to buy them later!</p>
          </div>
        ) : (
          <div className="wishlist-items">
            {items.map(item => (
              <div key={item.id} className="wishlist-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                  {item.discount && (
                    <span className="discount-badge">-{item.discount}%</span>
                  )}
                </div>
                
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-category">{item.category}</p>
                  <div className="item-rating">
                    Rating: {item.rating} ★
                  </div>
                </div>
                
                <div className="item-price">
                  <span className="current-price">{formatPrice(item.price)}</span>
                  {item.originalPrice && (
                    <span className="original-price">{formatPrice(item.originalPrice)}</span>
                  )}
                </div>
                
                <div className="item-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => {
                      onAddToCart(item);
                      alert(`${item.name} added to cart!`);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="remove-btn"
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
  