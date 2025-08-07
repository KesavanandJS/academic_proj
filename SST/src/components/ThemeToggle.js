import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  return (
    <button
      className={`theme-toggle ${className} ${isTransitioning ? 'transitioning' : ''}`}
      onClick={toggleTheme}
      disabled={isTransitioning}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          <span className="theme-icon">
            {theme === 'light' ? '☀️' : '🌙'}
          </span>
        </div>
        <div className="theme-indicators">
          <span className="light-indicator">☀️</span>
          <span className="dark-indicator">🌙</span>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
