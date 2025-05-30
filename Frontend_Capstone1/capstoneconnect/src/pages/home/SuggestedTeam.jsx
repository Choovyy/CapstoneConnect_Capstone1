import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/Navigation.css';
import '../../css/SuggestedTeam.css';
import Navigation from '../Navigation';
import SuggestedTeamModal from '../modals/SuggestedTeamModal';
import LogoutModal from '../LogoutModal';
import NotSignedIn from '../NotSignedIn';
import Toast from '../Toast';
import { getMatchesFromSurvey, getSurvey, getProfile, getUserId, sendRequest } from '../../api';

const placeholderImg = "https://placehold.co/144x142";
const BACKEND_URL = "http://localhost:8080";

function getProfilePictureUrl(pic) {
  if (!pic) return placeholderImg;
  if (pic.startsWith("http")) return pic;
  return BACKEND_URL + pic;
}

const SuggestedTeam = () => {  
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    role: "",
    skill: "",
    preference: ""
  });
  const [suggestedTeammates, setSuggestedTeammates] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });
  

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const storedToken = sessionStorage.getItem('jwtToken');
    
    if (token) {
      sessionStorage.setItem('jwtToken', token);
      setIsAuthenticated(true);
      // Remove token from URL for cleanliness
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.pathname);
    } else if (storedToken) {
      setIsAuthenticated(true);
    }
    
    // Only fetch data if authenticated
    if (token || storedToken) {
      fetchSuggestedTeammates();
    } else {
      setLoading(false);
    }
  }, [location]);

  const handleSignIn = () => {
    window.location.href = '/';
  };
    const fetchSuggestedTeammates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user info
      const userIdResponse = await getUserId();
      const { userId } = userIdResponse;
      const profile = await getProfile(userId);
      
      // Get user's survey data
      const surveyData = await getSurvey(profile.id);
      
      // Get matches based on the survey
      const matches = await getMatchesFromSurvey(surveyData);
      
      console.log('Current userId:', userId);
      console.log('Matches raw data:', matches);
      
      // Filter out the current user from matches based on name
      const filteredMatches = matches.filter(match => match.name !== profile.name);
      console.log('Filtered matches:', filteredMatches);
      
      // Transform matches data to match our component's expected format
      // joben dont change this part
      const formattedMatches = filteredMatches.map((match, index) => ({
        id: index + 1,
        name: match.name || 'No Name',
        email: match.email || '',
        role: match.preferredRoles ? match.preferredRoles.join(', ') : 'No Role',
        skills: match.technicalSkills ? match.technicalSkills.join(', ') : 'No Skills',
        preference: match.projectInterests ? match.projectInterests.join(', ') : 'No Preferences',
        personality: match.personality || 'No Personality',
        score: match.overallScore,
        img: getProfilePictureUrl(match.profilePicture)
      }));
      
      setSuggestedTeammates(formattedMatches);
      setFlipped(Array(formattedMatches.length).fill(false));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching suggested teammates:', err);
      if (err.message === 'Not authenticated' || err.message === 'User ID not found') {
        // Clear token and set not authenticated if the token is invalid
        sessionStorage.removeItem('jwtToken');
        setIsAuthenticated(false);
        setError('Your session has expired. Please sign in again.');
      } else {
        setError('Failed to load suggested teammates. Please try again later.');
      }
      setLoading(false);
    }
  };

  // Send request to backend when user clicks Send Request
  const handleSendRequest = async (receiver) => {
    try {
      const user = await getUserId(); // make sure getUserId returns an object with userId key
      const senderId = user?.userId;

      if (!receiver.name || !receiver.score) {
        setToast({
          visible: true,
          message: 'Receiver name or match score missing.',
          type: 'error'
        });
        return;
      }

      await sendRequest(senderId, receiver.name, receiver.score); // Keep as-is

      setToast({
        visible: true,
        message: 'Request sent successfully!',
        type: 'success'
      });
    } catch (err) {
      setToast({
        visible: true,
        message: 'Failed to send request: ' + err.message,
        type: 'error'
      });
    }
  };

const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  
  const handleConfirm = () => {
    setShowModal(false);
  };
  
  const handleCancel = () => {
    setShowModal(false);
  };

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

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setSelectedFilters(prev => ({
      ...prev,
      [id === 'roles' ? 'role' : id === 'skills' ? 'skill' : 'preference']: value
    }));
  };  const applyFilter = async () => {
    try {
      setLoading(true);
      setError(null);

      const userIdResponse = await getUserId();
      const { userId } = userIdResponse;
      const profile = await getProfile(userId);
      const surveyData = await getSurvey(profile.id);

      const matches = await getMatchesFromSurvey(surveyData);

      const filteredMatches = matches
        .filter(match => match.name !== profile.name)
        .filter(match => {
          const matchRole = match.preferredRoles?.includes(selectedFilters.role) || !selectedFilters.role;
          const matchSkill = match.technicalSkills?.includes(selectedFilters.skill) || !selectedFilters.skill;
          const matchPref = match.projectInterests?.includes(selectedFilters.preference) || !selectedFilters.preference;
          return matchRole && matchSkill && matchPref;
        });

      const formattedMatches = filteredMatches.map((match, index) => ({
        id: index + 1,
        name: match.name || 'No Name',
        role: match.preferredRoles ? match.preferredRoles.join(', ') : 'No Role',
        skills: match.technicalSkills ? match.technicalSkills.join(', ') : 'No Skills',
        preference: match.projectInterests ? match.projectInterests.join(', ') : 'No Preferences',
        personality: match.personality || 'No Personality',
        score: match.overallScore,
        userId: match.userId || match.id,
        img: getProfilePictureUrl(match.profilePicture)
      }));

      setSuggestedTeammates(formattedMatches);
      setFlipped(Array(formattedMatches.length).fill(false));
      setLoading(false);
    } catch (err) {
      console.error('Error applying filters:', err);
      if (err.message === 'Not authenticated' || err.message === 'User ID not found') {
        sessionStorage.removeItem('jwtToken');
        setIsAuthenticated(false);
        setError('Your session has expired. Please sign in again.');
      } else {
        setError('Failed to apply filters. Please try again later.');
      }
      setLoading(false);
    }
  };

  // Flip handler for each card
  const handleCardFlip = idx => {
    setFlipped(prev => prev.map((f, i) => (i === idx ? !f : f)));
  };

  if (loading) {
    return <div>Loading suggested teammates...</div>;
  }

  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      {/* Header Section */}
      <Navigation onLogout={handleLogout} />

      {/* Main Content */}
      <main className="suggested-team-container">
        {/* Filter Section */}
        <section className="suggested-team-filter">
          <h1 className="suggested-team-title">Suggested Teammates</h1>
          <div className="suggested-team-filters">
            <div className="suggested-team-filter-group">              <label htmlFor="roles">Preferred Roles</label>              <select 
                id="roles" 
                className="suggested-team-filter-select"
                value={selectedFilters.role}
                onChange={handleFilterChange}
              >
                <option value="">All Roles</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Game Developer">Game Developer</option>
                <option value="Team Leader">Team Leader</option>
                <option value="Technical Writer">Technical Writer</option>
              </select>
            </div>
            <div className="suggested-team-filter-group">              <label htmlFor="skills">Technical Skills:</label>              <select 
                id="skills" 
                className="suggested-team-filter-select"
                value={selectedFilters.skill}
                onChange={handleFilterChange}
              >
                <option value="">All Skills</option>
                <option value="C Language">C Language</option>
                <option value="HTML and CSS">HTML and CSS</option>
                <option value="Java">Java</option>
                <option value="PHP">PHP</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
              </select>
            </div>
            <div className="suggested-team-filter-group">              <label htmlFor="preferences">Project Interests:</label>              <select 
                id="preferences" 
                className="suggested-team-filter-select"
                value={selectedFilters.preference}
                onChange={handleFilterChange}
              >
                <option value="">All Project Interests</option>
                <option value="Web App Development">Web App Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Task Management Systems">Task Management Systems</option>
                <option value="E-Commerce Systems">E-Commerce Systems</option>
                <option value="Game Development">Game Development</option>
                <option value="AI Development">AI Development</option>
              </select>
            </div>
            <div className="suggested-team-filter-apply">
              <button className="btn btn--filter" onClick={applyFilter}>Apply Filter</button>
            </div>
          </div>
        </section>        {/* Teammate Cards Section */}
        <section className="suggested-team-cards">
          {loading ? (
            <div className="loading-state">Loading suggested teammates...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : suggestedTeammates.length === 0 ? (
            <div className="empty-state">No matches found. Try adjusting your filters.</div>
          ) : (
            suggestedTeammates.map((member, idx) => (
              <div
                key={member.id}
                className={`suggested-team-card-flip${flipped[idx] ? ' flipped' : ''}`}
                onClick={() => handleCardFlip(idx)}
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <div className="suggested-team-card-flip-inner">
                  {/* Front Side */}
                  <div className="suggested-team-card suggested-team-card-front">
                    <div className="suggested-team-card-image">
                      <img src={member.img} alt="Profile Placeholder" />
                    </div>
                    <div className="suggested-team-card-details-centered">
                      <p className="suggested-team-card-name">{member.name}</p>
                      <p className="suggested-team-card-role">{member.role}</p>
                      <div className="match-score">
                        <span className="score-label">Match Score:</span>
                        <span className="score-value">{member.score}%</span>
                      </div>
                    </div>
                    <div className="suggested-team-card-action">
                      <button
                        className="btn btn--action"
                        onClick={e => { e.stopPropagation(); handleSendRequest(member); }}
                      >
                        Send Request
                      </button>
                    </div>
                  </div>                  {/* Back Side */}
                  <div className="suggested-team-card suggested-team-card-back">
                    <div className="suggested-team-label">Technical Skills</div>
                    <div className="suggested-team-data">{member.skills}</div>
                    <div className="suggested-team-label">Project Interests</div>
                    <div className="suggested-team-data">{member.preference}</div>
                    <div className="suggested-team-label">Personality</div>
                    <div className="suggested-team-data">{member.personality}</div>
                    <div className="suggested-team-label">Match Score</div>
                    <div className="suggested-team-data score">{member.score}%</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
      {showModal && <SuggestedTeamModal onConfirm={handleConfirm} onCancel={handleCancel} />}
      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
        {/* Toast Notification */}
      {toast.visible && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={handleCloseToast} 
          duration={3000} 
        />
      )}
    </div>
  );
};

export default SuggestedTeam;