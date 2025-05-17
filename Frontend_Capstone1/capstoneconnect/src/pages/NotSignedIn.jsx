import React from 'react';
import '../css/NotSignedIn.css';

const NotSignedIn = ({ onSignIn }) => {
  return (
    <div className="nsim-modal-overlay">
      <div className="nsim-modal-container">
        <div className="nsim-modal-content nsim-not-signed-in-content">
          <h2 className="nsim-title">Access Restricted</h2>
          <p className="nsim-message">Please sign in to access this page</p>
          <div className="nsim-modal-buttons">
            <button 
              className="nsim-button nsim-button-confirm" 
              onClick={onSignIn}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotSignedIn;
