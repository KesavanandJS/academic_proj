import React, { useState } from 'react';
import './Auth.css';

const AdminLogin = ({ onAdminLogin, switchToUserLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      try {
        const response = await fetch('http://localhost:8000/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          localStorage.setItem('adminToken', result.token);
          localStorage.setItem('admin', JSON.stringify(result.admin));
          onAdminLogin(result.admin);
        } else {
          setErrors({ general: result.message });
        }
      } catch (error) {
        console.error('Admin login error:', error);
        setErrors({ general: 'Network error. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sri Saravana Textile - Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {errors.general && <div className="error-message general-error">{errors.general}</div>}
          
          <div className="form-group">
            <label htmlFor="username">👤 Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Enter admin username"
              disabled={isLoading}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">🔒 Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter admin password"
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Signing in...' : '🚀 Login as Admin'}
          </button>
        </form>
        
        <div className="admin-info">
          <p><strong>🧵 Textile Management System</strong></p>
          <p>Only authorized person can access the admin panel..</p>
        </div>
        
        <p className="auth-switch">
          Not an admin? 
          <button type="button" onClick={switchToUserLogin} className="link-button">
            👤 User Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
