import React, { useState } from 'react';
import '../../css/Navigation.css';
import '../../css/PendingTeam.css';
import Navigation from '../Navigation';
import LogoutModal from '../LogoutModal';

const PendingTeam = () => {
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
      
      <div className="pending-team-container">
        <div className="pending-team-filter">
          <h1 className="pending-team-title">Pending Team Members</h1>
        </div>
        <div className="pending-team-cards">
          <div className="pending-team-card">
            <div className="pending-team-compatibility">Compatibility: <span>89%</span></div>
            <img src="https://placehold.co/144x142" alt="Profile" />
            <h2>Jhovynn Aldrich Apurado</h2>
            <p>Frontend Developer</p>
            <div className="pending-team-skills">Skills: Python, Machine Learning</div>
            <div className="pending-team-interests">Interests: Collaboration</div>
            <div className="pending-team-actions">
              <button className="btn pending-team-approve">Approve</button>
              <button className="btn pending-team-reject">Reject</button>
            </div>
          </div>
          
          {/* Additional cards can be added here */}
          <div className="pending-team-card">
            <div className="pending-team-compatibility">Compatibility: <span>78%</span></div>
            <img src="https://placehold.co/144x142" alt="Profile" />
            <h2>Alex Johnson</h2>
            <p>Backend Developer</p>
            <div className="pending-team-skills">Skills: Node.js, MongoDB</div>
            <div className="pending-team-interests">Interests: Data Structures</div>
            <div className="pending-team-actions">
              <button className="btn pending-team-approve">Approve</button>
              <button className="btn pending-team-reject">Reject</button>
            </div>
          </div>
        </div>
      </div>
      
      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </>
  );
};

export default PendingTeam;