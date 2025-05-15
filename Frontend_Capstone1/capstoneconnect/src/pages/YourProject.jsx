import React, { useEffect, useRef, useState } from 'react';
import '../css/Navigation.css';
import '../css/YourProject.css'; 
import '../css/Matching.css';
import logo from '../assets/logo.png';
import editIcon from '../assets/edit.png';
import deleteIcon from '../assets/delete.png';
import EditProjectModal from './EditProjectModal';
import DeleteProjectModal from './DeleteProjectModal';

const YourProject = () => {
  const scrollContainerRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
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
    interests: ['Real-time Analytics', 'Social Media Monitoring', 'Engage Metrics']
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = (updatedProject) => {
    // Handle the updated project data here
    console.log('Updated project:', updatedProject);
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    // Handle project deletion here
    console.log('Deleting project:', selectedProject);
    setIsDeleteModalOpen(false);
  };

  const renderCard = (_, index) => (
    <div className="yp-card" key={index}>
      <div className="yp-header">
        <h3><strong>{projectDetails.title}</strong></h3>
        <p>{projectDetails.description}</p>
      </div>

      <div className="yp-body">
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

      <div className="yp-actions">
        <button className="yp-edit-btn" onClick={() => handleEditClick(projectDetails)}>
          <img src={editIcon} alt="Edit" className="yp-icon" />
        </button>
        <button className="yp-delete-btn" onClick={() => handleDeleteClick(projectDetails)}>
          <img src={deleteIcon} alt="Delete" className="yp-icon" />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Navbar */}
      <header className="site-header">
        <div className="header__logo">
          <a href="#">
            <img src={logo} alt="Logo" />
          </a>
        </div>
        <nav className="header__nav">
          <ul className="nav-list">
            <li className="nav-item"><a href="#">Home</a></li>
            <li className="nav-item"><a href="#">Profile</a></li>
            <li className="nav-item"><a href="#">Projects</a></li>
            <li className="nav-item"><a href="#">Team</a></li>
            <li className="nav-item"><a href="#">More</a></li>
          </ul>
        </nav>
        <div className="header__auth">
          <button className="btn btn--primary">Logout</button>
        </div>
      </header>

      {/* Section Header */}
      <div className="matching-container" style={{ marginBottom: '-20px' }}>
        <div className="matching-filter">
          <h1 className="matching-title">Your Projects</h1>
        </div>
      </div>

      {/* Project Cards */}
      <main className="yp-main">
        <div className="yp-scroll-container" ref={scrollContainerRef}>
          <div className="yp-grid">
            {Array(10).fill(null).map(renderCard)}
          </div>
        </div>
      </main>

      {/* Edit Project Modal */}
      <EditProjectModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        project={selectedProject}
      />

      {/* Delete Project Modal */}
      <DeleteProjectModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        projectTitle={selectedProject?.title}
      />
    </div>
  );
};

export default YourProject;
