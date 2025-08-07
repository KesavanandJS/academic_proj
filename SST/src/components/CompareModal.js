import React from 'react';
import './CompareModal.css';

const CompareModal = ({ compareList, setCompareList, onClose, onAddToCart, removeFromCompare }) => {
  const removeFromCompareHandler = (productId) => {
    removeFromCompare(productId);
  };

  const clearCompare = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/user/compare', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCompareList([]);
      }
    } catch (error) {
      console.error('Error clearing compare list:', error);
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

  const specifications = ['material', 'size', 'color', 'pattern', 'sleeve', 'neckline', 'length'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="compare-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Compare Products ({compareList.length}/3)</h3>
          <div className="header-actions">
            {compareList.length > 0 && (
              <button onClick={clearCompare} className="clear-all-btn">
                Clear All
              </button>
            )}
            <button onClick={onClose} className="close-btn">×</button>
          </div>
        </div>
        
        <div className="compare-content">
          {compareList.length === 0 ? (
            <div className="empty-compare">
              <div className="empty-icon">⚖️</div>
              <h4>No products to compare</h4>
              <p>Add products to compare their features side by side!</p>
            </div>
          ) : (
            <div className="compare-table">
              <div className="compare-grid">
                {/* Product Images and Basic Info */}
                <div className="compare-row">
                  <div className="row-label">Product</div>
                  {compareList.map(product => (
                    <div key={product._id} className="compare-cell product-cell">
                      <button 
                        onClick={() => removeFromCompareHandler(product._id)}
                        className="remove-compare-btn"
                      >
                        ×
                      </button>
                      <img src={product.images?.[0] || product.image || 'https://via.placeholder.com/100x100?text=No+Image'} alt={product.name} />
                      <h4>{product.name}</h4>
                      <p className="brand">{product.brand}</p>
                      <p className="price">{formatPrice(product.price)}</p>
                      <button 
                        onClick={() => onAddToCart(product)}
                        className="add-to-cart-compare"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>

                {/* Price Comparison */}
                <div className="compare-row">
                  <div className="row-label">Price</div>
                  {compareList.map(product => (
                    <div key={product._id} className="compare-cell">
                      <div className="price-compare">
                        <span className="current">{formatPrice(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="original">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rating Comparison */}
                <div className="compare-row">
                  <div className="row-label">Rating</div>
                  {compareList.map(product => (
                    <div key={product._id} className="compare-cell">
                      <div className="rating-stars">
                        {'★'.repeat(Math.floor(product.rating || 4.5))}{'☆'.repeat(5 - Math.floor(product.rating || 4.5))}
                      </div>
                      <span>({product.rating || 4.5}/5)</span>
                    </div>
                  ))}
                </div>

                {/* Specifications Comparison */}
                {specifications.map(spec => (
                  <div key={spec} className="compare-row">
                    <div className="row-label">
                      {spec.charAt(0).toUpperCase() + spec.slice(1)}
                    </div>
                    {compareList.map(product => (
                      <div key={product._id} className="compare-cell">
                        {product.specifications?.[spec] || 'N/A'}
                      </div>
                    ))}
                  </div>
                ))}

                {/* Stock Status */}
                <div className="compare-row">
                  <div className="row-label">Stock</div>
                  {compareList.map(product => (
                    <div key={product._id} className="compare-cell">
                      <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
