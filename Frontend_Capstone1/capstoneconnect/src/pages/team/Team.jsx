import React, { useState, useRef, useEffect } from 'react';
import '../../css/Navigation.css';
import '../../css/Team.css';
import Navigation from '../Navigation';
import LogoutModal from '../LogoutModal';
import NotificationModal from '../modals/NotificationModal';
import NotSignedIn from '../NotSignedIn';

const Team = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dropdownRef = useRef(null);

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

  const toggleDropdown = (memberId) => {
    if (showDropdown === memberId) {
      setShowDropdown(null);
    } else {
      setShowDropdown(memberId);
    }
  };

  const makeLeader = (memberId) => {
    // Logic to make a member the leader
    console.log(`Making member ${memberId} the leader`);
    setShowDropdown(null);
  };

  const kickMember = (memberId) => {
    // Logic to kick a member
    console.log(`Kicking member ${memberId}`);
    setShowDropdown(null);
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
    }
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Available role colors
  const roleColors = {
    'UI/UX Designer': '#3399CC',
    'Frontend Developer': '#9966CC',
    'Backend Developer': '#33CC33',
    'Game Developer': '#FFB84D',
    'Team Leader': '#FF9933',
    'Technical Writer': '#CC3333'
  };

  // Sample data based on the image
  const teamMembers = [
    {
      id: 1,
      name: 'Jhovynn Aldrich Apurado',
      role: 'Team Leader',
      color: roleColors['Team Leader'], 
      isLeader: true
    },
    {
      id: 2,
      name: 'John Gerard Donaire',
      role: 'Backend Developer',
      color: roleColors['Backend Developer'], 
      isLeader: false
    },
    {
      id: 3,
      name: 'Harold Destura',
      role: 'Backend Developer',
      color: roleColors['Backend Developer'], 
      isLeader: false
    },
    {
      id: 4,
      name: 'Team Member 4',
      role: 'UI/UX Designer',
      color: roleColors['UI/UX Designer'], 
      isLeader: false
    },
    {
      id: 5,
      name: 'Team Member 5',
      role: 'Frontend Developer',
      color: roleColors['Frontend Developer'], 
      isLeader: false
    }
  ];

  // Calculate role distribution
  const calculateRoleDistribution = () => {
    const roles = ['UI/UX Designer', 'Frontend Developer', 'Backend Developer', 
                  'Game Developer', 'Team Leader', 'Technical Writer'];
    const distribution = {};
    const totalMembers = teamMembers.length;
    
    // Initialize all roles with 0
    roles.forEach(role => {
      distribution[role] = {
        count: 0,
        percentage: 0,
        color: roleColors[role]
      };
    });
    
    // Count members with each role
    teamMembers.forEach(member => {
      if (distribution[member.role]) {
        distribution[member.role].count += 1;
      }
    });
    
    // Calculate percentages
    roles.forEach(role => {
      distribution[role].percentage = Math.round((distribution[role].count / totalMembers) * 100);
    });
    
    return distribution;
  };
  
  const roleDistribution = calculateRoleDistribution();
  
  // Generate conic gradient for pie chart
  const generatePieChartGradient = () => {
    const roles = Object.keys(roleDistribution).filter(role => roleDistribution[role].count > 0);
    
    if (roles.length === 0) return 'conic-gradient(#eee 0% 100%)';
    
    let gradient = 'conic-gradient(';
    let currentPercentage = 0;
    
    roles.forEach((role, index) => {
      const percentage = roleDistribution[role].percentage;
      const color = roleDistribution[role].color;
      
      if (percentage > 0) {
        gradient += `${color} ${currentPercentage}% ${currentPercentage + percentage}%`;
        currentPercentage += percentage;
        
        if (index < roles.length - 1 && roles[index + 1] && roleDistribution[roles[index + 1]].percentage > 0) {
          gradient += ', ';
        }
      }
    });
    
    gradient += ')';
    return gradient;
  };

  const allNotifications = [
    {
      id: 1,
      message: 'Jhovynn joined team',
      date: '20 April, 2023 10:30 PM',
      color: '#FF9933'
    },
    {
      id: 2,
      message: 'John joined team',
      date: '21 April, 2023 11:30 AM',
      color: '#33CC33'
    },
    {
      id: 3,
      message: 'Adam got employee of the month',
      date: '22 April, 2023 01:30 PM',
      color: '#9966CC'
    },
    {
      id: 4,
      message: 'Harold submitted a new task',
      date: '23 April, 2023 03:15 PM',
      color: '#CC3333'
    },
    {
      id: 5,
      message: 'Team meeting scheduled for tomorrow',
      date: '24 April, 2023 09:00 AM',
      color: '#3399CC'
    },
    {
      id: 6,
      message: 'Project deadline extended by two days',
      date: '25 April, 2023 05:30 PM',
      color: '#ddd'
    }
  ];

  // Limited notifications for main view (only 3)
  const limitedNotifications = allNotifications.slice(0, 3);

  const handleViewAllNotifications = () => {
    setShowNotificationModal(true);
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
  };

  const renderTeamMember = (member) => {
    // Get the leader for comparison
    const leader = teamMembers.find(m => m.isLeader);
    // Only show options for non-leader cards and only if the current user is the leader
    const shouldShowOptions = !member.isLeader && leader?.id === 1; // Assuming user ID 1 is the current user

    return (
      <div 
        className={`tc-member-card ${member.isLeader ? 'tc-leader' : ''}`} 
        key={member.id}
        style={member.isLeader ? { borderColor: '#CA9F58' } : {}}
      >
        {shouldShowOptions && (
          <div className="tc-member-options" ref={showDropdown === member.id ? dropdownRef : null}>
            <button className="tc-options-toggle" onClick={() => toggleDropdown(member.id)}>
              ⋮
            </button>
            {showDropdown === member.id && (
              <div className="tc-options-dropdown">
                <button onClick={() => makeLeader(member.id)}>Make Leader</button>
                <button onClick={() => kickMember(member.id)}>Kick Member</button>
              </div>
            )}
          </div>
        )}
        <div 
          className="tc-member-avatar" 
          style={{ backgroundColor: member.color }}
        ></div>
        <h3 className="tc-member-name">{member.name}</h3>
        <p className="tc-member-role">{member.role}</p>
      </div>
    );
  };

  const renderNotification = (notification) => {
    const member = teamMembers.find(m => notification.message.toLowerCase().includes(m.name.split(' ')[0].toLowerCase()));
    const avatarColor = member ? member.color : notification.color || '#ddd';
  
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

  // Render role percentage labels
  const renderRolePercentages = () => {
    return Object.keys(roleDistribution)
      .filter(role => roleDistribution[role].percentage > 0)
      .map((role, index) => (
        <div className="tc-role-percentage" key={index}>
          <div 
            className="tc-role-color" 
            style={{ backgroundColor: roleDistribution[role].color }}
          ></div>
          <div className="tc-role-info">
            <span className="tc-role-name">{role}</span>
            <span className="tc-role-value">{roleDistribution[role].percentage}%</span>
          </div>
        </div>
      ));
  };

  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
  }

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
              <button className="tc-view-all" onClick={handleViewAllNotifications}>View All</button>
            </div>
            <div className="tc-notification-list">
              {limitedNotifications.map(renderNotification)}
            </div>
          </div>

          {/* Team Chart - Right Side */}
          <div className="tc-team-chart-container">
            <div className="tc-section-header">
              <h2 className="tc-section-title">Team Distribution</h2>
            </div>
            <div className="tc-pie-chart-wrapper">
              <div 
                className="tc-pie-chart"
                style={{ background: generatePieChartGradient() }}
              ></div>
              <div className="tc-pie-chart-legend">
                {renderRolePercentages()}
              </div>
            </div>
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
      {showNotificationModal && <NotificationModal notifications={allNotifications} onClose={closeNotificationModal} />}
    </div>
  );
};

export default Team;
