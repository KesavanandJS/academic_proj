import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import { ToastProvider } from './context/ToastContext';
import './App.css';
import './styles/responsive-utilities.css';

function App() {
  const [currentView, setCurrentView] = useState('about');
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const adminToken = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }

    if (adminToken && adminData) {
      setAdmin(JSON.parse(adminData));
      setIsAdminAuthenticated(true);
    }
  }, []);

  const switchToSignup = () => setCurrentView('signup');
  const switchToLogin = () => setCurrentView('login');
  const switchToAdminLogin = () => setCurrentView('adminLogin');
  const switchToUserLogin = () => setCurrentView('login');
  const switchToAbout = () => setCurrentView('about');
  const handleViewProducts = () => setCurrentView('login');

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('about');
  };

  const handleAdminLogin = (adminData) => {
    setAdmin(adminData);
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
    setIsAdminAuthenticated(false);
    setCurrentView('about');
  };

  // Admin view
  if (isAdminAuthenticated && admin) {
    return (
      <ToastProvider>
        <AdminDashboard admin={admin} onLogout={handleAdminLogout} />
      </ToastProvider>
    );
  }

  // User view
  if (isAuthenticated && user) {
    return (
      <ToastProvider>
        <Home user={user} onLogout={handleLogout} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="App">
        {currentView === 'about' && (
          <About onViewProducts={handleViewProducts} />
        )}
        {currentView === 'login' && (
          <>
            <Login switchToSignup={switchToSignup} onLogin={handleLogin} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={switchToAdminLogin} className="link-button">
                Admin Login
              </button>
              <span style={{ margin: '0 10px', color: '#ccc' }}>|</span>
              <button onClick={switchToAbout} className="link-button">
                ← Back to About
              </button>
            </div>
          </>
        )}
        {currentView === 'signup' && (
          <>
            <Signup switchToLogin={switchToLogin} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={switchToAbout} className="link-button">
                ← Back to About
              </button>
            </div>
          </>
        )}
        {currentView === 'adminLogin' && (
          <>
            <AdminLogin onAdminLogin={handleAdminLogin} switchToUserLogin={switchToUserLogin} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={switchToAbout} className="link-button">
                ← Back to About
              </button>
            </div>
          </>
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
