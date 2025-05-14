import React from 'react';
import logo from '../assets/logo.png';

const Project = () => {
  const projectDetails = {
    title: 'Social Media Analytics',
    description: 'An application to analyze social media engagement and trends',
    roles: ['Data Analyst', 'Frontend Developer', 'Backend Developer'],
    skills: ['React', 'Python', 'Data Visualization', 'API Development'],
    interests: ['Real-time Analytics', 'Social Media Monitoring', 'Engage Metrics']
  };

  const renderCard = (_, index) => (
    <div key={index} style={{
      border: '1px solid #ccc',
      borderRadius: '12px',
      padding: '16px',
      width: '280px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      margin: '8px',
      backgroundColor: 'white'
    }}>
      <h3><strong>{projectDetails.title}</strong></h3>
      <p>{projectDetails.description}</p>
      <p><strong>Roles Needed:</strong></p>
      <ul>
        {projectDetails.roles.map((role, i) => <li key={i}>{role}</li>)}
      </ul>
      <p><strong>Skills Required:</strong></p>
      <ul>
        {projectDetails.skills.map((skill, i) => <li key={i}>{skill}</li>)}
      </ul>
      <p><strong>Project Interests:</strong></p>
      <ul>
        {projectDetails.interests.map((interest, i) => <li key={i}>{interest}</li>)}
      </ul>
      <button style={{
        marginTop: '8px',
        backgroundColor: '#d4b36d',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 16px',
        cursor: 'pointer'
      }}>
        Apply for Project
      </button>
    </div>
  );

  return (
    <div>
      {/* Navbar */}
      <header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '12px 24px', 
        borderBottom: '2px solid #ccc' 
      }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ height: '35px' }} />
        </div>
        <nav style={{ display: 'flex', gap: '16px' }}>
          <div className="nav-item" style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Home</div>
          <div className="nav-item" style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Profile</div>
          <div className="nav-item" style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Projects</div>
        </nav>
        <button className="logout-btn" style={{
          backgroundColor: '#2C2C2C',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </header>

      {/* Project Section Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px',
        flexWrap: 'wrap'
      }}>
        <h2 style={{ fontWeight: 'bold' }}>Project Needs</h2>
        <button style={{
          backgroundColor: '#D9B979',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          border: 'none'
        }}>
          Create Project
        </button>
      </div>

      {/* Cards */}
      <main style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '2000px'
        }}>
          {Array(5).fill(null).map(renderCard)}
        </div>
      </main>
    </div>
  );
};

export default Project;
