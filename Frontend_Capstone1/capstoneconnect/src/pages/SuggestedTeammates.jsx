import React, { useState, useEffect } from 'react';
import '../css/SuggestedTeammates.css';
import logo from '../assets/logo.png';
import SuggestedTeamModal from './SuggestedTeamModal';

const SuggestedTeammates = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    role: "ui-ux-designer",
    skill: "c-language",
    preference: "web-app-dev"
  });
  const [teammates, setTeammates] = useState([]);
  
  // Sample data for teammates
  const sampleTeammates = [
    {
      id: 1,
      name: "John Doe",
      role: "Frontend Developer",
      skills: "HTML/CSS, JavaScript",
      reference: "Web App Dev",
      compatibility: 89,
      image: "https://placehold.co/222x206"
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "UI/UX Designer",
      skills: "Figma, Adobe XD",
      reference: "Mobile App Dev",
      compatibility: 92,
      image: "https://placehold.co/222x206"
    },
    {
      id: 3,
      name: "Alex Johnson",
      role: "Backend Developer",
      skills: "Python, Java",
      reference: "E-Commerce Systems",
      compatibility: 78,
      image: "https://placehold.co/222x206"
    }
  ];

  useEffect(() => {
    // In a real app, this would be an API call
    setTeammates(sampleTeammates);
  }, []);

  const handleSendRequest = () => {
    setShowModal(true);
  };
  
  const handleConfirm = () => {
    // Logic for when request is confirmed
    console.log("Request confirmed");
    setShowModal(false);
    // Could add notification or update UI
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
    console.log("Applying filters:", selectedFilters);
    // In a real app, this would filter data based on selected filters
    // For now, we'll just log the filters
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
          {teammates.map(teammate => (
            <article className="card" key={teammate.id}>
              <div className="card__image">
                <img src={teammate.image} alt={`${teammate.name} profile`} />
              </div>
              <div className="card__details">
                <p className="card__name">Name: {teammate.name}</p>
                <p className="card__role">Project Roles: {teammate.role}</p>
                <p className="card__skills">Technical Skills: {teammate.skills}</p>
                <p className="card__reference">Project Reference: {teammate.reference}</p>
                <p className="card__compatibility">
                  Compatibility: <span>{teammate.compatibility}%</span>
                </p>
              </div>
              <div className="card__action">
                <button className="btn btn--action" onClick={handleSendRequest}>Send Request</button>
              </div>
            </article>
          ))}
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

export default SuggestedTeammates;