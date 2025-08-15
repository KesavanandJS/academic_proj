import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = ({ user, token, onClose, onLogout }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [quote, setQuote] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordFields, setPasswordFields] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');
  const [orders, setOrders] = useState([]);
  const [copyEmailMsg, setCopyEmailMsg] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('https://api.quotable.io/random')
      .then(res => res.json())
      .then(data => setQuote(data.content));
    fetch('http://localhost:8000/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUserDetails(data.user);
      });
    fetch('http://localhost:8000/api/user/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.orders || []);
      });
  }, [token]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const response = await fetch('http://localhost:8000/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userDetails)
    });
    if (response.ok) {
      setIsEditing(false);
    }
  };

  // Change Password
  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswordFields(prev => ({ ...prev, [name]: value }));
  };
  const submitPasswordChange = async () => {
    setPasswordMsg('');
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setPasswordMsg('New passwords do not match.');
      return;
    }
    const response = await fetch('http://localhost:8000/api/user/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordFields)
    });
    if (response.ok) {
      setPasswordMsg('Password changed successfully!');
      setPasswordFields({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowChangePassword(false), 1200);
    } else {
      setPasswordMsg('Failed to change password.');
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    setDeleteMsg('');
    const response = await fetch('http://localhost:8000/api/user/delete', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      setDeleteMsg('Account deleted. Logging out...');
      setTimeout(() => {
        setShowDeleteModal(false);
        onLogout();
      }, 1200);
    } else {
      setDeleteMsg('Failed to delete account.');
    }
  };

  // Profile Completion
  const profileFields = ['firstName', 'lastName', 'username', 'email'];
  const completedFields = profileFields.filter(f => userDetails && userDetails[f]);
  const profileCompletion = Math.round((completedFields.length / profileFields.length) * 100);

  // Copy Email
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(userDetails.email);
    setCopyEmailMsg('Copied!');
    setTimeout(() => setCopyEmailMsg(''), 1000);
  };

  if (!userDetails) return <div className="user-profile-modal"><div className="loader">Loading...</div></div>;

  // New: Render as a floating card centered in the viewport, outside header flow
  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(30, 41, 59, 0.7)',
        overflowY: 'auto',
        minHeight: '100vh',
        minWidth: '100vw',
        padding: 0
      }}
    >
      <div
        className="user-profile-modal"
        style={{
          background: 'linear-gradient(135deg, #232323 0%, #181818 100%)',
          borderRadius: 28,
          maxWidth: 480,
          width: '100%',
          margin: '40px 0',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
          border: '1.5px solid #ff6b35',
          color: '#fff',
          padding: 0,
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeInProfile 0.4s',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'auto'
        }}
      >
        {/* Card Top: Avatar and Info */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '36px 32px 18px 32px',
          background: '#181818',
          borderBottom: '1px solid #333',
          position: 'relative'
        }}>
          <div className="avatar-circle" style={{
            width: 96,
            height: 96,
            fontSize: 38,
            marginBottom: 12,
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff4500 100%)'
          }}>
            {userDetails.firstName?.[0]}{userDetails.lastName?.[0]}
          </div>
          <div style={{ fontWeight: 700, fontSize: 23, color: '#fff', marginBottom: 2 }}>
            {userDetails.firstName} {userDetails.lastName}
          </div>
          <div className="user-role" style={{ color: '#ff6b35', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
            {userDetails.role === 'admin' ? 'Administrator' : 'Customer'}
          </div>
          <div style={{ fontSize: 12, color: '#bbb', marginBottom: 2 }}>
            Last login: {userDetails.lastLogin ? new Date(userDetails.lastLogin).toLocaleString() : 'N/A'}
          </div>
          <button className="close-btn" style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'rgba(255, 107, 53, 0.1)',
            border: '1px solid #444',
            borderRadius: '50%',
            width: 40,
            height: 40,
            fontSize: 20,
            color: '#ff6b35'
          }} onClick={onClose}>×</button>
        </div>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          background: '#1a1a1a',
          borderBottom: '1px solid #333',
          flexWrap: 'wrap'
        }}>
          <button className={activeTab === 'profile' ? 'active' : ''} style={{
            background: activeTab === 'profile' ? '#ff6b35' : 'none',
            color: activeTab === 'profile' ? '#fff' : '#ccc',
            fontWeight: 600,
            border: 'none',
            borderRadius: '10px 10px 0 0',
            padding: '10px 18px',
            cursor: 'pointer'
          }} onClick={() => setActiveTab('profile')}>Profile</button>
          <button className={activeTab === 'orders' ? 'active' : ''} style={{
            background: activeTab === 'orders' ? '#ff6b35' : 'none',
            color: activeTab === 'orders' ? '#fff' : '#ccc',
            fontWeight: 600,
            border: 'none',
            borderRadius: '10px 10px 0 0',
            padding: '10px 18px',
            cursor: 'pointer'
          }} onClick={() => setActiveTab('orders')}>Orders</button>
          <button className={activeTab === 'settings' ? 'active' : ''} style={{
            background: activeTab === 'settings' ? '#ff6b35' : 'none',
            color: activeTab === 'settings' ? '#fff' : '#ccc',
            fontWeight: 600,
            border: 'none',
            borderRadius: '10px 10px 0 0',
            padding: '10px 18px',
            cursor: 'pointer'
          }} onClick={() => setActiveTab('settings')}>Settings</button>
          <button className={activeTab === 'danger' ? 'active' : ''} style={{
            background: activeTab === 'danger' ? '#ff6b35' : 'none',
            color: activeTab === 'danger' ? '#fff' : '#ccc',
            fontWeight: 600,
            border: 'none',
            borderRadius: '10px 10px 0 0',
            padding: '10px 18px',
            cursor: 'pointer'
          }} onClick={() => setActiveTab('danger')}>Danger</button>
          <button className={activeTab === 'logout' ? 'active' : ''} style={{
            background: 'none',
            color: '#ccc',
            fontWeight: 600,
            border: 'none',
            borderRadius: '10px 10px 0 0',
            padding: '10px 18px',
            cursor: 'pointer'
          }} onClick={onLogout}>Logout</button>
        </div>
        {/* Main Card */}
        <div style={{
          padding: 32,
          background: '#232323',
          minHeight: 320,
          borderRadius: '0 0 20px 20px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {activeTab === 'profile' && (
            <div className="profile-details-card" style={{ background: '#2d2d2d', borderRadius: 16, padding: 24, border: '1px solid #444', boxShadow: '0 2px 12px rgba(255,107,53,0.08)' }}>
              <h3 style={{ color: '#ff6b35', fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Profile Overview</h3>
              <p className="profile-quote" style={{ color: '#ffb385', fontStyle: 'italic', marginBottom: 18, fontSize: 15 }}>“{quote}”</p>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 13, color: '#bbb' }}>Profile completion: </span>
                <span style={{ fontWeight: 700, color: '#ff6b35' }}>{profileCompletion}%</span>
                <div style={{ background: '#333', borderRadius: 8, height: 8, marginTop: 2, width: 120 }}>
                  <div style={{
                    width: `${profileCompletion}%`,
                    background: '#ff6b35',
                    height: 8,
                    borderRadius: 8,
                    transition: 'width 0.5s'
                  }} />
                </div>
              </div>
              <div className="profile-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px', marginBottom: 18 }}>
                <div><span style={{ color: '#ff6b35', fontWeight: 600 }}>Name:</span> {isEditing ? <input name="firstName" value={userDetails.firstName} onChange={handleInputChange} /> : userDetails.firstName}</div>
                <div><span style={{ color: '#ff6b35', fontWeight: 600 }}>Surname:</span> {isEditing ? <input name="lastName" value={userDetails.lastName} onChange={handleInputChange} /> : userDetails.lastName}</div>
                <div><span style={{ color: '#ff6b35', fontWeight: 600 }}>Username:</span> {isEditing ? <input name="username" value={userDetails.username} onChange={handleInputChange} /> : userDetails.username}</div>
                <div>
                  <span style={{ color: '#ff6b35', fontWeight: 600 }}>Email:</span> {isEditing ? <input name="email" value={userDetails.email} onChange={handleInputChange} /> : (
                    <>
                      {userDetails.email}
                      <button style={{
                        marginLeft: 8,
                        fontSize: 12,
                        background: '#ff6b35',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '2px 8px',
                        cursor: 'pointer'
                      }} onClick={handleCopyEmail}>📋</button>
                      {copyEmailMsg && <span style={{ color: '#ffb385', marginLeft: 4 }}>{copyEmailMsg}</span>}
                    </>
                  )}
                </div>
                <div><span style={{ color: '#ff6b35', fontWeight: 600 }}>Role:</span> {userDetails.role}</div>
              </div>
              {!isEditing ? (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                  <button className="edit-btn" style={{ borderColor: '#ff6b35', color: '#ff6b35' }} onClick={() => setShowChangePassword(true)}>Change Password</button>
                </div>
              ) : (
                <div className="edit-actions" style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  <button className="save-btn" onClick={handleSave}>Save</button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              )}
            </div>
          )}
          {activeTab === 'orders' && (
            <div className="profile-details-card" style={{ background: '#2d2d2d', borderRadius: 16, padding: 24, border: '1px solid #444', boxShadow: '0 2px 12px rgba(255,107,53,0.08)' }}>
              <h3 style={{ color: '#ff6b35', fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Recent Orders</h3>
              {orders.length === 0 ? (
                <div style={{ color: '#bbb', fontSize: 15 }}>No orders found.</div>
              ) : (
                <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                  <table style={{ width: '100%', fontSize: 14 }}>
                    <thead>
                      <tr>
                        <th style={{ color: '#ff6b35' }}>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-6)}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>{order.status}</td>
                          <td style={{ color: '#ff6b35' }}>₹{order.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="settings-card" style={{ background: '#232323', borderRadius: 14, padding: '20px 18px', border: '1px solid #444', marginBottom: 16 }}>
              <h3 style={{ color: '#ff6b35', fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>Account Settings</h3>
              <div className="setting-item">
                <label><input type="checkbox" defaultChecked /> Email Notifications</label>
              </div>
              <div className="setting-item">
                <label><input type="checkbox" /> Promotional Offers</label>
              </div>
              <div className="setting-item">
                <label><input type="checkbox" /> Dark Mode</label>
              </div>
            </div>
          )}
          {activeTab === 'danger' && (
            <div className="settings-card" style={{ border: '1.5px solid #ff6b35', background: '#2d1a1a', borderRadius: 14, padding: '20px 18px', marginBottom: 16 }}>
              <h3 style={{ color: '#ff6b35' }}>Danger Zone</h3>
              <p style={{ color: '#ffb385' }}>Delete your account permanently. This action cannot be undone.</p>
              <button className="danger-btn" style={{
                background: '#ff6b35',
                color: '#fff',
                marginBottom: 10,
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                fontWeight: 600,
                cursor: 'pointer'
              }} onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </button>
            </div>
          )}
        </div>
        {/* Change Password Modal */}
        {showChangePassword && (
          <div className="modal-overlay" style={{ zIndex: 3000 }}>
            <div className="user-profile-modal" style={{ maxWidth: 400, margin: 'auto' }}>
              <div className="profile-header">
                <h2 style={{ fontSize: 20, color: '#ff6b35' }}>Change Password</h2>
                <button className="close-btn" onClick={() => setShowChangePassword(false)}>×</button>
              </div>
              <div className="profile-content">
                <div className="profile-details-card">
                  <input
                    type="password"
                    name="oldPassword"
                    placeholder="Current Password"
                    value={passwordFields.oldPassword}
                    onChange={handlePasswordChange}
                    style={{ marginBottom: 10, width: '100%' }}
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={passwordFields.newPassword}
                    onChange={handlePasswordChange}
                    style={{ marginBottom: 10, width: '100%' }}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={passwordFields.confirmPassword}
                    onChange={handlePasswordChange}
                    style={{ marginBottom: 10, width: '100%' }}
                  />
                  {passwordMsg && <div style={{ color: '#ffb385', marginBottom: 8 }}>{passwordMsg}</div>}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="save-btn" style={{ background: '#ff6b35' }} onClick={submitPasswordChange}>Change</button>
                    <button className="cancel-btn" onClick={() => setShowChangePassword(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" style={{ zIndex: 3000 }}>
            <div className="user-profile-modal" style={{ maxWidth: 400, margin: 'auto' }}>
              <div className="profile-header">
                <h2 style={{ fontSize: 20, color: '#ff6b35' }}>Delete Account</h2>
                <button className="close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
              </div>
              <div className="profile-content">
                <div className="profile-details-card">
                  <p style={{ color: '#ffb385' }}>Are you sure you want to delete your account? This cannot be undone.</p>
                  {deleteMsg && <div style={{ color: '#ffb385', marginBottom: 8 }}>{deleteMsg}</div>}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="danger-btn" style={{
                      background: '#ff6b35',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 20px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }} onClick={handleDeleteAccount}>Yes, Delete</button>
                    <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
