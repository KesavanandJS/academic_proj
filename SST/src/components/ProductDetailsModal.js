import React, { useState, useEffect } from 'react';
import './ProductDetailsModal.css';
import ProductReview from './ProductReview';

const ProductDetailsModal = ({ product, onClose, onAddToCart, onAddToWishlist, onAddToCompare }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewError, setReviewError] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!product?._id && !product?.id) return;
    setLoadingReviews(true);
    fetch(`/api/products/${product._id || product.id}/reviews`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setReviews(data.reviews);
        else setReviews([]);
        setLoadingReviews(false);
      })
      .catch(() => {
        setReviews([]);
        setLoadingReviews(false);
      });
  }, [product]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddReview = async (review) => {
    setReviewError('');
    try {
      const res = await fetch(`/api/products/${product._id || product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...review })
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
      } else {
        setReviewError(data.message || 'Failed to add review');
      }
    } catch (err) {
      setReviewError('Failed to add review');
    }
  };

  const handlePlaceOrder = async () => {
    setOrderStatus('');
    setPlacingOrder(true);
    try {
      // You may want to get user info from context/auth in a real app
      const orderPayload = {
        items: [{
          productId: product._id || product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images?.[0] || ''
        }],
        total: product.price * quantity,
        shippingAddress: 'Demo Address',
        paymentMethod: 'COD',
        couponCode: '',
        discount: 0
      };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success) {
        setOrderStatus('Order placed successfully!');
      } else {
        setOrderStatus(data.message || 'Failed to place order');
      }
    } catch (err) {
      setOrderStatus('Failed to place order');
    }
    setPlacingOrder(false);
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
                <button onClick={handlePlaceOrder} className="place-order-btn" disabled={placingOrder} style={{background:'linear-gradient(90deg,#22c55e,#16a34a)',color:'#fff',marginLeft:'0.5rem',padding:'0.6rem 1.2rem',borderRadius:'8px',fontWeight:'600',fontSize:'1rem',boxShadow:'0 2px 8px rgba(34,197,94,0.08)'}}>
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
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

        {/* Product Review Section */}
        <ProductReview
          productId={product._id || product.id}
          reviews={reviews}
          onSubmitReview={handleAddReview}
        />
        {loadingReviews && <div style={{textAlign:'center',color:'#64748b'}}>Loading reviews...</div>}
        {reviewError && <div style={{color:'#dc2626',textAlign:'center'}}>{reviewError}</div>}
        {orderStatus && <div style={{marginTop:'0.5rem',color:orderStatus.includes('success')?'#22c55e':'#dc2626',fontWeight:'600'}}>{orderStatus}</div>}
      </div>
    </div>
  );
};

export default ProductDetailsModal;
