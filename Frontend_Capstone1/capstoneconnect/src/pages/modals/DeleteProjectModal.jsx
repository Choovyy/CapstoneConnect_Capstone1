import React from 'react';
import '../../css/DeleteProjectModal.css';

const DeleteProjectModal = ({ isOpen, onClose, onConfirm, projectTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="dpm-modal-overlay">
      <div className="dpm-modal-container dpm-delete-modal">
        <div className="dpm-modal-content">
          <div className="dpm-delete-content">
            <h3 className="dpm-delete-title">Delete Project</h3>
            <p className="dpm-delete-message">
              Do you want to delete this project{projectTitle ? `: "${projectTitle}"` : ''}?
            </p>
            <div className="dpm-modal-buttons">
              <button 
                type="button" 
                className="dpm-button dpm-button-cancel" 
                onClick={onClose}
              >
                No
              </button>
              <button 
                type="button" 
                className="dpm-button dpm-button-confirm"
                onClick={onConfirm}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;
