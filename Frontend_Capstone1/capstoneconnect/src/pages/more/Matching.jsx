import React, { useState } from 'react';
import '../../css/Navigation.css';
import '../../css/Matching.css';
import Navigation from '../Navigation';
import LogoutModal from '../LogoutModal';

const Matching = () => {
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

  return (
    <>
      <div>
        <Navigation onLogout={handleLogout} />
      </div>
      
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
      
      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </>
  );
};

export default Matching;