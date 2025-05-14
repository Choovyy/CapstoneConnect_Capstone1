import React, { useState } from 'react';
import '../css/SuggestedTeam.css';
import logo from '../assets/logo.png';
import SuggestedTeamModal from './SuggestedTeamModal';

// Placeholder profile image (you can replace this with your own placeholder asset)
const placeholderImg = "https://via.placeholder.com/222x206.png?text=Profile+Image";

const SuggestedTeam = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    role: "ui-ux-designer",
    skill: "c-language",
    preference: "web-app-dev"
  });

  const handleSendRequest = () => {
    setShowModal(true);
  };
  
  const handleConfirm = () => {
    setShowModal(false);
  };
  
  const handleCancel = () => {
    setShowModal(false);
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
      <header className="site-header">
        <div className="header__logo">
          <a href="#">
            <img src={logo} alt="CapstoneConnect Logo" />
          </a>
        </div>
        <nav className="header__nav">
          <ul className="nav-list">
            <li className="nav-item nav-item--active"><a href="#">Home</a></li>
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

      {/* Main Content */}
      <main className="container">
        {/* Filter Section */}
        <section className="teammates-filter">
          <h1 className="section-title">Suggested Teammates</h1>
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="roles">Capstone Project Roles:</label>
              <select 
                id="roles" 
                className="filter-select"
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
            <div className="filter-group">
              <label htmlFor="skills">Technical Skills:</label>
              <select 
                id="skills" 
                className="filter-select"
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
            <div className="filter-group">
              <label htmlFor="preferences">Project Preferences:</label>
              <select 
                id="preferences" 
                className="filter-select"
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
            <div className="filter-group filter-apply">
              <button className="btn btn--filter" onClick={applyFilter}>Apply Filter</button>
            </div>
          </div>
        </section>

        {/* Teammate Cards Section */}
        <section className="teammates-cards">
          {/* 
            BACKEND INTEGRATION POINT:
            Map teammates array from backend here.
            Replace the placeholder card below with dynamic mapping.
          */}
          <article className="card">
            <div className="card__image">
              <img src={placeholderImg} alt="Profile Placeholder" />
            </div>
            <div className="card__details">
              <p className="card__name">Name:</p>
              <p className="card__role">Project Roles:</p>
              <p className="card__skills">Technical Skills:</p>
              <p className="card__reference">Project Interest:</p>
            </div>
            <div className="card__action">
              <button className="btn btn--action" onClick={handleSendRequest}>Send Request</button>
            </div>
          </article>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="site-footer">
        <p>&copy; 2025 CapstoneConnect. All rights reserved.</p>
      </footer>

      {/* Render Modal conditionally */}
      {showModal && <SuggestedTeamModal onConfirm={handleConfirm} onCancel={handleCancel} />}
    </div>
  );
};

export default SuggestedTeam;