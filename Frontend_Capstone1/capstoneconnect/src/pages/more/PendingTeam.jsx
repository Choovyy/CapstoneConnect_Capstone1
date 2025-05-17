import React, { useState, useEffect } from 'react';
import '../../css/Navigation.css';
import '../../css/PendingTeam.css';
import Navigation from '../Navigation';
import LogoutModal from '../LogoutModal';
import NotSignedIn from '../NotSignedIn';

// Demo data for pending team members
const pendingMembers = [
  {
    id: 1,
    name: 'Jhovynn Aldrich Apurado',
    role: 'Frontend Developer',
    compatibility: 89,
    img: 'https://placehold.co/144x142',
    skills: 'Python, Machine Learning',
    interests: 'Collaboration',
  },
  {
    id: 2,
    name: 'Alex Johnson',
    role: 'Backend Developer',
    compatibility: 78,
    img: 'https://placehold.co/144x142',
    skills: 'Node.js, MongoDB',
    interests: 'Data Structures',
  },
];

const PendingTeam = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // Flip state for each card
  const [flipped, setFlipped] = useState(Array(pendingMembers.length).fill(false));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

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

  // Flip handler for each card
  const handleCardFlip = idx => {
    setFlipped(prev => prev.map((f, i) => (i === idx ? !f : f)));
  };

  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
  }

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
          {pendingMembers.map((member, idx) => (
            <div
              key={member.id}
              className={`pending-team-card-flip${flipped[idx] ? ' flipped' : ''}`}
              onClick={() => handleCardFlip(idx)}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <div className="pending-team-card-flip-inner">
                {/* Front Side */}
                <div className="pending-team-card pending-team-card-front">
                  <div className="pending-team-compatibility">
                    Compatibility: <span>{member.compatibility}%</span>
                  </div>
                  <img src={member.img} alt="Profile" />
                  <h2>{member.name}</h2>
                  <p>{member.role}</p>
                  <div className="pending-team-actions">
                    <button
                      className="btn pending-team-approve"
                      onClick={e => { e.stopPropagation(); /* handleApprove(member.id) */ }}
                    >
                      Approve
                    </button>
                    <button
                      className="btn pending-team-reject"
                      onClick={e => { e.stopPropagation(); /* handleReject(member.id) */ }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                {/* Back Side */}
                <div className="pending-team-card pending-team-card-back">
                  <div className="pending-team-label">Technical Skills</div>
                  <div className="pending-team-data">{member.skills}</div>
                  <div className="pending-team-label">Project Interests</div>
                  <div className="pending-team-data">{member.interests}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </>
  );
};

export default PendingTeam;