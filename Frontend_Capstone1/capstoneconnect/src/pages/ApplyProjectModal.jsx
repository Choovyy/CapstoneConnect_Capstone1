import React from 'react';
import '../css/ApplyProjectModal.css';

const ApplyProjectModal = ({ isOpen, onClose, onConfirm, projectCreator }) => {
  if (!isOpen) return null;

  return (
    <div className="apm-modal-overlay">
      <div className="apm-modal-container apm-apply-modal">
        <div className="apm-modal-content">
          <div className="apm-apply-content">
            <h3 className="apm-apply-title">Apply for Project</h3>
            <p className="apm-apply-message">
              This project is made by {projectCreator || "Project Creator"}
            </p>
            <div className="apm-modal-buttons">
              <button 
                type="button" 
                className="apm-button apm-button-cancel" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="apm-button apm-button-confirm"
                onClick={onConfirm}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyProjectModal;
