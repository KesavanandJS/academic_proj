import React, { useState } from 'react';
import './ProductDetails.css';

const ProductDetails = ({ product, onClose, addToCart, addToWishlist, compareProducts }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [reviews] = useState([
    { id: 1, user: 'John D.', rating: 5, comment: 'Excellent product! Highly recommended.' },
    { id: 2, user: 'Sarah M.', rating: 4, comment: 'Good quality, fast delivery.' },
    { id: 3, user: 'Mike R.', rating: 5, comment: 'Perfect for my needs. Great value!' }
  ]);

  const images = [
    product.image,
    product.image.replace('300x300', '300x300?bg=f0f0f0'),
    product.image.replace('300x300', '300x300?bg=e0e0e0')
  ];
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  if (!product) return null;

  return (
    <div className="product-details-overlay">
      <div className="product-details-container">
        <button className="close-details" onClick={onClose}>×</button>
        
        <div className="product-details-content">
          <div className="product-images">
            <div className="main-image">
              <img src={images[selectedImage]} alt={product.name} />
              <div className="image-badges">
                {product.isNew && <span className="badge new">NEW</span>}
                {product.discount && <span className="badge discount">-{product.discount}%</span>}
              </div>
            </div>
            <div className="image-thumbnails">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className={selectedImage === index ? 'active' : ''}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>
          
          <div className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
              <div className="product-rating">
                <span className="stars">{renderStars(Math.round(avgRating))}</span>
                <span className="rating-text">({avgRating.toFixed(1)}) - {reviews.length} reviews</span>
              </div>
            </div>
            
            <div className="price-section">
              <div className="current-price">{formatPrice(product.price)}</div>
              {product.originalPrice && (
                <div className="original-price">{formatPrice(product.originalPrice)}</div>
              )}
              <div className="price-history">
                <small>Lowest price in 30 days: {formatPrice(product.price * 0.9)}</small>
              </div>
            </div>
            
            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Add to Cart - {formatPrice(product.price * quantity)}
                </button>
                <button className="wishlist-btn" onClick={() => addToWishlist(product)}>
                  ♡ Add to Wishlist
                </button>
                <button className="compare-btn" onClick={() => compareProducts(product)}>
                  ⚖ Compare
                </button>
              </div>
            </div>
            
            <div className="product-features">
              <div className="feature">
                <span className="icon">🚚</span>
                <div>
                  <strong>Free Shipping</strong>
                  <p>On orders over ₹8,000</p>
                </div>
              </div>
              <div className="feature">
                <span className="icon">🔄</span>
                <div>
                  <strong>30-Day Returns</strong>
                  <p>Easy return policy</p>
                </div>
              </div>
              <div className="feature">
                <span className="icon">🛡️</span>
                <div>
                  <strong>Quality Assurance</strong>
                  <p>Premium quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="product-tabs">
          <div className="tab-buttons">
            <button 
              className={activeTab === 'specs' ? 'active' : ''}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
            <button 
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviews.length})
            </button>
            <button 
              className={activeTab === 'shipping' ? 'active' : ''}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping & Returns
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'specs' && (
              <div className="specs-content">
                <div className="specs-grid">
                  {product.specs ? Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                      <span>{value}</span>
                    </div>
                  )) : (
                    <div className="spec-item">
                      <strong>Category:</strong>
                      <span>{product.category}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="reviews-content">
                {reviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <strong>{review.user}</strong>
                      <span className="review-stars">{renderStars(review.rating)}</span>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'shipping' && (
              <div className="shipping-content">
                <h4>Shipping Information</h4>
                <ul>
                  <li>Free standard shipping on orders over $100</li>
                  <li>Express shipping: $15 (1-2 business days)</li>
                  <li>Standard shipping: $8 (3-5 business days)</li>
                </ul>
                <h4>Return Policy</h4>
                <ul>
                  <li>30-day return window</li>
                  <li>Item must be in original condition</li>
                  <li>Free return shipping</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
