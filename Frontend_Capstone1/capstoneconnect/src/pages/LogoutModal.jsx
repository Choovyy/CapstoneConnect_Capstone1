import React from 'react';
import '../css/LogoutModal.css';

const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="lm-modal-overlay">
      <div className="lm-modal-container">
        <div className="lm-modal-content lm-logout-content">
          <h2 className="lm-logout-title">Sign Out</h2>
          <p className="lm-logout-message">Do you want to sign out?</p>
          <div className="lm-modal-buttons">
            <button className="lm-button lm-button-cancel" onClick={onCancel}>
              No
            </button>
            <button className="lm-button lm-button-confirm" onClick={onConfirm}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
