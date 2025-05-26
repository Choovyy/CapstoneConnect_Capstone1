import React, { useState, useEffect } from 'react';
import '../../css/Navigation.css';
import '../../css/Matching.css';
import Navigation from '../Navigation';
import LogoutModal from '../LogoutModal';
import NotSignedIn from '../NotSignedIn';
import { getUserId, getIncomingRequestsDTO, rejectIncomingRequest } from '../../api';

const Matching = () => {
  const [requests, setRequests] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true);
        setError(null);
        const { userId } = await getUserId();
        if (!userId) throw new Error('User not authenticated');
        setIsAuthenticated(true);
        const data = await getIncomingRequestsDTO(userId);
        setRequests(data);
        setFlipped(Array(data.length).fill(false));
      } catch (err) {
        setError('Failed to load incoming requests');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const handleCardFlip = idx => {
    setFlipped(prev => prev.map((f, i) => (i === idx ? !f : f)));
  };

  const handleReject = async (requestId, idx) => {
    try {
      const { userId } = await getUserId();
      await rejectIncomingRequest(requestId, userId);
      setRequests(prev => prev.filter(r => r.id !== requestId));
      setFlipped(prev => prev.filter((_, i) => i !== idx));
    } catch (err) {
      alert('Failed to reject request');
    }
  };

  const handleLogout = () => setShowLogoutModal(true);
  const handleLogoutConfirm = () => {
    sessionStorage.removeItem('jwtToken');
    window.location.href = '/';
    setShowLogoutModal(false);
  };
  const handleLogoutCancel = () => setShowLogoutModal(false);
  const handleSignIn = () => { window.location.href = '/'; };

  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
  }
  return (
    <>
      <div>
        <Navigation onLogout={handleLogout} />
      </div>
      <div className="matching-container">
        <div className="matching-filter">
          <h1 className="matching-title">Your Matches</h1>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : requests.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', marginTop: '2rem', color: 'grey' }}>
            You have no requests yet.
          </div>
        ) : (
          <div className="matching-cards">
            {requests.map((member, idx) => (
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
                        onClick={e => {
                          e.stopPropagation();
                          const subject = encodeURIComponent("CapstoneConnect Team Request");
                          const body = encodeURIComponent(`Hi ${member.name},\n\nI'd like to connect with you on CapstoneConnect!`);
                          window.open(`https://outlook.office.com/mail/deeplink/compose?to=${member.email}&subject=${subject}&body=${body}`);
                        }}
                      >
                        Email via Outlook
                      </button>
                      <button
                        className="btn matching-reject"
                        onClick={e => { e.stopPropagation(); handleReject(member.id, idx); }}
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
        )}
      </div>
      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </>
  );
};

export default Matching;