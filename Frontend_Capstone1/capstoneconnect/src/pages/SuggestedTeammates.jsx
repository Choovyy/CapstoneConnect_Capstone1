import React from 'react';
import '../css/SuggestedTeammates.css';
import logo from '../assets/logo.png';

const SuggestedTeammates = () => {
  return (
    <div>
      {/* Header Section */}
      <header className="site-header">
        <div className="header__logo">
          <a href="#">
            <img src={logo} alt="Figma Logo" />
          </a>
        </div>
        <nav className="header__nav">
          <ul className="nav-list">
            <li className="nav-item nav-item--active"><a href="#">Home</a></li>
            <li className="nav-item"><a href="#">Dashboard</a></li>
            <li className="nav-item"><a href="#">Profile</a></li>
            <li className="nav-item"><a href="#">Projects</a></li>
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
              <select id="roles" className="filter-select">
                <option value="ui-ux-designer">UI/UX Designer</option>
                <option value="frontend-developer">Frontend Developer</option>
                <option value="backend-developer">Backend Devoper</option>
                <option value="dba">DBA</option>
                <option value="game-developer">Game Developer</option>
                <option value="team-leader">Team Leader</option>
                <option value="technical-writer">Techinal Writer</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="skills">Technical Skills:</label>
              <select id="skills" className="filter-select">
                <option value="c-language">C Language</option>
                <option value="html-css">HTML/CSS</option>
                <option value="java">Java</option>
                <option value="php">Php</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="preferences">Project Preferences:</label>
              <select id="preferences" className="filter-select">
                <option value="web-app-dev">Web App Dev</option>
                <option value="mobile-app-dev">Mobile App Dev</option>
                <option value="game-dev">Game Dev</option>
                <option value="e-commerce-systems">E-Commerce Systems</option>
                <option value="task-management-systems">Task Management Systems</option>
                <option value="ai-dev">AI Dev</option>
              </select>
            </div>
            <div className="filter-group filter-apply">
              <button className="btn btn--filter">Apply Filter</button>
            </div>
          </div>
        </section>

        {/* Teammate Cards Section */}
        <section className="teammates-cards">
          {/* Example card (commented out like in original) */}
           <article className="card">
            <div className="card__image">
              <img src="https://placehold.co/222x206" alt="Team Mate Photo" />
            </div>
            <div className="card__details">
              <p className="card__name">Name: </p>
              <p className="card__role">Project Roles: </p>
              <p className="card__skills">Technical Skills: </p>
              <p className="card__reference">Project Reference: </p>
              <p className="card__compatibility">
                Compatibility: <span>89%</span>
              </p>
            </div>
            <div className="card__action">
              <button className="btn btn--action">Send Request</button>
            </div>
          </article>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="site-footer">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SuggestedTeammates;