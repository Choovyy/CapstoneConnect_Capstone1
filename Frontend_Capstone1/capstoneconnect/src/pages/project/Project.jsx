import React, { useEffect, useRef, useState } from 'react';
import '../../css/Navigation.css';
import '../../css/Project.css'; 
import Navigation from '../Navigation';
import CreateProjectModal from '../modals/CreateProjectModal';
import ApplyProjectModal from '../modals/ApplyProjectModal';
import LogoutModal from '../LogoutModal';

const Project = () => {
  const scrollContainerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // Clear sessions, tokens, and redirect to login page
    sessionStorage.removeItem('jwtToken');
    window.location.href = '/';
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      scrollContainer.classList.add('active');
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      scrollContainer.classList.remove('active');
    };

    const handleMouseUp = () => {
      isDown = false;
      scrollContainer.classList.remove('active');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2; 
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e) => {
      isDown = true;
      scrollContainer.classList.add('active');
      startX = e.touches[0].pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const handleTouchMove = (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    scrollContainer.addEventListener('mousedown', handleMouseDown);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('mouseup', handleMouseUp);
    scrollContainer.addEventListener('mousemove', handleMouseMove);
    
    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchend', handleMouseUp);
    scrollContainer.addEventListener('touchcancel', handleMouseLeave);
    scrollContainer.addEventListener('touchmove', handleTouchMove);

    return () => {
      scrollContainer.removeEventListener('mousedown', handleMouseDown);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      scrollContainer.removeEventListener('mouseup', handleMouseUp);
      scrollContainer.removeEventListener('mousemove', handleMouseMove);
      
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchend', handleMouseUp);
      scrollContainer.removeEventListener('touchcancel', handleMouseLeave);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const projectDetails = {
    title: 'Social Media Analytics',
    description: 'An application to analyze social media engagement and trends',
    roles: ['Data Analyst', 'Frontend Developer', 'Backend Developer'],
    skills: ['React', 'Python', 'Data Visualization', 'API Development'],
    interests: ['Real-time Analytics', 'Social Media Monitoring', 'Engage Metrics'],
    creator: 'John Doe'
  };

  const handleApplyClick = () => {
    setSelectedProject(projectDetails);
    setIsApplyModalOpen(true);
  };

  const handleApplyClose = () => {
    setIsApplyModalOpen(false);
  };

  const handleApplyConfirm = () => {
    console.log('Applied for project:', selectedProject?.title);
    // Here you would typically send this application to your backend API
    setIsApplyModalOpen(false);
  };

  const renderCard = (_, index) => (
    <div className="pj-card" key={index}>
      <div className="pj-header">
        <h3><strong>{projectDetails.title}</strong></h3>
        <p>{projectDetails.description}</p>
      </div>

      <div className="pj-body">
        <p><strong>Roles Needed:</strong></p>
        <ul>
          {projectDetails.roles.map((role, i) => <li key={i}>{role}</li>)}
        </ul>

        <p><strong>Skills Required:</strong></p>
        <ul>
          {projectDetails.skills.map((skill, i) => <li key={i}>{skill}</li>)}
        </ul>

        <p><strong>Project Interests:</strong></p>
        <ul>
          {projectDetails.interests.map((interest, i) => <li key={i}>{interest}</li>)}
        </ul>
      </div>

      <button className="pj-apply-btn" onClick={handleApplyClick}>Apply for Project</button>
    </div>
  );

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitProject = (formData) => {
    console.log('New project data:', formData);
    // Here you would typically send this data to your backend API
    // For now, we'll just close the modal
    setIsModalOpen(false);
  };

  return (
    <div>
      <div>
        <Navigation onLogout={handleLogout} />
      </div>
      
      {/* Section Header - Updated to match Matching.jsx style */}
      <div className="pj-container" style={{ marginBottom: '-20px' }}>
        <div className="pj-filter">
          <h1 className="pj-title">Project Needs</h1>
        </div>
        <div className="pj-create-btn-container">
          <button className="pj-create-btn" onClick={handleOpenModal}>Create Project</button>
        </div>
      </div>

      {/* Project Cards */}
      <main className="pj-main">
        <div className="pj-scroll-container" ref={scrollContainerRef}>
          <div className="pj-grid">
            {Array(10).fill(null).map(renderCard)}
          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
      />

      {/* Apply Project Modal */}
      <ApplyProjectModal 
        isOpen={isApplyModalOpen}
        onClose={handleApplyClose}
        onConfirm={handleApplyConfirm}
        projectCreator={selectedProject?.creator}
      />

      {/* Logout Modal */}
      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </div>
  );
};

export default Project;