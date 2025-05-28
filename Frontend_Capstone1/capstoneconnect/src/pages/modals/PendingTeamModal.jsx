import React, { useState, useEffect } from 'react';
import '../../css/PendingTeam.css';
import { getPendingApplicants, acceptApplicant, rejectApplicant, getUserId, getProjectsByUser, getProfile } from '../../api';

const placeholderImg = "https://placehold.co/144x142";
const BACKEND_URL = "http://localhost:8080";
function getProfilePictureUrl(pic) {
  if (!pic) return placeholderImg;
  if (pic.startsWith("http")) return pic;
  return BACKEND_URL + pic;
}

const PendingTeamModal = ({ isOpen, onClose, projectId }) => {
  const [pendingMembers, setPendingMembers] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchPendingApplicants();
    }
  }, [isOpen, projectId]);

  useEffect(() => {
    setFlipped(Array(pendingMembers.length).fill(false));
  }, [pendingMembers]);

  async function fetchPendingApplicants() {
    setLoading(true);
    try {
      // Use provided projectId or fetch from user's projects
      let pid = projectId;
      if (!pid) {
        // Get user's projects and use the first project for demo (customize as needed)
        const { userId } = await getUserId();
        const projects = await getProjectsByUser(userId);
        if (projects.length === 0) {
          setError('No projects found.');
          setLoading(false);
          return;
        }
        pid = projects[0].id; // Use the first project for now
      }
      
      const applicants = await getPendingApplicants(pid);
      // Fetch profile for each applicant
      const applicantsWithProfile = await Promise.all(applicants.map(async (user) => {
        try {
          const profile = await getProfile(user.id);
          return {
            ...user,
            profilePicture: profile.profilePicture || user.profilePicture || '',
            name: profile.name || profile.fullName || user.name || user.fullName || '',
            skills: Array.isArray(profile.technicalSkills) ? profile.technicalSkills.join(', ') : 'N/A',
            interests: Array.isArray(profile.projectInterests) ? profile.projectInterests.join(', ') : 'N/A',
            personality: profile.personality || 'N/A',
          };
        } catch (e) {
          return { ...user, skills: 'N/A', interests: 'N/A', personality: 'N/A' };
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

  const handleCardFlip = idx => {
    setFlipped(prev => prev.map((f, i) => (i === idx ? !f : f)));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="pending-team-modal">
        <div className="pending-team-header">
          <h2>Pending Team Members</h2>
          <button className="pending-team-close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="pending-team-content">
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
                    <img src={getProfilePictureUrl(member.profilePicture)} alt="Profile" />
                    <h2>{member.name || member.fullName || member.email}</h2>
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
                    <div className="pending-team-label">Personality</div>
                    <div className="pending-team-data">{member.personality || 'N/A'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingTeamModal;