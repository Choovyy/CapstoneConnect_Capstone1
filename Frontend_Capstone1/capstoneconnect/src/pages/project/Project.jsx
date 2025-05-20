import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../css/Navigation.css';
import '../../css/Project.css'; 
import Navigation from '../Navigation';
import CreateProjectModal from '../modals/CreateProjectModal';
import ApplyProjectModal from '../modals/ApplyProjectModal';
import LogoutModal from '../LogoutModal';
import NotSignedIn from '../NotSignedIn';
import { getAllProjects, createProject, applyToProject, getUserId } from '../../api';

const Project = () => {
  const scrollContainerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
  const tooltipRef = useRef(null);
  
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
  
  const handleSignIn = () => {
    window.location.href = '/';
  };
  
  // Function to handle card hovering
  const handleCardMouseMove = (e) => {
    if (e.target.closest('.pj-apply-btn')) {
      setTooltip({ visible: false, x: 0, y: 0 });
      return;
    }
    
    setTooltip({
      visible: true,
      x: e.clientX + 15, // Offset to the right of the cursor
      y: e.clientY - 10  // Offset slightly above the cursor
    });
  };
  
  const handleCardMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };
  
  // Update tooltip position
  useEffect(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${tooltip.x}px`;
      tooltipRef.current.style.top = `${tooltip.y}px`;
    }
  }, [tooltip]);
  
  const toggleFlip = (projectId, event) => {
    // Don't flip if clicking on the apply button
    if (event.target.closest('.pj-apply-btn')) {
      return;
    }
    
    // If clicking the same card, toggle its state
    if (flippedCardId === projectId) {
      setFlippedCardId(null);
    } else {
      // If clicking a different card, close any open card and flip this one
      setFlippedCardId(projectId);
    }
  };
  
  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
      fetchProjects();
    }
    
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

    if (scrollContainer) {
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
    }
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  const isCreateModalOpen = searchParams.get('modal') === 'create';
  const isApplyModalOpen = searchParams.get('modal') === 'apply';

  const handleOpenModal = () => setSearchParams({ modal: 'create' });
  const handleCloseModal = () => setSearchParams({});
  const handleApplyClick = (project) => {
    setSelectedProject(project);
    setSearchParams({ modal: 'apply' });
  };
  const handleApplyClose = () => setSearchParams({});

  const handleApplyConfirm = async () => {
    try {
      const { userId } = await getUserId();
      await applyToProject(selectedProject.id, userId);
      alert('Applied successfully!');
      setSearchParams({});
    } catch (err) {
      alert('Failed to apply: ' + err.message);
    }
  };

  const handleSubmitProject = async (formData) => {
    try {
      const { userId } = await getUserId();
      const payload = {
        name: formData.projectName, // map to backend field
        description: formData.projectDescription, // map to backend field
        rolesNeeded: formData.rolesNeeded,
        skillsRequired: formData.skillsRequired,
        projectInterests: formData.projectInterests,
        user: { id: userId }
      };
      await createProject(payload);
      setSearchParams({});
      fetchProjects();
    } catch (err) {
      alert('Failed to create project: ' + err.message);
    }
  };

  const renderCard = (project, index) => (
    <div 
      className={`pj-card ${flippedCardId === project.id ? 'flipped' : ''}`} 
      key={project.id || index}
      onClick={(e) => toggleFlip(project.id, e)}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
    >
      <div className="pj-header">
        <h3><strong>{project.name}</strong></h3>
        <p>{project.description}</p>
      </div>
      <div className="pj-body">
        <p><strong>Roles Needed:</strong></p>
        <ul>
          {project.rolesNeeded && project.rolesNeeded.map((role, i) => <li key={i}>{role}</li>)}
        </ul>
        <p><strong>Skills Required:</strong></p>
        <ul>
          {project.skillsRequired && project.skillsRequired.map((skill, i) => <li key={i}>{skill}</li>)}
        </ul>
        <p><strong>Project Interests:</strong></p>
        <ul>
          {project.projectInterests && project.projectInterests.map((interest, i) => <li key={i}>{interest}</li>)}
        </ul>
      </div>
      <button className="pj-apply-btn" onClick={() => handleApplyClick(project)}>Apply for Project</button>
    </div>
  );

  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
  }

  return (
    <div>
      <div>
        <Navigation onLogout={handleLogout} />
      </div>
      
      {/* Section Header - Updated to match Matching.jsx style */}
      <div className="pj-container" style={{ marginBottom: '-30px' }}>
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
            {loading ? <div>Loading...</div> : error ? <div>{error}</div> : projects.map(renderCard)}
          </div>
        </div>
      </main>

      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        className={`pj-tooltip ${tooltip.visible ? 'visible' : ''}`}
      >
        Click to view more details
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={isCreateModalOpen}
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