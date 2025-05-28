import React, { useState, useEffect } from 'react';
import '../../css/ProfileEdit.css';
import '../../css/Navigation.css';
import vyn from '../../assets/vyn.jpg';
import Navigation from '../Navigation';
import { getUserId, getProfile, updateProfile, uploadProfilePicture } from '../../api';
import LogoutModal from '../LogoutModal';
import NotSignedIn from '../NotSignedIn';

// Match survey page options
const technicalSkillOptions = [
  { key: 'cLanguage', label: 'C Language' },
  { key: 'php', label: 'PHP' },
  { key: 'htmlCss', label: 'HTML and CSS' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'java', label: 'Java' },
  { key: 'python', label: 'Python' },
  { key: 'other', label: 'Others' },
];
const roleOptions = [
  { key: 'uiux', label: 'UI/UX Designer' },
  { key: 'frontend', label: 'Frontend Developer' },
  { key: 'backend', label: 'Backend Developer' },
  { key: 'game', label: 'Game Developer' },
  { key: 'leader', label: 'Team Leader' },
  { key: 'writer', label: 'Technical Writer' },
];
const projectInterestOptions = [
  { key: 'web', label: 'Web App Development' },
  { key: 'mobile', label: 'Mobile App Development' },
  { key: 'task', label: 'Task Management Systems' },
  { key: 'ecommerce', label: 'E-Commerce Systems' },
  { key: 'game', label: 'Game Development' },
  { key: 'ai', label: 'AI Development' },
];

const ProfileEdit = () => {
  const [form, setForm] = useState({
    name: '',
    github: '',
    preferredRole: '',
    technicalSkills: [],
    projectInterests: [],
    otherSkill: '',
    otherInterest: '',
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [githubError, setGithubError] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicError, setProfilePicError] = useState('');

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // Clear sessions, tokens, and redirect to login page
    sessionStorage.removeItem('jwtToken');
    window.location.href = '/';
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleSignIn = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }

    async function fetchData() {
      try {
        const { userId } = await getUserId();
        setUserId(userId);
        const profile = await getProfile(userId);
        setForm({
          name: profile.name || '',
          github: profile.github || '',
          preferredRole: (profile.preferredRoles && profile.preferredRoles[0]) || '',
          technicalSkills: profile.technicalSkills || [],
          projectInterests: profile.projectInterests || [],
          otherSkill: profile.otherSkill || '',
          otherInterest: profile.otherInterest || '',
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
  }, []);

  // Checkbox handlers
  const handleCheckboxChange = (field, value) => {
    setForm((prev) => {
      const arr = prev[field] || [];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePicFile(file);
      setProfilePicError('');
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePicError('Please select a valid image file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    // Validate GitHub URL
    const githubUrl = form.github.trim();
    if (githubUrl && !/^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(githubUrl)) {
      setGithubError('Please enter a valid GitHub profile URL (e.g., https://github.com/username)');
      return;
    }
    try {
      // If a new profile picture file is selected, upload it first
      let profilePictureUrl = form.profilePicture;
      if (profilePicFile && profilePicFile.type.startsWith('image/')) {
        try {
          const data = await uploadProfilePicture(profilePicFile);
          profilePictureUrl = data.fileDownloadUri;
        } catch (uploadErr) {
          setProfilePicError('Failed to upload profile picture.');
          return;
        }
      }
      await updateProfile(userId, {
        name: form.name,
        github: githubUrl,
        preferredRoles: form.preferredRole ? [form.preferredRole] : [],
        technicalSkills: form.technicalSkills.concat(form.otherSkill ? [form.otherSkill] : []),
        projectInterests: form.projectInterests.concat(form.otherInterest ? [form.otherInterest] : []),
        profilePicture: profilePictureUrl
      });
      window.location.href = '/profile';
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
  }
  
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Navigation */}
      <div>
        <Navigation onLogout={handleLogout} />
      </div>

      {/* Main Profile Section */}
      <main className="profile-edit-container">
        {/* Sidebar */}
        <aside className="profile-edit-sidebar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '40px' }}>
          <label htmlFor="profilePicUpload" style={{ cursor: 'pointer', display: 'block' }}>
            <img src={form.profilePicture || vyn} alt="Profile Picture" style={{ width: '168px', height: '168px', borderRadius: '50%', border: '3px solid var(--primary-color)', objectFit: 'cover', display: 'block', margin: '0 auto' }} />
            <input
              type="file"
              id="profilePicUpload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePicChange}
            />
          </label>
          {profilePicError && <span style={{ color: 'red', fontSize: '13px' }}>{profilePicError}</span>}
          <h2 style={{ textAlign: 'center', width: '100%', marginTop: '18px' }}>{form.name || 'Name'}</h2>
          {form.github &&
            /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$/.test(form.github.trim()) ? (
              <p style={{ textAlign: 'center', width: '100%', marginTop: '8px' }}><a href={form.github} target="_blank" rel="noopener noreferrer" style={{ color: '#222', fontWeight: 400, textDecoration: 'underline' }}>{form.github}</a></p>
            ) : (
              <p style={{ color: 'red', textAlign: 'center', width: '100%', marginTop: '8px' }}>{form.github}</p>
            )
          }
        </aside>

        {/* Profile Content */}
        <section className="profile-edit-content">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" style={{ fontWeight: 'bold' }}>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="profile-input"
              />
            </div>

            <div>
              <label htmlFor="role" style={{ fontWeight: 'bold' }}>Role</label>
              <select
                id="role"
                name="role"
                value={form.preferredRole || ''}
                onChange={e => setForm(prev => ({ ...prev, preferredRole: e.target.value }))}
                className="profile-input"
              >
                <option value="">Select a role</option>
                {roleOptions.map(({ key, label }) => (
                  <option key={key} value={label}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: 'bold' }}>Technical Skills</label>
              <div className="profile-edit-radio-group">
                {technicalSkillOptions.map(({ key, label }) => (
                  <div className="profile-edit-radio-item" key={key}>
                    <input
                      type="checkbox"
                      id={`skill-${key}`}
                      checked={form.technicalSkills?.includes(label)}
                      onChange={() => {
                        setForm(prev => {
                          const arr = prev.technicalSkills || [];
                          if (arr.includes(label)) {
                            return { ...prev, technicalSkills: arr.filter(l => l !== label) };
                          } else {
                            return { ...prev, technicalSkills: [...arr, label] };
                          }
                        });
                      }}
                    />
                    <label htmlFor={`skill-${key}`}>{label}</label>
                    {key === 'other' && (
                      <input
                        type="text"
                        name="otherSkill"
                        value={form.otherSkill}
                        onChange={handleInputChange}
                        placeholder="Specify other skills"
                        className="profile-input"
                        style={{ marginLeft: '8px', width: '180px' }}
                        disabled={!form.technicalSkills?.includes('Others')}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 'bold' }}>Project Interests</label>
              <div className="profile-edit-radio-group">
                {projectInterestOptions.map(({ key, label }) => (
                  <div className="profile-edit-radio-item" key={key}>
                    <input
                      type="checkbox"
                      id={`interest-${key}`}
                      checked={form.projectInterests?.includes(label)}
                      onChange={() => {
                        setForm(prev => {
                          const arr = prev.projectInterests || [];
                          if (arr.includes(label)) {
                            return { ...prev, projectInterests: arr.filter(l => l !== label) };
                          } else {
                            return { ...prev, projectInterests: [...arr, label] };
                          }
                        });
                      }}
                    />
                    <label htmlFor={`interest-${key}`}>{label}</label>
                  </div>
                ))}
                {/* Only one 'Others' field below, not after AI Development */}
                <div className="profile-edit-radio-item" key="otherInterest">
                  <input
                    type="checkbox"
                    id="interest-other"
                    checked={form.projectInterests?.includes('Other')}
                    onChange={() => {
                      setForm(prev => {
                        const arr = prev.projectInterests || [];
                        if (arr.includes('Other')) {
                          return { ...prev, projectInterests: arr.filter(l => l !== 'Other'), otherInterest: '' };
                        } else {
                          return { ...prev, projectInterests: [...arr, 'Other'] };
                        }
                      });
                    }}
                  />
                  <label htmlFor="interest-other">Others:</label>
                  <input
                    type="text"
                    name="otherInterest"
                    value={form.otherInterest}
                    onChange={handleInputChange}
                    placeholder="Specify other interests"
                    className="profile-input"
                    style={{ marginLeft: '8px', width: '180px' }}
                    disabled={!form.projectInterests?.includes('Other')}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="github" style={{ fontWeight: 'bold' }}>GitHub</label>
              <input
                type="text"
                id="github"
                name="github"
                value={form.github}
                onChange={e => {
                  handleInputChange(e);
                  setGithubError('');
                }}
                placeholder="https://github.com/username"
                className="profile-input"
                style={githubError ? { borderColor: 'red' } : {}}
              />
              {githubError && <span style={{ color: 'red', fontSize: '13px' }}>{githubError}</span>}
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

      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </div>
  );
};

export default ProfileEdit;
