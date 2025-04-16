import React from 'react';
import '../css/UserSurveyPage.css';
import group from '../assets/group.jpg';

const UserSurveyPage = () => {
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
                <button className="cta-button">Match Now</button>
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
