import React, { useState, useEffect, useRef } from 'react';
import './AdvancedSearch.css';

const AdvancedSearch = ({ 
  searchTerm, 
  onSearchChange, 
  products, 
  onProductSelect,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState([
    'Cotton Tape', 'Twill Tape', 'Elastic Tape', 'Binding Tape',
    'Cotton Wick', 'Herringbone Tape', 'Fabric Tape'
  ]);
  const searchRef = useRef(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = products
        .filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 8); // Limit to 8 suggestions
      
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (value) => {
    onSearchChange(value);
    if (value.trim() && !recentSearches.includes(value.trim())) {
      const newRecent = [value.trim(), ...recentSearches.slice(0, 4)];
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    }
  };

  const handleSuggestionClick = (product) => {
    onProductSelect(product);
    setIsOpen(false);
  };

  const handleQuickSearch = (term) => {
    handleSearch(term);
    setIsOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`advanced-search ${className}`} ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="🔍 Search tapes, wicks, brands... (Try: cotton, twill)"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="advanced-search-input"
        />
        <div className="search-actions">
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => handleSearch('')}
              type="button"
            >
              ×
            </button>
          )}
          <button className="search-filters" type="button">
            ⚙️
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="search-dropdown">
          {/* Product Suggestions */}
          {suggestions.length > 0 && (
            <div className="search-section">
              <h4>🧵 Products</h4>
              <div className="suggestions-list">
                {suggestions.map(product => (
                  <div 
                    key={product._id} 
                    className="suggestion-item product-suggestion"
                    onClick={() => handleSuggestionClick(product)}
                  >
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/40x40?text=No+Image'} 
                      alt={product.name}
                      className="suggestion-image"
                    />
                    <div className="suggestion-details">
                      <span className="suggestion-name">{product.name}</span>
                      <span className="suggestion-price">{formatPrice(product.price)}</span>
                      <span className="suggestion-category">{product.category}</span>
                    </div>
                    <div className="suggestion-stock">
                      {product.stock > 0 ? (
                        <span className="in-stock">✅ In Stock</span>
                      ) : (
                        <span className="out-stock">❌ Out of Stock</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && searchTerm.length === 0 && (
            <div className="search-section">
              <div className="section-header">
                <h4>🕒 Recent Searches</h4>
                <button className="clear-recent" onClick={clearRecentSearches}>
                  Clear
                </button>
              </div>
              <div className="quick-searches">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    className="quick-search-btn recent"
                    onClick={() => handleQuickSearch(term)}
                  >
                    🕒 {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {searchTerm.length === 0 && (
            <div className="search-section">
              <h4>🔥 Popular Searches</h4>
              <div className="quick-searches">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    className="quick-search-btn popular"
                    onClick={() => handleQuickSearch(term)}
                  >
                    🔥 {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchTerm.length > 0 && suggestions.length === 0 && (
            <div className="search-section">
              <div className="no-results">
                <span className="no-results-icon">🔍</span>
                <h4>No products found</h4>
                <p>Try searching for:</p>
                <div className="quick-searches">
                  {popularSearches.slice(0, 3).map((term, index) => (
                    <button
                      key={index}
                      className="quick-search-btn suggestion"
                      onClick={() => handleQuickSearch(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
