import React, { useState } from 'react';
import '../../css/Navigation.css';
import '../../css/Matching.css';
import Navigation from '../Navigation';
import LogoutModal from '../LogoutModal';

const matchingMembers = [
  {
    id: 1,
    name: 'Jane Doe',
    role: 'Full Stack Developer',
    compatibility: 92,
    img: 'https://placehold.co/144x142',
    skills: 'React, Node.js',
    interests: 'Agile Development',
  },
  {
    id: 2,
    name: 'John Smith',
    role: 'Data Scientist',
    compatibility: 85,
    img: 'https://placehold.co/144x142',
    skills: 'Python, TensorFlow',
    interests: 'AI Research',
  },
];

const Matching = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [flipped, setFlipped] = useState(Array(matchingMembers.length).fill(false));

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

  const handleCardFlip = idx => {
    setFlipped(prev => prev.map((f, i) => (i === idx ? !f : f)));
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
          {matchingMembers.map((member, idx) => (
            <div
              key={member.id}
              className={`matching-card-flip${flipped[idx] ? ' flipped' : ''}`}
              onClick={() => handleCardFlip(idx)}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <div className="matching-card-flip-inner">
                {/* Front Side */}
                <div className="matching-card matching-card-front">
                  <div className="matching-compatibility">
                    Compatibility: <span>{member.compatibility}%</span>
                  </div>
                  <img src={member.img} alt="Profile" />
                  <h2>{member.name}</h2>
                  <p>{member.role}</p>
                  <div className="matching-actions">
                    <button
                      className="btn matching-approve"
                      onClick={e => { e.stopPropagation(); /* handleApprove(member.id) */ }}
                    >
                      Approve
                    </button>
                    <button
                      className="btn matching-reject"
                      onClick={e => { e.stopPropagation(); /* handleReject(member.id) */ }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                {/* Back Side */}
                <div className="matching-card matching-card-back">
                  <div className="matching-skills">Technical Skills</div>
                  <div className="matching-skills-data">{member.skills}</div>
                  <div className="matching-interests">Project Interests</div>
                  <div className="matching-interests-data">{member.interests}</div>
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

export default Matching;