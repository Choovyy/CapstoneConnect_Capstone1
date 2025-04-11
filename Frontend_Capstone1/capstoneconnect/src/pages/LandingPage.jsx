import React, { useState } from 'react';
import '../css/LandingPage.css';
import logo from '../assets/logo.png';
import '../css/MicrosoftAuthModal.css'; // Adjust the path as necessary
import hero from '../assets/hero.png';
import vyn from '../assets/vyn.jpg';
import gerard from '../assets/gerard.png';
import david from '../assets/david.jpg';
import harold from '../assets/harold.jpg';
import tovi from '../assets/tovi.jpg';
import { FaGithub, FaFigma, FaFacebook } from 'react-icons/fa';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLogoClick = () => {
    window.location.reload();
  };

  // Microsoft Auth Modal Component
  const MicrosoftAuthModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="ms-modal-overlay">
        <div className="ms-modal-container">
          <button className="ms-close-btn" onClick={onClose}>✕</button>
          
          <div className="ms-brand-section">
            <div className="ms-brand-logo">
              <img src={logo} alt="Capstone Connect Logo" />
            </div>
            <div className="ms-brand-title">
              <div className="ms-title capstone">Capstone</div>
              <div className="ms-title connect">Connect</div>
            </div>
          </div>

          <div className="ms-divider"></div>

          <div className="ms-auth-section">
            <h2 className="ms-sign-in-title">Sign In</h2>
            
            <button className="ms-microsoft-auth-btn">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
                alt="Microsoft" 
                className="ms-microsoft-icon" 
              />
              <span className="ms-microsoft-text">Continue with Microsoft</span>
            </button>

            <div className="ms-alternative-options">
              Don't have an account? 
              <span className="ms-alternative-link">Sign up</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="Capstone Connect Logo" />
        </div>
        <ul className="nav-pill-list">
          <li><a href="#home">Home</a></li>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#about">About</a></li>
        </ul>
        <div className="nav-buttons">
          <button 
            className="nav-button" 
            onClick={() => setIsModalOpen(true)}
          >
            Sign In
          </button>
        </div>
      </nav>

      <div className="landing-body" id="home">
        <div className="text-wrapper">
          <div className="heading-wrapper">
            <h1>
              <span className="welcome">Welcome to</span> <br />
              <span className="capstone">Capstone</span>
              <span className="connect">Connect</span>
            </h1>
          </div>
          <p className="description">
            Find your perfect match for your capstone project in a swipe
          </p>
          <div className="button-wrapper">
            <button 
              className="cta-button"
              onClick={() => setIsModalOpen(true)}
            >
              Get Started
            </button>
          </div>
        </div>

        <div className="map-wrapper">
          <img src={hero} alt="Map" />
        </div>
      </div>

      <div className="MidPage" id="dashboard">
        <div className="HeadingWrapper">
          <h1>Matching Algorithm</h1>
          <p>Discover your perfect match on CapstoneConnect with our innovative matching algorithm.</p>
        </div>
        <div className="Wrapper">
          <div className="FeatureList">
            <h2>Personalized Matches</h2>
            <p>Find connections that truly resonate with you based on your interests and preferences.</p>
          </div>
          <div className="FeatureList">
            <h2>Compatibility Scores</h2>
            <p>Get insights into your compatibility with other users to make informed decisions.</p>
          </div>
          <div className="FeatureList">
            <h2>Mutual Interests</h2>
            <p>Explore shared interests with potential matches to spark meaningful conversations.</p>
          </div>
        </div>
      </div>

      <div className="AboutPage" id="about">
        <div className="AboutHeader">
          <h1>Our Team</h1>
          <p>Meet the talented developers behind our success. We're a passionate team dedicated to creating exceptional digital experiences.</p>
        </div>

        <div className="TeamContainer">
          <div className="TeamMember">
            <div className="MemberImage">
              <span className="MemberRole">Frontend</span>
              <img src={vyn} alt="Team Member" />
            </div>
            <div className="MemberInfo">
              <h3>Jhovynn Aldrich Apurado</h3>
              <p className="Role">Frontend Developer</p>
              <p className="Bio">Specializing in responsive design and user experience.</p>
              <div className="SocialIcons">
                <a href="https://www.figma.com/@jhovynnaldricha"><FaFigma /></a>
                <a href="https://github.com/vyn23232"><FaGithub /></a>
                <a href="https://web.facebook.com/jhovynnaldrich.apurado/"><FaFacebook /></a>
              </div>
            </div>
          </div>

          {/* Other team members */}
          <div className="TeamMember">
            <div className="MemberImage">
              <span className="MemberRole">Frontend</span>
              <img src={harold} alt="Team Member" />
            </div>
            <div className="MemberInfo">
              <h3>Harold Destura</h3>
              <p className="Role">Frontend Developer</p>
              <p className="Bio">Expert in modern JavaScript frameworks.</p>
              <div className="SocialIcons">
              <a href="https://www.figma.com/@arutsedharold"><FaFigma /></a>
                <a href="https://github.com/harold0t1"><FaGithub /></a>
                <a href="https://www.facebook.com/harold.destura/"><FaFacebook /></a>
              </div>
            </div>
          </div>

          <div className="TeamMember">
            <div className="MemberImage">
              <span className="MemberRole">Database</span>
              <img src={tovi} alt="Team Member" />
            </div>
            <div className="MemberInfo">
              <h3>Tovi Joshua Hermosisima</h3>
              <p className="Role">Backend Developer</p>
              <p className="Bio">Building robust server-side architectures.</p>
              <div className="SocialIcons">
              <a href="https://www.figma.com/@tovijoshua"><FaFigma /></a>
                <a href="https://github.com/Choovyy"><FaGithub /></a>
                <a href="https://www.facebook.com/tobias.joshuu"><FaFacebook /></a>
              </div>
            </div>
          </div>

          <div className="TeamMember">
            <div className="MemberImage">
              <span className="MemberRole">Backend</span>
              <img src={gerard} alt="Team Member" />
            </div>
            <div className="MemberInfo">
              <h3>John Gerard Donaire</h3>
              <p className="Role">Backend Developer</p>
              <p className="Bio">Database expert ensuring optimized systems.</p>
              <div className="SocialIcons">
              <a href="https://www.figma. com/@johngerarddonai"><FaFigma /></a>
                <a href="https://github.com/haloimnotcode"><FaGithub /></a>
                <a href="https://www.facebook. com/gerarddonaire"><FaFacebook /></a>
              </div>
            </div>
          </div>

          <div className="TeamMember">
            <div className="MemberImage">
              <span className="MemberRole">Frontend</span>
              <img src={david} alt="Team Member" />
            </div>
            <div className="MemberInfo">
              <h3>John David Calimpong</h3>
              <p className="Role">Frontend Developer</p>
              <p className="Bio">Creating beautiful, accessible interfaces.</p>
              <div className="SocialIcons">
              <a href="https://www.figma.com/@johndavid4"><FaFigma /></a>
                <a href="https://github.com/calimps115646"><FaGithub /></a>
                <a href="https://www.facebook.com/johncalimps"><FaFacebook /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Microsoft Auth Modal */}
      <MicrosoftAuthModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;