import React from 'react';
import '../css/Navigation.css';
import '../css/SentRequest.css';
import logo from '../assets/logo.png';

const SentRequest = () => {
  // TODO: Replace the static card data below with dynamic data from backend
  // Example: Fetch sent requests from API and map over them to render cards
  // const sentRequests = props.sentRequests || [];
  // sentRequests.map((request) => ( ... ))

  return (
    <>
      <header className="site-header">
        <div className="header__logo">
          <a href="#">
            <img src={logo} alt="Logo" />
          </a>
        </div>
        <nav className="header__nav">
          <ul className="nav-list">
            <li className="nav-item"><a href="#">Home</a></li>
            <li className="nav-item"><a href="#">Profile</a></li>
            <li className="nav-item"><a href="#">Projects</a></li>
            <li className="nav-item"><a href="#">Team</a></li>
            <li className="nav-item"><a href="#">More</a></li>
          </ul>
        </nav>
        <div className="header__auth">
          <button className="btn btn--primary">Logout</button>
        </div>
      </header>
      
      <div className="sentrequest-container">
        <div className="sentrequest-filter">
          <h1 className="sentrequest-title">Sent Request</h1>
        </div>
        <div className="sentrequest-cards">
          {/* 
            TODO: Replace this static card with a .map() over sent requests from backend.
            Example:
            {sentRequests.map((req) => (
              <div className="sentrequest-card" key={req.id}>
                ...
              </div>
            ))}
          */}
          <div className="sentrequest-card">
            <div className="sentrequest-compatibility">Compatibility: <span>88%</span></div>
            <img src="https://placehold.co/144x142" alt="Profile" />
            <h2>Emily Carter</h2>
            <p>UI/UX Designer</p>
            <div className="sentrequest-label">Skills</div>
            <div className="sentrequest-data">Figma, Adobe XD</div>
            <div className="sentrequest-label">Interests</div>
            <div className="sentrequest-data">User Research</div>
            <div className="sentrequest-status">Request Sent!</div>
            <div className="sentrequest-actions">
              {/* 
                TODO: Attach onClick handler to call backend API to cancel the request.
                Example: <button onClick={() => handleCancel(req.id)} ...>
              */}
              <button className="btn sentrequest-cancel">Cancel</button>
            </div>
          </div>
          {/* End of static card */}
        </div>
      </div>
    </>
  );
};

export default SentRequest;