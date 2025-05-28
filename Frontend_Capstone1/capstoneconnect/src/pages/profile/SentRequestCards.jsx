import React, { useState, useEffect } from 'react';
import '../../css/SentRequest.css';
import { getUserId, getSentRequestsDTO, cancelRequest } from '../../api';

const BACKEND_URL = "http://localhost:8080";
function getProfilePictureUrl(pic) {
  if (!pic) return "https://placehold.co/144x142";
  if (pic.startsWith("http")) return pic;
  return BACKEND_URL + pic;
}

const SentRequestCards = () => {
  const [requests, setRequests] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [startIdx, setStartIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRequests() {      try {
        setLoading(true);
        setError(null);
        const { userId } = await getUserId();
        const data = await getSentRequestsDTO(userId);
        console.log("Sent requests data:", data); // Debug the response data
        setRequests(data);
        setFlipped(Array(data.length).fill(false));
      } catch (err) {
        setError('Failed to load sent requests');
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const handleCardClick = idx => {
    setFlipped(prev => prev.map((f, i) => (i === idx ? !f : f)));
  };

  const handlePrev = () => {
    setStartIdx(idx => Math.max(0, idx - 2));
  };

  const handleNext = () => {
    setStartIdx(idx => Math.min(requests.length - 2, idx + 2));
  };

  const handleCancel = async (requestId, idx) => {
    try {
      const { userId } = await getUserId();
      await cancelRequest(requestId, userId);
      setRequests(prev => prev.filter(r => r.id !== requestId));
      setFlipped(prev => prev.filter((_, i) => i !== idx));
    } catch (err) {
      alert('Failed to cancel request');
    }
  };

  const visibleRequests = requests.slice(startIdx, startIdx + 2).map(req => ({
    ...req,
    img: getProfilePictureUrl(req.profilePicture)
  }));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (requests.length === 0) return <div>No sent requests.</div>;

  return (
    <div className="sentrequest-container" style={{ marginTop: 0 }}>
      <div className="sentrequest-filter">
        <h1 className="sentrequest-title">Sent Request</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
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
                        handleCancel(req.id, startIdx + idx);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                {/* Back Side */}
                <div className="sentrequest-card sentrequest-card-back">
                  <div className="sentrequest-label">Technical Skills</div>
                  <div className="sentrequest-data">{req.skills}</div>
                  <div className="sentrequest-label">Project Interests</div>
                  <div className="sentrequest-data">{req.interests}</div>
                  <div className="sentrequest-label">Personality</div>
                  <div className="sentrequest-data">{req.personality}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="sentrequest-scroll-btn"
          onClick={handleNext}
          disabled={startIdx + 2 >= requests.length}
          aria-label="Next"
          style={{
            background: 'none',
            border: 'none',
            fontSize: 32,
            cursor: startIdx + 2 >= requests.length ? 'not-allowed' : 'pointer',
            color: '#CA9F58',
            marginLeft: 8,
            opacity: startIdx + 2 >= requests.length ? 0.3 : 1,
          }}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default SentRequestCards;