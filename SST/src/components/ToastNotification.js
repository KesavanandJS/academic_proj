import React, { useState, useEffect } from 'react';
import './ToastNotification.css';

const ToastNotification = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon(toast.type)}</span>
        <div className="toast-text">
          <strong>{toast.title}</strong>
          {toast.message && <p>{toast.message}</p>}
        </div>
      </div>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>
        ×
      </button>
      <div className="toast-progress">
        <div 
          className="toast-progress-bar" 
          style={{
            animationDuration: `${toast.duration || 4000}ms`
          }}
        />
      </div>
    </div>
  );
};

export default ToastNotification;
