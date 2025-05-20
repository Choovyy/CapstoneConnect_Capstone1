import React, { useState, useEffect } from 'react';
import '../../css/CreateProjectModal.css';

const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const roleOptions = [
    'UI/UX Designer', 
    'Frontend Developer', 
    'Backend Developer', 
    'Game Developer', 
    'Team Leader', 
    'Technical Writer'
  ];

  const skillOptions = [
    'C Language', 
    'HTML and CSS', 
    'Java', 
    'PHP', 
    'JavaScript', 
    'Python',
    'Others'
  ];

  const interestOptions = [
    'Web App Development', 
    'Mobile App Development', 
    'Task Management Systems', 
    'E-Commerce Systems', 
    'Game Development', 
    'AI Development',
    'Others'
  ];

  const initialFormData = {
    projectName: '',
    projectDescription: '',
    rolesNeeded: [],
    skillsRequired: [],
    projectInterests: [],
    otherSkill: '',
    otherInterest: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({
    rolesNeeded: false,
    skillsRequired: false,
    projectInterests: false
  });

  // Reset the form when the modal is opened or closed
  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setFormData(initialFormData);
      setErrors({
        rolesNeeded: false,
        skillsRequired: false,
        projectInterests: false
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleOptionToggle = (category, option) => {
    setFormData(prevData => {
      // If option is already selected, allow deselection
      if (prevData[category].includes(option)) {
        const updatedArray = prevData[category].filter(item => item !== option);
        return {
          ...prevData,
          [category]: updatedArray
        };
      } else {
        // Check if we've reached the limit for this category
        const maxAllowed = {
          rolesNeeded: 4,
          skillsRequired: 4,
          projectInterests: 3
        };
        
        // If we've reached the limit, don't add more
        if (prevData[category].length >= maxAllowed[category]) {
          return prevData;
        }
        
        // Add the option if we haven't reached the limit
        const updatedArray = [...prevData[category], option];
        
        // Clear error if we have enough selections
        if (updatedArray.length >= maxAllowed[category]) {
          setErrors(prev => ({
            ...prev,
            [category]: false
          }));
        }
        
        return {
          ...prevData,
          [category]: updatedArray
        };
      }
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (formData.rolesNeeded.length < 4) {
      newErrors.rolesNeeded = true;
      isValid = false;
    }

    if (formData.skillsRequired.length < 4) {
      newErrors.skillsRequired = true;
      isValid = false;
    }

    if (formData.projectInterests.length < 3) {
      newErrors.projectInterests = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Process "Others" option for submission
      const processedData = {
        ...formData,
        skillsRequired: formData.skillsRequired.includes('Others')
          ? [...formData.skillsRequired.filter(s => s !== 'Others'), formData.otherSkill]
          : formData.skillsRequired,
        projectInterests: formData.projectInterests.includes('Others')
          ? [...formData.projectInterests.filter(i => i !== 'Others'), formData.otherInterest]
          : formData.projectInterests
      };
      
      onSubmit(processedData);
      
      // Reset form after submission
      setFormData(initialFormData);
    }
  };

  const handleCancel = () => {
    // Reset form data before closing
    setFormData(initialFormData);
    onClose();
  };

  if (!isOpen) return null;

  const renderOptionButtons = (options, category, selectedOptions) => {
    return (
      <div className="cp-options-container">
        {options.map(option => (
          <button
            key={option}
            type="button"
            className={`cp-option-button ${selectedOptions.includes(option) ? 'cp-option-selected' : ''}`}
            onClick={() => handleOptionToggle(category, option)}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="cp-modal-overlay">
      <div className="cp-modal-container">
        <div className="cp-modal-content">
          <form onSubmit={handleSubmit}>
            <div className="cp-form-group">
              <label className="cp-form-label">Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="cp-form-input"
                required
              />
            </div>

            <div className="cp-form-group">
              <label className="cp-form-label">Project Description</label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                className="cp-form-textarea"
                required
              />
            </div>

            <div className="cp-form-group">
              <label className="cp-form-label">Roles Needed (4 roles)</label>
              {renderOptionButtons(roleOptions, 'rolesNeeded', formData.rolesNeeded)}
              {errors.rolesNeeded && (
                <div className="cp-error-container">
                  <div className="cp-error-icon">!</div>
                  <div className="cp-error-message">Please select at least 4 roles</div>
                </div>
              )}
            </div>

            <div className="cp-form-group">
              <label className="cp-form-label">Skills Required (4 skills)</label>
              {renderOptionButtons(skillOptions, 'skillsRequired', formData.skillsRequired)}
              <input
                type="text"
                name="otherSkill"
                value={formData.otherSkill}
                onChange={handleChange}
                className="cp-form-input"
                placeholder="Specify other skill"
                disabled={!formData.skillsRequired.includes('Others')}
                required={formData.skillsRequired.includes('Others')}
                style={{ marginTop: '10px' }}
              />
              {errors.skillsRequired && (
                <div className="cp-error-container">
                  <div className="cp-error-icon">!</div>
                  <div className="cp-error-message">Please select at least 4 skills</div>
                </div>
              )}
            </div>

            <div className="cp-form-group">
              <label className="cp-form-label">Project Interests (3 interests)</label>
              {renderOptionButtons(interestOptions, 'projectInterests', formData.projectInterests)}
              <input
                type="text"
                name="otherInterest"
                value={formData.otherInterest}
                onChange={handleChange}
                className="cp-form-input"
                placeholder="Specify other interest"
                disabled={!formData.projectInterests.includes('Others')}
                required={formData.projectInterests.includes('Others')}
                style={{ marginTop: '10px' }}
              />
              {errors.projectInterests && (
                <div className="cp-error-container">
                  <div className="cp-error-icon">!</div>
                  <div className="cp-error-message">Please select at least 3 interests</div>
                </div>
              )}
            </div>

            <div className="cp-modal-buttons">
              <button 
                type="button" 
                className="cp-button cp-button-cancel" 
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="cp-button cp-button-confirm"
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;

