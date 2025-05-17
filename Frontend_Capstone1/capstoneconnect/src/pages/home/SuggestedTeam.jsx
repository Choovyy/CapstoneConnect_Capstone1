import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/Navigation.css';
import '../../css/SuggestedTeam.css';
import Navigation from '../Navigation';
import SuggestedTeamModal from '../modals/SuggestedTeamModal';
import LogoutModal from '../LogoutModal';
import { getMatchesFromSurvey, getSurvey, getProfile, getUserId } from '../../api';

const placeholderImg = "https://placehold.co/144x142";

const SuggestedTeam = () => {  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    role: "",
    skill: "",
    preference: ""
  });
  const [suggestedTeammates, setSuggestedTeammates] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      sessionStorage.setItem('jwtToken', token);
      // Remove token from URL for cleanliness
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.pathname);
    }
    
    // Fetch suggested teammates when component mounts
    fetchSuggestedTeammates();
  }, [location]);
  const fetchSuggestedTeammates = async () => {
    try {
      setLoading(true);
      // Get current user info
      const { userId } = await getUserId();
      const profile = await getProfile(userId);
      
      // Get user's survey data
      const surveyData = await getSurvey(profile.id);
        // Get matches based on the survey
      const matches = await getMatchesFromSurvey(surveyData);
      
      // Transform matches data to match our component's expected format
      const formattedMatches = matches.map((match, index) => ({
        id: index + 1,
        name: match.name || 'No Name',
        role: match.preferredRoles ? match.preferredRoles.join(', ') : 'No Role',
        skills: match.technicalSkills ? match.technicalSkills.join(', ') : 'No Skills',
        preference: match.projectInterests ? match.projectInterests.join(', ') : 'No Preferences',
        score: match.score,
        img: placeholderImg
      }));
      
      setSuggestedTeammates(formattedMatches);
      setFlipped(Array(formattedMatches.length).fill(false));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching suggested teammates:', err);
      setError('Failed to load suggested teammates. Please try again later.');
      setLoading(false);
    }
  };

  const handleSendRequest = () => {
    setShowModal(true);
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
      // Get current user info
      const { userId } = await getUserId();
      const profile = await getProfile(userId);
      
      // Get user's survey data
      const surveyData = await getSurvey(profile.id);
      
      // Apply filters to the survey data
      // This is a simplified approach - in a real implementation,
      // you might want to send the filters to the backend
      const filteredSurvey = {
        ...surveyData,
        preferredRoles: selectedFilters.role ? [selectedFilters.role] : surveyData.preferredRoles,
        technicalSkills: selectedFilters.skill ? [selectedFilters.skill] : surveyData.technicalSkills,
        projectInterests: selectedFilters.preference ? [selectedFilters.preference] : surveyData.projectInterests
      };
      
      // Get matches based on the filtered survey
      const matches = await getMatchesFromSurvey(filteredSurvey);
        // Transform matches data to match our component's expected format
      const formattedMatches = matches.map((match, index) => ({
        id: index + 1,
        name: match.name || 'No Name',
        role: match.preferredRoles ? match.preferredRoles.join(', ') : 'No Role',
        skills: match.technicalSkills ? match.technicalSkills.join(', ') : 'No Skills',
        preference: match.projectInterests ? match.projectInterests.join(', ') : 'No Preferences',
        score: match.score,
        img: placeholderImg
      }));
      
      setSuggestedTeammates(formattedMatches);
      setFlipped(Array(formattedMatches.length).fill(false));
      setLoading(false);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to apply filters. Please try again later.');
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
            <div className="suggested-team-filter-group">
              <label htmlFor="roles">Preferred Roles</label>              <select 
                id="roles" 
                className="suggested-team-filter-select"
                value={selectedFilters.role}
                onChange={handleFilterChange}
              >
                <option value="">All Roles</option>
                <option value="ui-ux-designer">UI/UX Designer</option>
                <option value="frontend-developer">Frontend Developer</option>
                <option value="backend-developer">Backend Developer</option>
                <option value="game-developer">Game Developer</option>
                <option value="team-leader">Team Leader</option>
                <option value="technical-writer">Technical Writer</option>
              </select>
            </div>
            <div className="suggested-team-filter-group">
              <label htmlFor="skills">Technical Skills:</label>              <select 
                id="skills" 
                className="suggested-team-filter-select"
                value={selectedFilters.skill}
                onChange={handleFilterChange}
              >
                <option value="">All Skills</option>
                <option value="c-language">C Language</option>
                <option value="html-css">HTML and CSS</option>
                <option value="java">Java</option>
                <option value="php">PHP</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>
            <div className="suggested-team-filter-group">
              <label htmlFor="preferences">Project Interests:</label>              <select 
                id="preferences" 
                className="suggested-team-filter-select"
                value={selectedFilters.preference}
                onChange={handleFilterChange}
              >
                <option value="">All Project Interests</option>
                <option value="web-app-dev">Web App Development</option>
                <option value="mobile-app-dev">Mobile App Development</option>
                <option value="task-management-systems">Task Management Systems</option>
                <option value="e-commerce-systems">E-Commerce Systems</option>
                <option value="game-dev">Game Development</option>
                <option value="ai-dev">AI Development</option>
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
                        onClick={e => { e.stopPropagation(); handleSendRequest(); }}
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                  {/* Back Side */}
                  <div className="suggested-team-card suggested-team-card-back">
                    <div className="suggested-team-label">Technical Skills</div>
                    <div className="suggested-team-data">{member.skills}</div>
                    <div className="suggested-team-label">Project Interest</div>
                    <div className="suggested-team-data">{member.preference}</div>
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
    </div>
  );
};

export default SuggestedTeam;