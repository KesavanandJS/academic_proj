import React from 'react';
import './Breadcrumb.css';

const Breadcrumb = ({ items = [], className = '' }) => {
  return (
    <nav className={`breadcrumb-nav ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {index < items.length - 1 ? (
              <>
                <button
                  className="breadcrumb-link"
                  onClick={item.onClick}
                  type="button"
                >
                  {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                  {item.label}
                </button>
                <span className="breadcrumb-separator">›</span>
              </>
            ) : (
              <span className="breadcrumb-current" aria-current="page">
                {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
