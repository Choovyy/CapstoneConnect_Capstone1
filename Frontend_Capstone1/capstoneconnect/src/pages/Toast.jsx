import React, { useEffect } from 'react';
import '../css/Toast.css';

const Toast = ({ message, type = 'error', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch(type) {
      case 'error':
        return '✕';
      case 'success':
        return '✓';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        <p>{message}</p>
        <div className="toast-progress-bar">
          <div 
            className="toast-progress" 
            style={{ animationDuration: `${duration}ms` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
