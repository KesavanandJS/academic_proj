import React, { useState } from 'react';
import './FloatingActionMenu.css';

const FloatingActionMenu = ({ 
  onScrollToTop, 
  onToggleWishlist, 
  onToggleCart, 
  cartCount = 0,
  wishlistCount = 0 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="floating-action-menu">
      <div className={`fab-menu ${isOpen ? 'open' : ''}`}>
        <button 
          className="fab-item scroll-top"
          onClick={() => handleAction(onScrollToTop)}
          title="Scroll to Top"
        >
          <span>↑</span>
        </button>
        
        <button 
          className="fab-item wishlist"
          onClick={() => handleAction(onToggleWishlist)}
          title="Wishlist"
        >
          <span>♡</span>
          {wishlistCount > 0 && (
            <span className="fab-badge">{wishlistCount}</span>
          )}
        </button>
        
        <button 
          className="fab-item cart"
          onClick={() => handleAction(onToggleCart)}
          title="Cart"
        >
          <span>🛒</span>
          {cartCount > 0 && (
            <span className="fab-badge">{cartCount}</span>
          )}
        </button>
      </div>
      
      <button 
        className={`fab-main ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        title={isOpen ? 'Close Menu' : 'Quick Actions'}
      >
        <span className="fab-icon">
          {isOpen ? '✕' : '⚡'}
        </span>
      </button>
    </div>
  );
};

export default FloatingActionMenu;
