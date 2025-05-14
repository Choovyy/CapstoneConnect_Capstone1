import React from 'react';
import '../css/PendingTeam.css'; // Assuming you have a CSS file for styling
import logo from '../assets/logo.png'; // Placeholder for your logo

const PendingTeam = () => {
  return (
    <>
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
            <li className="nav-item"><a href="#">Teams</a></li>
            <li className="nav-item"><a href="#">More</a></li>
          </ul>
        </nav>
        <div className="header__auth">
          <button className="btn btn--primary">Logout</button>
        </div>
      </header>
      
      <div className="container">
        <div className="teammates-filter">
          <h1 className="section-title">Pending Team Members</h1>
        </div>
        <div className="cards">
          <div className="card">
            <div className="compatibility">Compatibility: <span>89%</span></div>
            <img src="https://placehold.co/144x142" alt="Profile" />
            <h2>Jhovynn Aldrich Apurado</h2>
            <p>Frontend Developer</p>
            <div className="skills">Skills: Python, Machine Learning</div>
            <div className="interests">Interests: Collaboration</div>
            <div className="actions">
              <button className="btn approve">Approve</button>
              <button className="btn reject">Reject</button>
            </div>
          </div>
          
          {/* Additional cards can be added here */}
          <div className="card">
            <div className="compatibility">Compatibility: <span>78%</span></div>
            <img src="https://placehold.co/144x142" alt="Profile" />
            <h2>Alex Johnson</h2>
            <p>Backend Developer</p>
            <div className="skills">Skills: Node.js, MongoDB</div>
            <div className="interests">Interests: Data Structures</div>
            <div className="actions">
              <button className="btn approve">Approve</button>
              <button className="btn reject">Reject</button>
            </div>
          </div>
          
          <div className="card">
            <div className="compatibility">Compatibility: <span>92%</span></div>
            <img src="https://placehold.co/144x142" alt="Profile" />
            <h2>Maria Garcia</h2>
            <p>UI/UX Designer</p>
            <div className="skills">Skills: Figma, Adobe XD</div>
            <div className="interests">Interests: User Research</div>
            <div className="actions">
              <button className="btn approve">Approve</button>
              <button className="btn reject">Reject</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="site-footer">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
      </footer>
    </>
  );
};

export default PendingTeam;