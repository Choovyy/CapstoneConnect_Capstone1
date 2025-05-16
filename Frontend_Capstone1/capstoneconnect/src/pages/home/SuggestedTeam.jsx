import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/Navigation.css';
import '../../css/SuggestedTeam.css';
import Navigation from '../Navigation';
import SuggestedTeamModal from '../modals/SuggestedTeamModal';
import LogoutModal from '../LogoutModal';

const placeholderImg = "https://placehold.co/144x142";

// Demo data for suggested teammates (replace with backend data later)
const suggestedTeammates = [
  {
    id: 1,
    name: "Sample Name",
    role: "UI/UX Designer",
    skills: "C Language",
    preference: "Web App Dev",
    img: placeholderImg,
  },
  // Add more teammates as needed
];

const SuggestedTeam = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    role: "ui-ux-designer",
    skill: "c-language",
    preference: "web-app-dev"
  });
  const [flipped, setFlipped] = useState(Array(suggestedTeammates.length).fill(false));

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
    sessionStorage.removeItem('jwtToken');
    window.location.href = '/';
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

  // Flip handler for each card
  const handleCardFlip = idx => {
    setFlipped(prev => prev.map((f, i) => (i === idx ? !f : f)));
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
              <label htmlFor="roles">Preferred Roles</label>
              <select 
                id="roles" 
                className="suggested-team-filter-select"
                value={selectedFilters.role}
                onChange={handleFilterChange}
              >
                <option value="ui-ux-designer">UI/UX Designer</option>
                <option value="frontend-developer">Frontend Developer</option>
                <option value="backend-developer">Backend Developer</option>
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
                <option value="html-css">HTML and CSS</option>
                <option value="java">Java</option>
                <option value="php">PHP</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>
            <div className="suggested-team-filter-group">
              <label htmlFor="preferences">Project Interests:</label>
              <select 
                id="preferences" 
                className="suggested-team-filter-select"
                value={selectedFilters.preference}
                onChange={handleFilterChange}
              >
                <option value="web-app-dev">Web App Development</option>
                <option value="mobile-app-dev">Mobile App Development</option>
                <option value="task-management-systems">Task Management Systems</option>
                <option value="e-commerce-systems">E-Commerce Systems</option>
                <option value="game-dev">Game Development</option>
                <option value="ai-dev">AI Development</option>
              </select>
            </div>
            <div className="suggested-team-filter-apply">
              <button className="btn btn--filter" onClick={applyFilter}>Apply Filter</button>
            </div>
          </div>
        </section>

        {/* Teammate Cards Section */}
        <section className="suggested-team-cards">
          {suggestedTeammates.map((member, idx) => (
            <div
              key={member.id}
              className={`suggested-team-card-flip${flipped[idx] ? ' flipped' : ''}`}
              onClick={() => handleCardFlip(idx)}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <div className="suggested-team-card-flip-inner">
                {/* Front Side */}
                <div className="suggested-team-card suggested-team-card-front">
                  <div className="suggested-team-card-image">
                    <img src={member.img} alt="Profile Placeholder" />
                  </div>
                  <div className="suggested-team-card-details-centered">
                    <p className="suggested-team-card-name">{member.name}</p>
                    <p className="suggested-team-card-role">{member.role}</p>
                  </div>
                  <div className="suggested-team-card-action">
                    <button
                      className="btn btn--action"
                      onClick={e => { e.stopPropagation(); handleSendRequest(); }}
                    >
                      Send Request
                    </button>
                  </div>
                </div>
                {/* Back Side */}
                <div className="suggested-team-card suggested-team-card-back">
                  <div className="suggested-team-label">Technical Skills</div>
                  <div className="suggested-team-data">{member.skills}</div>
                  <div className="suggested-team-label">Project Interest</div>
                  <div className="suggested-team-data">{member.preference}</div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
      {showModal && <SuggestedTeamModal onConfirm={handleConfirm} onCancel={handleCancel} />}
      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </div>
  );
};

export default SuggestedTeam;