import React, { useState, useEffect } from 'react';
import '../../css/Navigation.css';
import '../../css/PendingTeam.css';
import Navigation from '../Navigation';
import LogoutModal from '../LogoutModal';
import NotSignedIn from '../NotSignedIn';
import { getPendingApplicants, acceptApplicant, rejectApplicant, getUserId, getProjectsByUser, getProfile } from '../../api';

const PendingTeam = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [flipped, setFlipped] = useState([]); // Start as empty
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
      fetchPendingApplicants();
    }
  }, []);

  useEffect(() => {
    setFlipped(Array(pendingMembers.length).fill(false));
  }, [pendingMembers]);

  async function fetchPendingApplicants() {
    setLoading(true);
    try {
      // Get user's projects and use the first project for demo (customize as needed)
      const { userId } = await getUserId();
      const projects = await getProjectsByUser(userId);
      if (projects.length === 0) {
        setError('No projects found.');
        setLoading(false);
        return;
      }
      setProjectId(projects[0].id); // Use the first project for now
      const applicants = await getPendingApplicants(projects[0].id);
      // Fetch profile for each applicant
      const applicantsWithProfile = await Promise.all(applicants.map(async (user) => {
        try {
          const profile = await getProfile(user.id);
          return {
            ...user,
            skills: Array.isArray(profile.technicalSkills) ? profile.technicalSkills.join(', ') : 'N/A',
            interests: Array.isArray(profile.projectInterests) ? profile.projectInterests.join(', ') : 'N/A',
          };
        } catch (e) {
          return { ...user, skills: 'N/A', interests: 'N/A' };
        }
      }));
      setPendingMembers(applicantsWithProfile);
    } catch (err) {
      setError('Failed to load pending applicants.');
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(userId) {
    if (!projectId) return;
    try {
      await acceptApplicant(projectId, userId);
      fetchPendingApplicants();
    } catch (err) {
      alert('Failed to approve applicant: ' + err.message);
    }
  }

  async function handleReject(userId) {
    if (!projectId) return;
    try {
      await rejectApplicant(projectId, userId);
      fetchPendingApplicants();
    } catch (err) {
      alert('Failed to reject applicant: ' + err.message);
    }
  }

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
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
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : pendingMembers.length === 0 ? (
            <div>No pending applicants found.</div>
          ) : pendingMembers.map((member, idx) => (
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
                    Compatibility: <span>{member.compatibility ? member.compatibility + '%' : 'N/A'}</span>
                  </div>
                  <img src={member.img || 'https://placehold.co/144x142'} alt="Profile" />
                  <h2>{member.name || member.email}</h2>
                  <p>{member.role || 'Applicant'}</p>
                  <div className="pending-team-actions">
                    <button
                      className="btn pending-team-approve"
                      onClick={e => { e.stopPropagation(); handleApprove(member.id); }}
                    >
                      Approve
                    </button>
                    <button
                      className="btn pending-team-reject"
                      onClick={e => { e.stopPropagation(); handleReject(member.id); }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                {/* Back Side */}
                <div className="pending-team-card pending-team-card-back">
                  <div className="pending-team-label">Technical Skills</div>
                  <div className="pending-team-data">{member.skills || 'N/A'}</div>
                  <div className="pending-team-label">Project Interests</div>
                  <div className="pending-team-data">{member.interests || 'N/A'}</div>
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