import React, { useState } from 'react';
import './ImageZoom.css';

const ImageZoom = ({ src, alt, className = '' }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className={`image-zoom-container ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`zoom-image ${isZoomed ? 'zoomed' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
        }}
      />
      {isZoomed && (
        <div className="zoom-lens" style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`
        }} />
      )}
    </div>
  );
};

export default ImageZoom;
