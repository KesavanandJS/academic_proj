import React, { useState, useEffect } from 'react';
import './ProductRecommendations.css';

const ProductRecommendations = ({ 
  currentProduct, 
  userPurchaseHistory = [], 
  allProducts = [],
  onProductClick,
  onAddToCart,
  onAddToWishlist
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('related');

  useEffect(() => {
    generateRecommendations();
  }, [currentProduct, userPurchaseHistory, allProducts]);

  const generateRecommendations = () => {
    setLoading(true);
    
    const related = getRelatedProducts();
    const trending = getTrendingProducts();
    const frequentlyBought = getFrequentlyBoughtTogether();
    const recentlyViewed = getRecentlyViewed();
    
    setRecommendations({
      related,
      trending,
      frequentlyBought,
      recentlyViewed
    });
    
    setLoading(false);
  };

  const getRelatedProducts = () => {
    if (!currentProduct) return [];
    
    return allProducts
      .filter(product => 
        product._id !== currentProduct._id &&
        (product.category === currentProduct.category ||
         product.brand === currentProduct.brand ||
         hasCommonSpecs(product, currentProduct))
      )
      .sort((a, b) => calculateSimilarityScore(b, currentProduct) - calculateSimilarityScore(a, currentProduct))
      .slice(0, 8);
  };

  const getTrendingProducts = () => {
    // Simulate trending based on rating and stock movement
    return allProducts
      .filter(product => currentProduct ? product._id !== currentProduct._id : true)
      .sort((a, b) => {
        const scoreA = (a.rating || 4) * (a.stock > 50 ? 1.2 : 1) * Math.random();
        const scoreB = (b.rating || 4) * (b.stock > 50 ? 1.2 : 1) * Math.random();
        return scoreB - scoreA;
      })
      .slice(0, 8);
  };

  const getFrequentlyBoughtTogether = () => {
    if (!currentProduct) return [];
    
    // Simple algorithm: products from same category with different specifications
    return allProducts
      .filter(product => 
        product._id !== currentProduct._id &&
        product.category === currentProduct.category &&
        product.specifications?.material !== currentProduct.specifications?.material
      )
      .slice(0, 4);
  };

  const getRecentlyViewed = () => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    return allProducts
      .filter(product => 
        viewed.includes(product._id) && 
        (currentProduct ? product._id !== currentProduct._id : true)
      )
      .slice(0, 6);
  };

  const hasCommonSpecs = (product1, product2) => {
    if (!product1.specifications || !product2.specifications) return false;
    
    const specs1 = Object.values(product1.specifications).filter(Boolean);
    const specs2 = Object.values(product2.specifications).filter(Boolean);
    
    return specs1.some(spec => specs2.includes(spec));
  };

  const calculateSimilarityScore = (product1, product2) => {
    let score = 0;
    
    // Category match
    if (product1.category === product2.category) score += 3;
    
    // Brand match
    if (product1.brand === product2.brand) score += 2;
    
    // Price range similarity
    const priceDiff = Math.abs(product1.price - product2.price);
    const avgPrice = (product1.price + product2.price) / 2;
    if (priceDiff / avgPrice < 0.3) score += 2;
    
    // Specifications similarity
    if (hasCommonSpecs(product1, product2)) score += 1;
    
    return score;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const addToRecentlyViewed = (product) => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [product._id, ...viewed.filter(id => id !== product._id)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  const handleProductClick = (product) => {
    addToRecentlyViewed(product);
    onProductClick(product);
  };

  const tabs = [
    { key: 'related', label: '🎯 Related Products', count: recommendations.related?.length || 0 },
    { key: 'trending', label: '🔥 Trending Now', count: recommendations.trending?.length || 0 },
    { key: 'frequentlyBought', label: '🛍️ Frequently Bought Together', count: recommendations.frequentlyBought?.length || 0 },
    { key: 'recentlyViewed', label: '👁️ Recently Viewed', count: recommendations.recentlyViewed?.length || 0 }
  ];

  const renderProductCard = (product) => (
    <div key={product._id} className="recommendation-card">
      <div className="recommendation-image" onClick={() => handleProductClick(product)}>
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/200x200?text=No+Image'} 
          alt={product.name}
          loading="lazy"
        />
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="discount-badge">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="low-stock-badge">Only {product.stock} left!</div>
        )}
      </div>
      
      <div className="recommendation-details">
        <h4 className="recommendation-name" onClick={() => handleProductClick(product)}>
          {product.name}
        </h4>
        <p className="recommendation-brand">{product.brand}</p>
        <div className="recommendation-rating">
          {'★'.repeat(Math.floor(product.rating || 4))}{'☆'.repeat(5 - Math.floor(product.rating || 4))}
          <span>({product.rating || 4})</span>
        </div>
        <div className="recommendation-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        
        <div className="recommendation-actions">
          <button 
            className="quick-add-cart"
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
          </button>
          <button 
            className="quick-add-wishlist"
            onClick={() => onAddToWishlist(product)}
          >
            ♡
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-loading">
          <div className="loading-spinner"></div>
          <p>Finding perfect recommendations for you...</p>
        </div>
      </div>
    );
  }

  const currentRecommendations = recommendations[activeTab] || [];

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h3>🎯 Recommended for You</h3>
        <p>Discover products tailored to your preferences</p>
      </div>

      <div className="recommendations-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`recommendations-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            disabled={tab.count === 0}
          >
            {tab.label}
            {tab.count > 0 && <span className="tab-count">({tab.count})</span>}
          </button>
        ))}
      </div>

      <div className="recommendations-content">
        {currentRecommendations.length > 0 ? (
          <div className="recommendations-grid">
            {currentRecommendations.map(renderProductCard)}
          </div>
        ) : (
          <div className="no-recommendations">
            <span className="no-recommendations-icon">🔍</span>
            <h4>No recommendations available</h4>
            <p>Browse our products to get personalized recommendations!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRecommendations;
