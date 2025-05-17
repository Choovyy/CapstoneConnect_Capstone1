import React, { useState, useEffect } from 'react';
import '../../css/Navigation.css';
import '../../css/SentRequest.css';
import Navigation from '../Navigation';
import LogoutModal from '../LogoutModal';
import NotSignedIn from '../NotSignedIn';

const SentRequest = () => {
  // TODO: Replace the static card data below with dynamic data from backend
  // Example: Fetch sent requests from API and map over them to render cards
  // const sentRequests = props.sentRequests || [];
  // sentRequests.map((request) => ( ... ))

  // For demo, using a single card. For dynamic, use state for each card's flip.
  const [isFlipped, setIsFlipped] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // TODO: For multiple cards, use an array of flip states or card IDs.

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

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

  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
  }

  return (
    <>
      <div>
        <Navigation onLogout={handleLogout} />
      </div>
      
      <div className="sentrequest-noscroll">
        <div className="sentrequest-container">
          <div className="sentrequest-filter">
            <h1 className="sentrequest-title">Sent Request</h1>
          </div>
          <div className="sentrequest-cards">
            {/* 
              TODO: Replace this static card with a .map() over sent requests from backend.
              Example:
              {sentRequests.map((req, idx) => (
                <div className={`sentrequest-card-flip${isFlipped[idx] ? ' flipped' : ''}`} onClick={() => handleCardClick(idx)} key={req.id}>
                  ...
                </div>
              ))}
            */}
            <div
              className={`sentrequest-card-flip${isFlipped ? ' flipped' : ''}`}
              onClick={handleCardClick}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <div className="sentrequest-card-flip-inner">
                {/* Front Side */}
                <div className="sentrequest-card sentrequest-card-front">
                  <div className="sentrequest-compatibility">Compatibility: <span>88%</span></div>
                  <img src="https://placehold.co/144x142" alt="Profile" />
                  <h2>Emily Carter</h2>
                  <p>UI/UX Designer</p>
                  <div className="sentrequest-status">Request Sent!</div>
                  <div className="sentrequest-actions">
                    {/* 
                      TODO: Attach onClick handler to call backend API to cancel the request.
                      Example: <button onClick={e => {e.stopPropagation(); handleCancel(req.id);}} ...>
                    */}
                    <button
                      className="btn sentrequest-cancel"
                      onClick={e => { e.stopPropagation(); /* handleCancel() */ }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                {/* Back Side */}
                <div className="sentrequest-card sentrequest-card-back">
                  <div className="sentrequest-label">Skills</div>
                  <div className="sentrequest-data">Figma, Adobe XD</div>
                  <div className="sentrequest-label">Interests</div>
                  <div className="sentrequest-data">User Research</div>
                </div>
              </div>
            </div>
            {/* End of static card */}
          </div>
        </div>
      </div>
      
      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </>
  );
};

export default SentRequest;