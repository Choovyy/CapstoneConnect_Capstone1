import React, { useEffect, useRef, useState } from 'react';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

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

  const renderCard = (project, index) => (
    <div className="yp-card" key={project.id || index}>
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
        <button className="yp-edit-btn" onClick={() => handleEditClick(project)}>
          <img src={editIcon} alt="Edit" className="yp-icon" />
        </button>
        <button className="yp-delete-btn" onClick={() => handleDeleteClick(project)}>
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

      {/* Logout Modal */}
      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </div>
  );
};

export default YourProject;
