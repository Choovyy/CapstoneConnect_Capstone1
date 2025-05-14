import React, { useEffect, useRef, useState } from 'react';
import '../css/Navigation.css';
import '../css/Project.css'; 
import '../css/Matching.css';
import logo from '../assets/logo.png';
import CreateProjectModal from './CreateProjectModal';

const Project = () => {
  const scrollContainerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

      <button className="pj-apply-btn">Apply for Project</button>
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
      {/* Navbar (unchanged) */}
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

      {/* Section Header - Updated to match Matching.jsx style */}
      <div className="matching-container" style={{ marginBottom: '-20px' }}>
        <div className="matching-filter">
          <h1 className="matching-title">Project Needs</h1>
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
    </div>
  );
};

export default Project;