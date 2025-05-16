import React, { useState } from 'react';
import '../../css/Navigation.css';
import '../../css/Team.css';
import Navigation from '../Navigation';
import LogoutModal from '../LogoutModal';

const Team = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  // Sample data based on the image
  const teamMembers = [
    {
      id: 1,
      name: 'Jhovynn Aldrich Apurado',
      role: 'Frontend Developer',
      color: '#FF9933', // Orange color from the image
      isLeader: true
    },
    {
      id: 2,
      name: 'John Gerard Donaire',
      role: 'Backend Developer',
      color: '#33CC33', // Green color from the image
      isLeader: false
    },
    {
      id: 3,
      name: 'Harold Destura',
      role: 'Backend Developer',
      color: '#CC3333', // Red color from the image
      isLeader: false
    },
    {
      id: 4,
      name: 'Team Member 4',
      role: 'UX Designer',
      color: '#3399CC', // Blue color from the image
      isLeader: false
    },
    {
      id: 5,
      name: 'Team Member 5',
      role: 'Project Manager',
      color: '#9966CC', // Purple (additional color)
      isLeader: false
    }
  ];

  const notifications = [
    {
      id: 1,
      message: 'Jhovynn joined team',
      date: '20 April, 2023 10:30 PM'
    },
    {
      id: 2,
      message: 'John joined team',
      date: '21 April, 2023 11:30 AM'
    },
    {
      id: 3,
      message: 'Adam got employee of the month',
      date: '22 April, 2023 01:30 PM'
    }
  ];

  const renderTeamMember = (member) => (
    <div 
      className={`tc-member-card ${member.isLeader ? 'tc-leader' : ''}`} 
      key={member.id}
      style={member.isLeader ? { borderColor: '#CA9F58' } : {}}
    >
      <div 
        className="tc-member-avatar" 
        style={{ backgroundColor: member.color }}
      ></div>
      <h3 className="tc-member-name">{member.name}</h3>
      <p className="tc-member-role">{member.role}</p>
    </div>
  );

  const renderNotification = (notification) => {
    const member = teamMembers.find(m => notification.message.toLowerCase().includes(m.name.split(' ')[0].toLowerCase()));
    const avatarColor = member ? member.color : '#ddd';
  
    return (
      <div className="tc-notification-item" key={notification.id}>
        <div
          className="tc-notification-avatar"
          style={{ backgroundColor: avatarColor }}
        ></div>
        <div className="tc-notification-content">
          <p className="tc-notification-message">{notification.message}</p>
          <p className="tc-notification-date">{notification.date}</p>
        </div>
      </div>
    );
  };  

  return (
    <div>
      {/* Header */}
      <div>
        <Navigation onLogout={handleLogout} />
      </div>
      
      {/* Section Header - Only this part uses tc-container */}
      <div className="tc-container">
        <div className="tc-filter">
          <h1 className="tc-title">Team Composition and Members</h1>
        </div>
      </div>
          
      {/* Main Content */}
      <main className="tc-main">
        
        <div className="tc-dashboard-layout">
          {/* Notifications Section - Left Side */}
          <div className="tc-notifications-section">
            <div className="tc-section-header">
              <h2 className="tc-section-title">Notifications</h2>
              <button className="tc-view-all">View All</button>
            </div>
            <div className="tc-notification-list">
              {notifications.map(renderNotification)}
            </div>
          </div>

          {/* Team Chart - Right Side */}
          <div className="tc-team-chart-container">
            <div className="tc-section-header">
              <h2 className="tc-section-title">Team Distribution</h2>
            </div>
            {/* This is a placeholder for the pie chart */}
            <div className="tc-pie-chart"></div>
          </div>
        </div>

        {/* Team Members - Below both sections */}
        <div className="tc-members-section">
          <div className="tc-section-header">
            <h2 className="tc-section-title">Team Members</h2>
          </div>
          <div className="tc-members-container">
            {teamMembers.map(renderTeamMember)}
          </div>
        </div>
      </main>

      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
    </div>
  );
};

export default Team;
