import React, { useState, useEffect } from 'react';
import '../css/LandingPage.css';
import logo from '../assets/logo.png';
import '../css/MicrosoftAuthModal.css';
import hero from '../assets/hero.png';
import vyn from '../assets/vyn.jpg';
import gerard from '../assets/gerard.png';
import david from '../assets/david.jpg';
import harold from '../assets/harold.jpg';
import tovi from '../assets/tovi.jpg';
import { FaGithub, FaFigma, FaFacebook } from 'react-icons/fa';
// Uncomment if using React Router
// import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Force scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If using React Router:
  // const navigate = useNavigate();
  const handleLogoClick = () => {
    // navigate('/'); // Uncomment if using router
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
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
          <TeamMember name="Jhovynn Aldrich Apurado" role="Frontend Developer" bio="Specializing in responsive design and user experience." img={vyn} figma="https://www.figma.com/@jhovynnaldricha" github="https://github.com/vyn23232" fb="https://web.facebook.com/jhovynnaldrich.apurado/" />
          <TeamMember name="Harold Destura" role="Frontend Developer" bio="Expert in modern JavaScript frameworks." img={harold} figma="https://www.figma.com/@arutsedharold" github="https://github.com/harold0t1" fb="https://www.facebook.com/harold.destura/" />
          <TeamMember name="Tovi Joshua Hermosisima" role="Backend Developer" bio="Building robust server-side architectures." img={tovi} figma="https://www.figma.com/@tovijoshua" github="https://github.com/Choovyy" fb="https://www.facebook.com/tobias.joshuu" />
          <TeamMember name="John Gerard Donaire" role="Backend Developer" bio="Database expert ensuring optimized systems." img={gerard} figma="https://www.figma.com/@johngerarddonai" github="https://github.com/haloimnotcode" fb="https://www.facebook.com/gerarddonaire" />
          <TeamMember name="John David Calimpong" role="Frontend Developer" bio="Creating beautiful, accessible interfaces." img={david} figma="https://www.figma.com/@johndavid4" github="https://github.com/calimps115646" fb="https://www.facebook.com/johncalimps" />
        </div>
      </div>

      <MicrosoftAuthModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// Reusable Team Member Component
const TeamMember = ({ name, role, bio, img, figma, github, fb }) => (
  <div className="TeamMember">
    <div className="MemberImage">
      <span className="MemberRole">{role.includes("Backend") ? "Backend" : "Frontend"}</span>
      <img src={img} alt={name} />
    </div>
    <div className="MemberInfo">
      <h3>{name}</h3>
      <p className="Role">{role}</p>
      <p className="Bio">{bio}</p>
      <div className="SocialIcons">
        <a href={figma}><FaFigma /></a>
        <a href={github}><FaGithub /></a>
        <a href={fb}><FaFacebook /></a>
      </div>
    </div>
  </div>
);

export default LandingPage;
