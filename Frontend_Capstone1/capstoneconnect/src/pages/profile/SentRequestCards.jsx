import React, { useState } from 'react';
import '../../css/SentRequest.css';

const demoRequests = [
  // TODO: Replace this static array with real backend data
  {
    id: 1,
    name: 'Emily Carter',
    role: 'UI/UX Designer',
    compatibility: 88,
    img: 'https://placehold.co/144x142',
    skills: 'Figma, Adobe XD',
    interests: 'User Research',
    status: 'Request Sent!',
  },
  {
    id: 2,
    name: 'Michael Lee',
    role: 'Frontend Developer',
    compatibility: 92,
    img: 'https://placehold.co/144x142?text=ML',
    skills: 'React, JavaScript',
    interests: 'Web Animation',
    status: 'Request Sent!',
  },
  {
    id: 3,
    name: 'Sarah Kim',
    role: 'Backend Developer',
    compatibility: 85,
    img: 'https://placehold.co/144x142?text=SK',
    skills: 'Node.js, MongoDB',
    interests: 'APIs',
    status: 'Request Sent!',
  },
  // ...add more demo cards as needed
];

const SentRequestCards = () => {
  // For each card, track flip state
  const [flipped, setFlipped] = useState(Array(demoRequests.length).fill(false));
  // For scrolling: show two cards at a time, track the start index
  const [startIdx, setStartIdx] = useState(0);

  // Handles flipping a card
  const handleCardClick = idx => {
    setFlipped(prev => prev.map((f, i) => (i === idx ? !f : f)));
  };

  // Scroll left (show previous two cards)
  const handlePrev = () => {
    setStartIdx(idx => Math.max(0, idx - 2));
  };

  // Scroll right (show next two cards)
  const handleNext = () => {
    setStartIdx(idx => Math.min(demoRequests.length - 2, idx + 2));
  };

  // Only show two cards at a time
  const visibleRequests = demoRequests.slice(startIdx, startIdx + 2);

  return (
    <div className="sentrequest-container" style={{ marginTop: 0 }}>
      <div className="sentrequest-filter">
        <h1 className="sentrequest-title">Sent Request</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Show left arrow if not at the start */}
        <button
          className="sentrequest-scroll-btn"
          onClick={handlePrev}
          disabled={startIdx === 0}
          aria-label="Previous"
          style={{
            background: 'none',
            border: 'none',
            fontSize: 32,
            cursor: startIdx === 0 ? 'not-allowed' : 'pointer',
            color: '#CA9F58',
            marginRight: 8,
            opacity: startIdx === 0 ? 0.3 : 1,
          }}
        >
          &#8592;
        </button>
        <div className="sentrequest-cards" style={{ overflow: 'hidden', width: 640 }}>
          {visibleRequests.map((req, idx) => (
            <div
              key={req.id}
              className={`sentrequest-card-flip${flipped[startIdx + idx] ? ' flipped' : ''}`}
              onClick={() => handleCardClick(startIdx + idx)}
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <div className="sentrequest-card-flip-inner">
                {/* Front Side */}
                <div className="sentrequest-card sentrequest-card-front">
                  <div className="sentrequest-compatibility">
                    Compatibility: <span>{req.compatibility}%</span>
                  </div>
                  <img src={req.img} alt="Profile" />
                  <h2>{req.name}</h2>
                  <p>{req.role}</p>
                  <div className="sentrequest-status">{req.status}</div>
                  <div className="sentrequest-actions">
                    <button
                      className="btn sentrequest-cancel"
                      onClick={e => {
                        e.stopPropagation();
                        // TODO: Implement cancel request logic with backend
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                {/* Back Side */}
                <div className="sentrequest-card sentrequest-card-back">
                  <div className="sentrequest-label">Skills</div>
                  <div className="sentrequest-data">{req.skills}</div>
                  <div className="sentrequest-label">Interests</div>
                  <div className="sentrequest-data">{req.interests}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Show right arrow if not at the end */}
        <button
          className="sentrequest-scroll-btn"
          onClick={handleNext}
          disabled={startIdx + 2 >= demoRequests.length}
          aria-label="Next"
          style={{
            background: 'none',
            border: 'none',
            fontSize: 32,
            cursor: startIdx + 2 >= demoRequests.length ? 'not-allowed' : 'pointer',
            color: '#CA9F58',
            marginLeft: 8,
            opacity: startIdx + 2 >= demoRequests.length ? 0.3 : 1,
          }}
        >
          &#8594;
        </button>
      </div>
      {/* 
        TODO: 
        - Replace demoRequests with backend data (e.g., from props or API).
        - Replace cancel logic with backend call.
        - Optionally, add loading/error states for requests.
      */}
    </div>
  );
};

export default SentRequestCards;