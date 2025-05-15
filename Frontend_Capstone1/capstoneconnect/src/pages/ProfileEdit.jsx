import React, { useState, useEffect } from 'react';
import '../css/ProfileEdit.css';
import logo from '../assets/logo.png';
import vyn from '../assets/vyn.jpg';
import { getUserId, getProfile, updateProfile } from '../api';

const technicalSkillOptions = [
  'C Language',
  'HTML and CSS',
  'Java',
  'PHP',
  'JavaScript',
  'Python',
  'Database Administration',
  'Dev Ops',
  'Automation',
  'Software Testing',
];

const projectInterestOptions = [
  'Web App Development',
  'Mobile App Development',
  'Task Management Systems',
  'E-Commerce Systems',
  'Game Development',
  'AI Development',
];

const roleOptions = [
  'UI/UX Developer',
  'Frontend Developer',
  'Backend Developer',
  'Game Developer',
  'Team Leader',
  'Technical Writer',
];

const ProfileEdit = () => {
  const [form, setForm] = useState({
    name: '',
    github: '',
    role: '',
    technicalSkill: '',
    projectInterest: '',
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { userId } = await getUserId();
        setUserId(userId);
        const profile = await getProfile(userId);
        setForm({
          name: profile.name || '',
          github: profile.github || '',
          role: (profile.preferredRoles && profile.preferredRoles[0]) || '',
          technicalSkill: (profile.technicalSkills && profile.technicalSkills[0]) || '',
          projectInterest: (profile.projectInterests && profile.projectInterests[0]) || '',
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await updateProfile(userId, {
        name: form.name,
        github: form.github,
        preferredRoles: [form.role],
        technicalSkills: [form.technicalSkill],
        projectInterests: [form.projectInterest],
      });
      window.location.href = '/profile';
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Navigation */}
      <header className="profile-edit-header">
        <div className="profile-edit-header__logo">
          <a href="#">
            <img src={logo} alt="Logo" />
          </a>
        </div>
        <nav className="profile-edit-header__nav">
          <ul className="profile-edit-nav-list">
            <li className="profile-edit-nav-item">
              <a href="#">Home</a>
            </li>
            <li className="profile-edit-nav-item">
              <a href="#">Profile</a>
            </li>
            <li className="profile-edit-nav-item">
              <a href="#">Projects</a>
            </li>
            <li className="profile-edit-nav-item">
              <a href="#">Team</a>
            </li>
            <li className="profile-edit-nav-item">
              <a href="#">More</a>
            </li>
          </ul>
        </nav>
        <div className="profile-edit-header__auth">
          <button className="profile-edit-btn profile-edit-btn--primary">Logout</button>
        </div>
      </header>

      {/* Main Profile Section */}
      <main className="profile-edit-container">
        {/* Sidebar */}
        <aside className="profile-edit-sidebar">
          <img src={vyn} alt="Profile Picture" />
          <h2>{form.name || 'Name'}</h2>
          <p>{form.github || 'GitHub'}</p>
        </aside>

        {/* Profile Content */}
        <section className="profile-edit-content">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="profile-input"
              />
            </div>

            <div>
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="profile-input"
              >
                <option value="">Select a role</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Technical Skills</label>
              <div className="profile-edit-radio-group">
                {technicalSkillOptions.map((skill) => (
                  <div className="profile-edit-radio-item" key={skill}>
                    <input
                      type="radio"
                      id={`skill-${skill}`}
                      name="technicalSkill"
                      value={skill}
                      checked={form.technicalSkill === skill}
                      onChange={handleChange}
                    />
                    <label htmlFor={`skill-${skill}`}>{skill}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label>Project Interest</label>
              <div className="profile-edit-radio-group">
                {projectInterestOptions.map((interest) => (
                  <div className="profile-edit-radio-item" key={interest}>
                    <input
                      type="radio"
                      id={`interest-${interest}`}
                      name="projectInterest"
                      value={interest}
                      checked={form.projectInterest === interest}
                      onChange={handleChange}
                    />
                    <label htmlFor={`interest-${interest}`}>{interest}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="github">GitHub</label>
              <input
                type="text"
                id="github"
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="profile-input"
              />
            </div>

            {/* Buttons */}
            <div className="profile-edit-button-group">
              <button type="submit" className="profile-edit-btn-save">
                Save
              </button>
              <button type="button" className="profile-edit-btn-cancel" onClick={() => window.location.href = '/profile'}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ProfileEdit;
