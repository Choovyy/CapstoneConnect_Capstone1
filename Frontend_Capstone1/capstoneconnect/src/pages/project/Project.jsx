import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../css/Navigation.css';
import '../../css/Project.css'; 
import Navigation from '../Navigation';
import CreateProjectModal from '../modals/CreateProjectModal';
import ApplyProjectModal from '../modals/ApplyProjectModal';
import LogoutModal from '../LogoutModal';
import NotSignedIn from '../NotSignedIn';
import Toast from '../Toast';
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
  const [currentUserId, setCurrentUserId] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });
  
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
      getUserId()
        .then(({ userId }) => {
          console.log('Setting current user ID:', userId);
          setCurrentUserId(userId);
          // Fetch projects after setting current user ID
          return fetchProjectsForUser(userId);
        })
        .catch(err => {
          console.error('Error getting user ID:', err);
          setError('Failed to get user information');
        });
    } else {
      setLoading(false);
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

  async function fetchProjectsForUser(userId) {
    setLoading(true);
    try {
      const data = await getAllProjects();
      console.log('All projects:', data);
      console.log('Current user ID:', userId);
      
      // Filter out projects created by the current user
      const filteredData = data.filter(project => {
        // Handle different possible user data structures
        const projectUserId = project.user?.id || project.userId || project.createdBy?.id || project.createdById || project.creator?.id;
        console.log('Project:', project.name, 'Project User ID:', projectUserId, 'Type:', typeof projectUserId);
        console.log('Current User ID:', userId, 'Type:', typeof userId);
        
        // Convert both to strings for comparison to handle type mismatches
        const projectUserIdStr = String(projectUserId);
        const currentUserIdStr = String(userId);
        
        const shouldShow = projectUserIdStr !== currentUserIdStr && projectUserId != null;
        console.log('Should show project:', project.name, '?', shouldShow);
        
        return shouldShow;
      });
      
      console.log('Filtered projects:', filteredData);
      setProjects(filteredData);
    } catch (err) {
      console.error('Error fetching projects:', err);
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
      setToast({
        visible: true,
        message: 'Applied successfully!',
        type: 'success'
      });
      setSearchParams({});
    } catch (err) {
      setToast({
        visible: true,
        message: 'Cannot apply twice to the same project. Wait for approval.',
        type: 'error'
      });
    }
  };

  const handleSubmitProject = async (formData) => {
    try {
      const { userId } = await getUserId();
      const payload = {
        name: formData.projectName,
        description: formData.projectDescription,
        rolesNeeded: formData.rolesNeeded,
        skillsRequired: formData.skillsRequired,
        projectInterests: formData.projectInterests,
        user: { id: userId }
      };
      await createProject(payload);
      setToast({
        visible: true,
        message: 'Project created successfully!',
        type: 'success'
      });
      setSearchParams({});
      // Use the stored currentUserId instead of fetching again
      if (currentUserId) {
        fetchProjectsForUser(currentUserId);
      }
    } catch (err) {
      setToast({
        visible: true,
        message: 'Failed to create project',
        type: 'error'
      });
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
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
      
      {/* Toast Notification */}
      {toast.visible && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={handleCloseToast} 
          duration={3000} 
        />
      )}
    </div>
  );
};

export default Project;