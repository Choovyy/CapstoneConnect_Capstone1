import React from 'react';
import '../css/Navigation.css';
import '../css/Team.css';
import logo from '../assets/logo.png';

const Team = () => {
  // Sample data based on the image
  const teamMembers = [
    {
      id: 1,
      name: 'Jhovynn Aldrich Apurado',
      role: 'Frontend Developer',
      color: '#FF9933' // Orange color from the image
    },
    {
      id: 2,
      name: 'John Gerard Donaire',
      role: 'Backend Developer',
      color: '#33CC33' // Green color from the image
    },
    {
      id: 3,
      name: 'Harold Destura',
      role: 'Backend Developer',
      color: '#CC3333' // Red color from the image
    },
    {
      id: 4,
      name: 'Team Member 4',
      role: 'UX Designer',
      color: '#3399CC' // Blue color from the image
    },
    {
      id: 5,
      name: 'Team Member 5',
      role: 'Project Manager',
      color: '#9966CC' // Purple (additional color)
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
    },
    {
      id: 4,
      message: 'Tim joined team design',
      date: '23 April, 2023 02:30 PM'
    },
    {
      id: 5,
      message: 'David joined team design',
      date: '24 April, 2023 03:30 PM'
    }
  ];

  const renderTeamMember = (member) => (
    <div className="tc-member-card" key={member.id}>
      <div 
        className="tc-member-avatar" 
        style={{ backgroundColor: member.color }}
      ></div>
      <h3 className="tc-member-name">{member.name}</h3>
      <p className="tc-member-role">{member.role}</p>
    </div>
  );

  const renderNotification = (notification) => (
    <div className="tc-notification-item" key={notification.id}>
      <div className="tc-notification-avatar"></div>
      <div className="tc-notification-content">
        <p className="tc-notification-message">{notification.message}</p>
        <p className="tc-notification-date">{notification.date}</p>
      </div>
    </div>
  );

  return (
    <div className="tc-container">
      {/* Header */}
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

      {/* Main Content */}
      <main className="tc-main">
        <h1 className="tc-title">Team Composition and Members</h1>
        
        {/* Notifications Section */}
        <div className="tc-notifications-section">
          <div className="tc-section-header">
            <h2 className="tc-section-title">Notifications</h2>
            <button className="tc-view-all">View All</button>
          </div>
          <div className="tc-notification-list">
            {notifications.map(renderNotification)}
          </div>
        </div>

        {/* Team Chart and Members */}
        <div className="tc-team-section">
          {/* Pie Chart - This would typically be implemented with a library like Chart.js */}
          <div className="tc-team-chart">
            {/* This is a placeholder for the pie chart */}
            <div className="tc-pie-chart"></div>
          </div>

          {/* Team Members */}
          <div className="tc-members-container">
            {teamMembers.map(renderTeamMember)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Team;
