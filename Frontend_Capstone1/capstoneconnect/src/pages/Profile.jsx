import React, { useEffect, useState } from 'react';
import '../css/Profile.css';
import logo from '../assets/logo.png';
import vyn from '../assets/vyn.jpg';
import '../css/Navigation.css';
import { getUserId, getProfile } from '../api';
import { useNavigate } from 'react-router-dom'; // Add this import

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { userId } = await getUserId();
        const profileData = await getProfile(userId);
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>No profile data found.</div>;

  return (
    <>
      <header className="site-header">
        <div className="header__logo">
          <a href="#">
            <img src={logo} alt="CapstoneConnect Logo" />
          </a>
        </div>
        <nav className="header__nav">
          <ul className="nav-list">
            <li className="nav-item nav-item--active"><a href="#">Home</a></li>
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

      {/* Only the profile-page is flex-centered */}
      <div className="profile-page">
        <main className="profile-container">
          <div className="profile-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
            <div className="profile-pic" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '0 0 auto' }}>
              <img src={profile.profilePictureUrl || vyn} alt="Profile" />
            </div>
            <div className="profile-info">
              <div className="profile-actions">
                <button className="projects-btn" onClick={() => navigate('/your-project')}>Your Projects</button>
                <button className="edit-btn" onClick={() => navigate('/profile-edit')}>Edit Profile</button>
              </div>
              <h1>{profile.fullName || profile.name || 'No Name'}</h1>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0'}}>
                <span style={{display: 'flex', alignItems: 'center'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#267987" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <span>{profile.email || 'No Email'}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Role</h2>
            <p>{Array.isArray(profile.preferredRoles) ? profile.preferredRoles.join(', ') : (profile.role || 'No role set')}</p>
          </div>

          <div className="profile-section">
            <h2>Technical Skills</h2>
            <p>{Array.isArray(profile.technicalSkills) ? profile.technicalSkills.join(', ') : (profile.technicalSkills || 'No skills set')}</p>
          </div>

          <div className="profile-section">
            <h2>Project Interests</h2>
            <p>{Array.isArray(profile.projectInterests) ? profile.projectInterests.join(', ') : (profile.projectInterests || 'No interests set')}</p>
          </div>

          <div className="profile-section">
            <h2>GitHub</h2>
            {profile.github &&
              /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(profile.github.trim()) ? (
                <p><a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: '#222', fontWeight: 400, textDecoration: 'underline' }}>{profile.github}</a></p>
              ) : (
                <p style={{ color: 'red' }}>{profile.github}</p>
              )
            }
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
