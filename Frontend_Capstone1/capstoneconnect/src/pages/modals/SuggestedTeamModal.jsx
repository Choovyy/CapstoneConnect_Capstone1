import React from 'react';
import '../../css/SuggestedTeamModal.css';
import modalimage from '../../assets/modalimage.png';

const SuggestedTeamModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <img 
            className="modal-image" 
            src={modalimage}
            alt="Processing Illustration" 
          />
          <div className="modal-text">
            Are you sure you want to send a collaboration request?
          </div>
          <div className="modal-buttons">
            <button className="button button--cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="button button--confirm" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedTeamModal;
