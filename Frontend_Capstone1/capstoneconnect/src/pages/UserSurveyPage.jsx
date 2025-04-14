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
              <p className="pre-title">Team Matchmaking</p>
              <h1>
                FIND YOUR <span className="highlight-secondary">MATCH</span> HERE
              </h1>
              <p className="survey-description">
                Whether you're looking to collaborate or need a team, we're here to connect you with your perfect match.
              </p>
              <div className="button-wrapper">
                <button className="cta-button">Match Now</button>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="survey-image-wrapper">
            <img src={group} alt="Team collaboration in action" />
          </div>
        </div>

        {/* Footer Branding */}
        <footer className="survey-footer">
          <p className="footer-branding">
            <span className="capstone">Capstone</span>
            <span className="connect">Connect</span>
          </p>
        </footer>
      </div>
    </section>
  );
};

export default UserSurveyPage;
