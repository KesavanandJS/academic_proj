
import React from 'react';

const PersonalDetails = ({ user, shippingDetails, onProceed }) => {
  const [form, setForm] = React.useState({
    address: shippingDetails?.address || '',
    city: shippingDetails?.city || '',
    state: shippingDetails?.state || '',
    zipCode: shippingDetails?.zipCode || '',
    country: shippingDetails?.country || ''
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (form.address && form.city && form.state && form.zipCode && form.country) {
      onProceed(form);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '2.5rem 2rem',
        maxWidth: '420px',
        width: '100%',
        margin: '2rem',
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: '#1d1d1f',
          fontWeight: 700,
          fontSize: '2rem',
        }}>Personal & Shipping Details</h2>
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '8px',
        }}>
          <h3 style={{marginBottom: '0.5rem', color: '#6366f1'}}>User Info</h3>
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <h3 style={{marginBottom: '0.5rem', color: '#6366f1'}}>Shipping Info</h3>
          <div style={{display: 'grid', gap: '1rem'}}>
            <input name="address" value={form.address} onChange={handleChange} required placeholder="Address" style={inputStyle} />
            <input name="city" value={form.city} onChange={handleChange} required placeholder="City" style={inputStyle} />
            <input name="state" value={form.state} onChange={handleChange} required placeholder="State" style={inputStyle} />
            <input name="zipCode" value={form.zipCode} onChange={handleChange} required placeholder="Zip Code" style={inputStyle} />
            <input name="country" value={form.country} onChange={handleChange} required placeholder="Country" style={inputStyle} />
          </div>
          <button type="submit" style={buttonStyle}>
            Proceed to Payment
          </button>
          {submitted && !(form.address && form.city && form.state && form.zipCode && form.country) && (
            <div style={{color:'red',marginTop:'1rem',textAlign:'center'}}>Please fill all fields.</div>
          )}
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '1rem',
  background: '#f3f4f6',
  outline: 'none',
};

const buttonStyle = {
  marginTop: '1.5rem',
  width: '100%',
  padding: '0.9rem',
  borderRadius: '8px',
  background: 'linear-gradient(90deg,#6366f1,#22c55e)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '1.1rem',
  border: 'none',
  boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
  cursor: 'pointer',
  transition: 'background 0.2s',
};

export default PersonalDetails;
