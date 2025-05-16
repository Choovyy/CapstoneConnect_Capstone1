import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/Navigation.css';
import '../../css/SuggestedTeam.css';
import Navigation from '../Navigation';
import SuggestedTeamModal from '../modals/SuggestedTeamModal';
import LogoutModal from '../LogoutModal';

const placeholderImg = "https://via.placeholder.com/222x206.png?text=Profile+Image";

const SuggestedTeam = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    role: "ui-ux-designer",
    skill: "c-language",
    preference: "web-app-dev"
  });

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      sessionStorage.setItem('jwtToken', token);
      // Remove token from URL for cleanliness
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, [location]);

  const handleSendRequest = () => {
    setShowModal(true);
  };
  
  const handleConfirm = () => {
    setShowModal(false);
  };
  
  const handleCancel = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // BACKEND INTEGRATION POINT:
    // Clear sessions, tokens, and redirect to login page
    sessionStorage.removeItem('jwtToken');
    window.location.href = '/'; // or any other login route
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setSelectedFilters(prev => ({
      ...prev,
      [id === 'roles' ? 'role' : id === 'skills' ? 'skill' : 'preference']: value
    }));
  };

  const applyFilter = () => {
    // BACKEND INTEGRATION POINT:
    // Use selectedFilters to fetch filtered teammates from backend
  };

  return (
    <div>
      {/* Header Section */}
      <Navigation onLogout={handleLogout} />

      {/* Main Content */}
      <main className="suggested-team-container">
        {/* Filter Section */}
        <section className="suggested-team-filter">
          <h1 className="suggested-team-title">Suggested Teammates</h1>
          <div className="suggested-team-filters">
            <div className="suggested-team-filter-group">
              <label htmlFor="roles">Capstone Project Roles:</label>
              <select 
                id="roles" 
                className="suggested-team-filter-select"
                value={selectedFilters.role}
                onChange={handleFilterChange}
              >
                <option value="ui-ux-designer">UI/UX Designer</option>
                <option value="frontend-developer">Frontend Developer</option>
                <option value="backend-developer">Backend Developer</option>
                <option value="dba">DBA</option>
                <option value="game-developer">Game Developer</option>
                <option value="team-leader">Team Leader</option>
                <option value="technical-writer">Technical Writer</option>
              </select>
            </div>
            <div className="suggested-team-filter-group">
              <label htmlFor="skills">Technical Skills:</label>
              <select 
                id="skills" 
                className="suggested-team-filter-select"
                value={selectedFilters.skill}
                onChange={handleFilterChange}
              >
                <option value="c-language">C Language</option>
                <option value="html-css">HTML/CSS</option>
                <option value="java">Java</option>
                <option value="php">PHP</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>
            <div className="suggested-team-filter-group">
              <label htmlFor="preferences">Project Preferences:</label>
              <select 
                id="preferences" 
                className="suggested-team-filter-select"
                value={selectedFilters.preference}
                onChange={handleFilterChange}
              >
                <option value="web-app-dev">Web App Dev</option>
                <option value="mobile-app-dev">Mobile App Dev</option>
                <option value="game-dev">Game Dev</option>
                <option value="e-commerce-systems">E-Commerce Systems</option>
                <option value="task-management-systems">Task Management Systems</option>
                <option value="ai-dev">AI Dev</option>
              </select>
            </div>
            <div className="suggested-team-filter-apply">
              <button className="btn btn--filter" onClick={applyFilter}>Apply Filter</button>
            </div>
          </div>
        </section>

        {/* Teammate Cards Section */}
        <section className="suggested-team-cards">
          <article className="suggested-team-card">
            <div className="suggested-team-card-image">
              <img src={placeholderImg} alt="Profile Placeholder" />
            </div>
            <div className="suggested-team-card-details">
              <p className="suggested-team-card-name">Name:</p>
              <p className="suggested-team-card-role">Project Roles:</p>
              <p className="suggested-team-card-skills">Technical Skills:</p>
              <p className="suggested-team-card-reference">Project Interest:</p>
            </div>
            <div className="suggested-team-card-action">
              <button className="btn btn--action" onClick={handleSendRequest}>Send Request</button>
            </div>
          </article>
        </section>
      </main>
      {showModal && <SuggestedTeamModal onConfirm={handleConfirm} onCancel={handleCancel} />}
      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </div>
  );
};

export default SuggestedTeam;