import React, { useState } from 'react';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, onClose, onAddToCart, onAddToWishlist, onAddToCompare }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-details-modal" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="close-btn">×</button>
        
        <div className="modal-content">
          <div className="product-images">
            <div className="main-image">
              <img src={product.images?.[selectedImageIndex] || product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'} alt={product.name} />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImageIndex === index ? 'active' : ''}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            <h2>{product.name}</h2>
            <p className="brand">Brand: {product.brand}</p>
            <p className="category">{product.category}</p>
            
            <div className="price-section">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  <span className="discount">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="rating-section">
              <div className="stars">
                {'★'.repeat(Math.floor(product.rating || 4.5))}{'☆'.repeat(5 - Math.floor(product.rating || 4.5))}
              </div>
              <span>({product.rating || 4.5}/5)</span>
            </div>

            <div className="description">
              <h4>Description</h4>
              <p>{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="features">
                <h4>Key Features</h4>
                <ul>
                  {product.features.map((feature, index) => (
                    feature && <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.specifications && (
              <div className="specifications">
                <h4>Specifications</h4>
                <div className="spec-grid">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    value && (
                      <div key={key} className="spec-item">
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                        <span>{value}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            <div className="actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                  {[...Array(Math.min(10, product.stock || 5))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              
              <div className="action-buttons">
                <button onClick={() => onAddToCart(product)} className="add-to-cart">
                  Add to Cart
                </button>
                <button onClick={() => onAddToWishlist(product)} className="add-to-wishlist">
                  Add to Wishlist
                </button>
                <button onClick={() => onAddToCompare(product)} className="add-to-compare">
                  Compare
                </button>
              </div>
            </div>

            <div className="stock-info">
              <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
