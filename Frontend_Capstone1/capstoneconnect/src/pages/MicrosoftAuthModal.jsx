import React from 'react';
import '../css/MicrosoftAuthModal.css';
import logo from '../assets/logo.png';

const MicrosoftAuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="ms-modal-overlay">
      <div className="ms-modal-container">
        <button className="ms-close-btn" onClick={onClose}>✕</button>
        
        <div className="ms-brand-section">
          <div className="ms-brand-logo">
            <img src={logo} alt="Capstone Connect Logo" />
          </div>
          <div className="ms-brand-title">
            <div className="ms-title capstone">Capstone</div>
            <div className="ms-title connect">Connect</div>
          </div>
        </div>

        <div className="ms-divider"></div>

        <div className="ms-auth-section">
          <h2 className="ms-sign-in-title">Sign In</h2>
          
          <button className="ms-microsoft-auth-btn">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
              alt="Microsoft" 
              className="ms-microsoft-icon" 
            />
            <span className="ms-microsoft-text">Continue with Microsoft</span>
          </button>

          <div className="ms-alternative-options">
            Don't have an account? 
            <span className="ms-alternative-link">Sign up</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicrosoftAuthModal;