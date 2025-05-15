import React, { useEffect, useState } from 'react';
import '../css/Profile.css';
import logo from '../assets/logo.png';
import vyn from '../assets/vyn.jpg';
import '../css/Navigation.css';
import { getUserId, getProfile } from '../api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div className="profile-header">
            <div className="profile-pic">
              <img src={profile.profilePictureUrl || vyn} alt="Profile" />
            </div>
            <div className="profile-info">
              <div className="profile-actions">
                <button className="projects-btn">Your Projects</button>
                <button className="edit-btn">Edit Profile</button>
              </div>
              <h1>{profile.fullName || profile.name || 'No Name'}</h1>
              <p>{profile.email || 'No Email'}</p>
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
            <p>{profile.github || 'No GitHub set'}</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
