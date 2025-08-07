import React, { useState, useEffect } from 'react';
import './FiltersModal.css';

const FiltersModal = ({ filters, setFilters, onClose, products }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [appliedCount, setAppliedCount] = useState(0);

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 100000;
  const minPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
    setLocalFilters(prev => ({
      ...prev,
      minPrice: prev.minPrice || minPrice,
      maxPrice: prev.maxPrice || maxPrice
    }));
  }, [minPrice, maxPrice]);

  useEffect(() => {
    let count = 0;
    if (localFilters.minPrice && localFilters.minPrice > minPrice) count++;
    if (localFilters.maxPrice && localFilters.maxPrice < maxPrice) count++;
    if (localFilters.brand) count++;
    if (localFilters.category) count++;
    if (localFilters.rating) count++;
    if (localFilters.inStock) count++;
    setAppliedCount(count);
  }, [localFilters, minPrice, maxPrice]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      minPrice: minPrice,
      maxPrice: maxPrice,
      brand: '',
      category: '',
      rating: '',
      inStock: false
    };
    setLocalFilters(clearedFilters);
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getFilteredCount = () => {
    let filtered = products.filter(product => {
      const matchesPrice = (!localFilters.minPrice || product.price >= localFilters.minPrice) &&
                          (!localFilters.maxPrice || product.price <= localFilters.maxPrice);
      const matchesBrand = !localFilters.brand || product.brand === localFilters.brand;
      const matchesCategory = !localFilters.category || product.category === localFilters.category;
      const matchesRating = !localFilters.rating || product.rating >= parseFloat(localFilters.rating);
      const matchesStock = !localFilters.inStock || product.stock > 0;
      
      return matchesPrice && matchesBrand && matchesCategory && matchesRating && matchesStock;
    });
    return filtered.length;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filters-modal-header">
          <div className="header-content">
            <div className="header-left">
              <h3>🔍 Advanced Filters</h3>
              <p>Refine your search to find the perfect products</p>
              {appliedCount > 0 && (
                <span className="filters-count">{appliedCount} filter{appliedCount > 1 ? 's' : ''} applied</span>
              )}
            </div>
            <button onClick={onClose} className="close-btn">×</button>
          </div>
        </div>
        
        <div className="filters-content">
          {/* Price Range Filter */}
          <div className="filter-group">
            <div className="filter-header">
              <h4>💰 Price Range</h4>
              <span className="filter-info">{formatPrice(localFilters.minPrice || minPrice)} - {formatPrice(localFilters.maxPrice || maxPrice)}</span>
            </div>
            <div className="price-inputs">
              <div className="input-group">
                <label>Minimum Price</label>
                <input
                  type="number"
                  placeholder={`Min (${formatPrice(minPrice)})`}
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  min={minPrice}
                  max={maxPrice}
                />
              </div>
              <div className="range-separator">to</div>
              <div className="input-group">
                <label>Maximum Price</label>
                <input
                  type="number"
                  placeholder={`Max (${formatPrice(maxPrice)})`}
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  min={minPrice}
                  max={maxPrice}
                />
              </div>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="filter-group">
            <div className="filter-header">
              <h4>🏷️ Brand</h4>
              <span className="filter-info">{localFilters.brand || 'All brands'}</span>
            </div>
            <div className="select-wrapper">
              <select
                value={localFilters.brand || ''}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <div className="filter-header">
              <h4>📂 Category</h4>
              <span className="filter-info">{localFilters.category || 'All categories'}</span>
            </div>
            <div className="select-wrapper">
              <select
                value={localFilters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <div className="filter-header">
              <h4>⭐ Minimum Rating</h4>
              <span className="filter-info">
                {localFilters.rating ? `${localFilters.rating}★ & above` : 'Any rating'}
              </span>
            </div>
            <div className="rating-options">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  className={`rating-btn ${localFilters.rating == rating ? 'active' : ''}`}
                  onClick={() => handleFilterChange('rating', rating === localFilters.rating ? '' : rating)}
                >
                  <span className="stars">{'★'.repeat(rating)}{'☆'.repeat(5-rating)}</span>
                  <span className="rating-text">{rating}★ & up</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stock Filter */}
          <div className="filter-group">
            <div className="filter-header">
              <h4>📦 Availability</h4>
              <span className="filter-info">{localFilters.inStock ? 'In stock only' : 'All products'}</span>
            </div>
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={localFilters.inStock || false}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">Show only products in stock</span>
            </label>
          </div>

          {/* Results Preview */}
          <div className="results-preview">
            <div className="results-info">
              <span className="results-count">{getFilteredCount()}</span>
              <span className="results-text">products match your filters</span>
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-btn">
              <span>🗑️</span>
              Clear All
            </button>
            <button onClick={applyFilters} className="apply-btn">
              <span>✨</span>
              Apply Filters ({getFilteredCount()})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
