import React from 'react';
import './About.css';

const About = ({ onViewProducts }) => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="company-logo">
            <span className="logo-text">SST</span>
          </div>
          <h1 className="company-name">Sri Saravana Textile</h1>
          <p className="company-tagline">Premium Quality Tapes & Wicks Since 1985</p>
          <div className="hero-description">
            <p>Crafting Excellence in Every Thread</p>
          </div>
        </div>
        <div className="hero-bg-pattern"></div>
      </div>

      {/* Company Overview */}
      <div className="section company-overview">
        <div className="container">
          <h2 className="section-title">About Our Heritage</h2>
          <div className="overview-grid">
            <div className="overview-text">
              <p className="lead-text">
                For over three decades, Sri Saravana Textile has been a trusted name in the textile industry, 
                specializing in premium quality tapes and wicks. Located in the heart of Tamil Nadu, we combine 
                traditional craftsmanship with modern technology to deliver products that exceed expectations.
              </p>
              <p>
                Our commitment to quality, innovation, and customer satisfaction has made us a preferred choice 
                for businesses across India. We take pride in our sustainable practices and contribute to the 
                local community through ethical manufacturing processes.
              </p>
            </div>
            <div className="overview-stats">
              <div className="stat-item">
                <span className="stat-number">35+</span>
                <span className="stat-label">Years of Excellence</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Product Categories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="section product-categories">
        <div className="container">
          <h2 className="section-title">Our Product Range</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">🎗️</div>
              <h3>Cotton Tapes</h3>
              <p>Premium cotton tapes for garment finishing and craft projects</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🕯️</div>
              <h3>Cotton Wicks</h3>
              <p>Pure cotton wicks for oil lamps, diyas, and spiritual purposes in multy colors</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🔗</div>
              <h3>Elastic Tapes</h3>
              <p>High-quality elastic tapes for waistbands and stretchable applications</p>
            </div>
            <div className="category-card">
              <div className="category-icon">📐</div>
              <h3>Polyester wicks</h3>
              <p>Strong Polyester wicks ideal for reinforcement and heavy-duty use</p>
            </div>
            
            <div className="category-card">
              <div className="category-icon">🧶</div>
              <h3>Fabric wicks</h3>
              <p>Versatile fabric wicks for binding, trimming, and decorative purposes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="section why-choose">
        <div className="container">
          <h2 className="section-title">Why Choose Sri Saravana Textile?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <h3>Premium Quality</h3>
              <p>Every product undergoes rigorous quality checks to ensure excellence</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌱</div>
              <h3>Eco-Friendly</h3>
              <p>Sustainable manufacturing practices and environmentally conscious processes</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>Quick processing and delivery across Tamil Nadu and neighboring states</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💰</div>
              <h3>Competitive Pricing</h3>
              <p>Best prices in the market without compromising on quality</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤝</div>
              <h3>Customer Support</h3>
              <p>Dedicated support team to assist with all your textile needs</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏭</div>
              <h3>Local Manufacturing</h3>
              <p>Proudly manufactured in Tamil Nadu, supporting local economy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore Our Premium Collection?</h2>
            <p>Discover our extensive range of high-quality tapes and wicks, sold by the kilogram for your convenience.</p>
            <button 
              className="cta-button"
              onClick={onViewProducts}
            >
              <span>View Our Products</span>
              <span className="button-arrow">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3> Sri Saravana Textile</h3>
              <p>Premium Quality Tapes & Wicks</p>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <p>📍 Tamil Nadu, India</p>
              <p>📞 +91 9842664316</p>
              <p>✉️ info@srisaravanatextile.com</p>
            </div>
            <div className="footer-section">
              <h4>Business Hours</h4>
              <p>Monday - Saturday: 9:00 AM - 6:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Sri Saravana Textile. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
