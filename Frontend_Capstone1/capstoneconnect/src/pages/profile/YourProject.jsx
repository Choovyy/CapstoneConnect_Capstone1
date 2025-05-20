import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../css/Navigation.css';
import '../../css/YourProject.css'; 
import Navigation from '../Navigation';
import editIcon from '../../assets/edit.png';
import deleteIcon from '../../assets/delete.png';
import EditProjectModal from '../modals/EditProjectModal';
import DeleteProjectModal from '../modals/DeleteProjectModal';
import LogoutModal from '../LogoutModal';
import NotSignedIn from '../NotSignedIn';
import { getProjectsByUser, updateProject, deleteProject, getUserId } from '../../api';

const YourProject = () => {
  const scrollContainerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
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
  
  const toggleFlip = (projectId, event) => {
    // Don't flip if clicking on the edit or delete buttons
    if (event.target.closest('.yp-edit-btn') || event.target.closest('.yp-delete-btn')) {
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
      fetchUserProjects();
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

  async function fetchUserProjects() {
    setLoading(true);
    try {
      const { userId } = await getUserId();
      const data = await getProjectsByUser(userId);
      setProjects(data);
    } catch (err) {
      setError('Failed to load your projects');
    } finally {
      setLoading(false);
    }
  }

  const isEditModalOpen = searchParams.get('modal') === 'edit';
  const isDeleteModalOpen = searchParams.get('modal') === 'delete';

  const handleEditClick = (e, project) => {
    e.stopPropagation();
    setSelectedProject({
      title: project.name || '',
      description: project.description || '',
      roles: project.rolesNeeded || [],
      skills: project.skillsRequired || [],
      interests: project.projectInterests || [],
      id: project.id
    });
    setSearchParams({ modal: 'edit' });
  };

  const handleDeleteClick = (e, project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setSearchParams({ modal: 'delete' });
  };

  const handleEditModalClose = () => setSearchParams({});
  const handleDeleteModalClose = () => setSearchParams({});

  const handleEditSubmit = async (updatedProject) => {
    // Map frontend fields to backend fields
    const payload = {
      ...updatedProject,
      name: updatedProject.projectName,
      description: updatedProject.projectDescription,
    };
    delete payload.projectName;
    delete payload.projectDescription;
    try {
      await updateProject(selectedProject.id, payload);
      setIsEditModalOpen(false);
      fetchUserProjects();
    } catch (err) {
      alert('Failed to update project: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(selectedProject.id);
      setIsDeleteModalOpen(false);
      fetchUserProjects();
    } catch (err) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  // Function to handle card hovering
  const handleCardMouseMove = (e) => {
    if (e.target.closest('.yp-edit-btn') || e.target.closest('.yp-delete-btn')) {
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

  const renderCard = (project, index) => (
    <div 
      className={`yp-card ${flippedCardId === project.id ? 'flipped' : ''}`} 
      key={project.id || index}
      onClick={(e) => toggleFlip(project.id, e)}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
    >
      <div className="yp-header">
        <h3><strong>{project.name}</strong></h3>
        <p>{project.description}</p>
      </div>
      <div className="yp-body">
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
      <div className="yp-actions">
        <button className="yp-edit-btn" onClick={(e) => handleEditClick(e, project)}>
          <img src={editIcon} alt="Edit" className="yp-icon" />
        </button>
        <button className="yp-delete-btn" onClick={(e) => handleDeleteClick(e, project)}>
          <img src={deleteIcon} alt="Delete" className="yp-icon" />
        </button>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
  }

  return (
    <div>
      {/* Navbar */}
      <div>
        <Navigation onLogout={handleLogout} />
      </div>
          
      {/* Section Header */}
      <div className="yp-container" style={{ marginBottom: '-35px' }}>
        <div className="yp-filter">
          <h1 className="yp-title">Your Projects</h1>
        </div>
      </div>

      {/* Project Cards */}
      <main className="yp-main">
        <div className="yp-scroll-container" ref={scrollContainerRef}>
          <div className="yp-grid">
            {loading ? <div>Loading...</div> : error ? <div>{error}</div> : projects.map(renderCard)}
          </div>
        </div>
      </main>

      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        className={`yp-tooltip ${tooltip.visible ? 'visible' : ''}`}
      >
        Click to view more details
      </div>

      {/* Edit Project Modal */}
      <EditProjectModal 
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditSubmit}
        project={selectedProject}
      />

      {/* Delete Project Modal */}
      <DeleteProjectModal 
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        projectTitle={selectedProject?.title}
      />

      {/* Logout Modal */}
      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </div>
  );
};

export default YourProject;
