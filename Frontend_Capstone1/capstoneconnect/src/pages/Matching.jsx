import React from 'react';
import '../css/Navigation.css';
import '../css/Matching.css';
import logo from '../assets/logo.png';

const Matching = () => {
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
            <li className="nav-item"><a href="#">Team</a></li>
            <li className="nav-item"><a href="#">More</a></li>
          </ul>
        </nav>
        <div className="header__auth">
          <button className="btn btn--primary">Logout</button>
        </div>
      </header>
      
      <div className="matching-container">
        <div className="matching-filter">
          <h1 className="matching-title">Matching Members/Applicants</h1>
        </div>
        <div className="matching-cards">
          <div className="matching-card">
            <div className="matching-compatibility">Compatibility: <span>92%</span></div>
            <img src="https://placehold.co/144x142" alt="Profile" />
            <h2>Jane Doe</h2>
            <p>Full Stack Developer</p>
            <div className="matching-skills">Skills: React, Node.js</div>
            <div className="matching-interests">Interests: Agile Development</div>
            <div className="matching-actions">
              <button className="btn matching-approve">Approve</button>
              <button className="btn matching-reject">Reject</button>
            </div>
          </div>
          
          {/* Additional cards can be added here */}
          <div className="matching-card">
            <div className="matching-compatibility">Compatibility: <span>85%</span></div>
            <img src="https://placehold.co/144x142" alt="Profile" />
            <h2>John Smith</h2>
            <p>Data Scientist</p>
            <div className="matching-skills">Skills: Python, TensorFlow</div>
            <div className="matching-interests">Interests: AI Research</div>
            <div className="matching-actions">
              <button className="btn matching-approve">Approve</button>
              <button className="btn matching-reject">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Matching;