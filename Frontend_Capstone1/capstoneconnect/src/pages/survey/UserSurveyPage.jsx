import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../api';
import '../../css/UserSurveyPage.css';
import group from '../../assets/group.jpg';
import NotSignedIn from '../NotSignedIn';

const UserSurveyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Extract JWT from URL and store in sessionStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      sessionStorage.setItem('jwtToken', token);
      setIsAuthenticated(true);
      // Remove token from URL for cleanliness
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.pathname);
    } else {
      const storedToken = sessionStorage.getItem('jwtToken');
      if (storedToken) {
        setIsAuthenticated(true);
      }
    }
  }, [location]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        setUser(null);
      }
    }
    
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  const handleMatchNowClick = () => {
    navigate('/user-survey-form');
  };

  const handleSignIn = () => {
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
  }

  return (
    <section className="survey-page">
      <div className="survey-container">
        <div className="survey-grid">
          {/* Text Section */}
          <div className="survey-text">
            <div className="survey-heading-wrapper">
              <h1>
                <span className="find-your">FIND YOUR</span>
                <span className="match-here">
                  <span className="highlight-match">MATCH</span> HERE
                </span>
              </h1>
              <p className="survey-description">
                Whether you're looking to collaborate or need a team, we're here to connect you with your perfect match.
              </p>
              <div className="button-wrapper">
                <button className="cta-button" onClick={handleMatchNowClick}>Match Now</button>
              </div>
            </div>
          </div>

          {/* Image Section with background rectangle */}
          <div className="survey-image-wrapper">
            <div className="image-background-rectangle"></div>
            <img src={group} alt="Team collaboration in action" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserSurveyPage;
