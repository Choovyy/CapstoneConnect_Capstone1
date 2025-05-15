import React, { useState, useEffect } from 'react';
import '../css/CreateProjectModal.css';

const EditProjectModal = ({ isOpen, onClose, onSubmit, project }) => {
  const roleOptions = [
    'UI/UX Developer', 
    'Frontend Developer', 
    'Backend Developer', 
    'Game Developer', 
    'Team Leader', 
    'Technical Writer',
    'Others'
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
    otherRole: '',
    otherSkill: '',
    otherInterest: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({
    rolesNeeded: false,
    skillsRequired: false,
    projectInterests: false
  });

  // Set form data when project prop changes or modal opens
  useEffect(() => {
    if (isOpen && project) {
      setFormData({
        projectName: project.title || '',
        projectDescription: project.description || '',
        rolesNeeded: project.roles || [],
        skillsRequired: project.skills || [],
        projectInterests: project.interests || [],
        otherRole: '',
        otherSkill: '',
        otherInterest: ''
      });
    } else if (!isOpen) {
      // Reset form when modal is closed
      setFormData(initialFormData);
      setErrors({
        rolesNeeded: false,
        skillsRequired: false,
        projectInterests: false
      });
    }
  }, [isOpen, project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleOptionToggle = (category, option) => {
    setFormData(prevData => {
      let updatedArray;
      if (prevData[category].includes(option)) {
        // Remove the option if already selected
        updatedArray = prevData[category].filter(item => item !== option);
      } else {
        // Add the option if not already selected
        updatedArray = [...prevData[category], option];
      }
      
      // Clear error if at least 2 options are selected
      if (updatedArray.length >= 2) {
        setErrors(prev => ({
          ...prev,
          [category]: false
        }));
      }
      
      return {
        ...prevData,
        [category]: updatedArray
      };
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (formData.rolesNeeded.length < 2) {
      newErrors.rolesNeeded = true;
      isValid = false;
    }

    if (formData.skillsRequired.length < 2) {
      newErrors.skillsRequired = true;
      isValid = false;
    }

    if (formData.projectInterests.length < 2) {
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
        rolesNeeded: formData.rolesNeeded.includes('Others') 
          ? [...formData.rolesNeeded.filter(r => r !== 'Others'), formData.otherRole] 
          : formData.rolesNeeded,
        skillsRequired: formData.skillsRequired.includes('Others')
          ? [...formData.skillsRequired.filter(s => s !== 'Others'), formData.otherSkill]
          : formData.skillsRequired,
        projectInterests: formData.projectInterests.includes('Others')
          ? [...formData.projectInterests.filter(i => i !== 'Others'), formData.otherInterest]
          : formData.projectInterests
      };
      
      onSubmit(processedData);
    }
  };

  const handleCancel = () => {
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
              <label className="cp-form-label">Roles Needed</label>
              {renderOptionButtons(roleOptions, 'rolesNeeded', formData.rolesNeeded)}
              <input
                type="text"
                name="otherRole"
                value={formData.otherRole}
                onChange={handleChange}
                className="cp-form-input"
                placeholder="Specify other role"
                disabled={!formData.rolesNeeded.includes('Others')}
                required={formData.rolesNeeded.includes('Others')}
                style={{ marginTop: '10px' }}
              />
              {errors.rolesNeeded && (
                <div className="cp-error-container">
                  <div className="cp-error-icon">!</div>
                  <div className="cp-error-message">Please select at least 2 roles</div>
                </div>
              )}
            </div>

            <div className="cp-form-group">
              <label className="cp-form-label">Skills Required</label>
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
                  <div className="cp-error-message">Please select at least 2 skills</div>
                </div>
              )}
            </div>

            <div className="cp-form-group">
              <label className="cp-form-label">Project Interests</label>
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
                  <div className="cp-error-message">Please select at least 2 interests</div>
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
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
