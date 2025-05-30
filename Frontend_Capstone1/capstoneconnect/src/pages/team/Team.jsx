import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../css/Navigation.css';
import '../../css/Team.css';
import Navigation from '../Navigation';
import LogoutModal from '../LogoutModal';
import NotificationModal from '../modals/NotificationModal';
import PendingTeamModal from '../modals/PendingTeamModal';
import NotSignedIn from '../NotSignedIn';
import { getProjectTeam, makeLeader, kickMember, getUserId, getProjectsByUser } from '../../api';
import { getProjectById } from '../../api';
import defaultProfilePic from '../../assets/vyn.jpg';

const placeholderImg = "https://placehold.co/144x142";
const BACKEND_URL = "http://localhost:8080";

function getProfilePictureUrl(pic) {
  if (!pic) return placeholderImg;
  if (pic.startsWith("http")) return pic;
  return BACKEND_URL + pic;
}

const Team = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [projectId, setProjectId] = useState(null); // Set this from context or props as needed
  const [notifications, setNotifications] = useState([]);
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [removedFromTeam, setRemovedFromTeam] = useState(false);
  const [showPendingTeamModal, setShowPendingTeamModal] = useState(false);
  const prevTeamMembersRef = useRef([]);
  const dropdownRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

  const handleMakeLeader = async (memberId) => {
    if (!projectId) {
      console.log('[MakeLeader] No projectId found.');
      return;
    }
    try {
      console.log(`[MakeLeader] Attempting to make member ${memberId} the leader for project ${projectId}`);
      await makeLeader(projectId, memberId);
      setShowDropdown(null); // Close dropdown after action
      const updated = await getProjectTeam(projectId);
      setTeamMembers(updated);
      // Check if current user is still in the team
      if (!updated.some(m => m.id === currentUserId)) {
        setRemovedFromTeam(true);
      }
      console.log('[MakeLeader] Team updated after making leader:', updated);
    } catch (err) {
      console.error('[MakeLeader] Failed:', err);
      alert('Failed to make leader: ' + err.message);
    }
  };

  const handleKickMember = async (memberId) => {
    if (!projectId) {
      console.log('[KickMember] No projectId found.');
      return;
    }
    try {
      console.log(`[KickMember] Attempting to kick member ${memberId} from project ${projectId}`);
      await kickMember(projectId, memberId);
      setShowDropdown(null); // Close dropdown after action
      const updated = await getProjectTeam(projectId);
      setTeamMembers(updated);
      // Check if current user is still in the team
      if (!updated.some(m => m.id === currentUserId)) {
        setRemovedFromTeam(true);
      }
      console.log('[KickMember] Team updated after kicking member:', updated);
    } catch (err) {
      console.error('[KickMember] Failed:', err);
      alert('Failed to kick member: ' + err.message);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // Check if user is authenticated
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
      getUserId().then(async ({ userId }) => {
        setCurrentUserId(userId);
        let pid = sessionStorage.getItem('currentProjectId');
        if (!pid) {
          // Try to fetch the latest project for the user
          try {
            const projects = await getProjectsByUser(userId);
            if (projects && projects.length > 0) {
              pid = projects[projects.length - 1].id;
              setProjectId(pid);
              sessionStorage.setItem('currentProjectId', pid);
              console.log('Auto-selected latest projectId:', pid);
            } else {
              sessionStorage.removeItem('currentProjectId');
              setProjectId(null);
              console.warn('No projects found for user.');
              setIsLoading(false);
              return;
            }
          } catch (err) {
            console.error('Error fetching user projects:', err);
            setIsLoading(false);
            return;
          }
        } else {
          setProjectId(pid);
        }
        if (pid) {
          // Fetch project details
          getProjectById(pid).then(proj => {
            setProject(proj);
          });
          getProjectTeam(pid).then(data => {
            console.log('Fetched teamMembers:', data);
            setTeamMembers(data);
            // Check if current user is still in the team after fetch
            if (userId && !data.some(m => m.id === userId)) {
              setRemovedFromTeam(true);
            } else {
              setRemovedFromTeam(false);
            }
          }).catch((err) => {
            console.error('Error fetching teamMembers:', err);
            setTeamMembers([]);
          });
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
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
  }, []); // Only run on mount

  useEffect(() => {
    console.log('Current teamMembers state:', teamMembers);
    console.log('Current userId:', currentUserId);
  }, [teamMembers, currentUserId]);

  // Helper: localStorage keys for join/kick dates
  const JOINED_KEY = 'teamMemberJoinedDates';
  const KICKED_KEY = 'teamMemberKickedDates';

  // Helper: get/set join date
  function getJoinedDates() {
    try {
      return JSON.parse(localStorage.getItem(JOINED_KEY) || '{}');
    } catch {
      return {};
    }
  }
  function setJoinedDate(memberId, date) {
    const data = getJoinedDates();
    if (!data[memberId]) {
      data[memberId] = date;
      localStorage.setItem(JOINED_KEY, JSON.stringify(data));
    }
  }
  function getJoinedDate(memberId) {
    const data = getJoinedDates();
    return data[memberId] || null;
  }

  // Helper: get/set kicked date
  function getKickedDates() {
    try {
      return JSON.parse(localStorage.getItem(KICKED_KEY) || '{}');
    } catch {
      return {};
    }
  }
  function setKickedDate(memberId, date) {
    const data = getKickedDates();
    data[memberId] = date;
    localStorage.setItem(KICKED_KEY, JSON.stringify(data));
  }
  function getKickedDate(memberId) {
    const data = getKickedDates();
    return data[memberId] || null;
  }

  // Helper to get join date for a member (if available)
  const getMemberJoinDate = (member) => {
    // Use localStorage if backend does not provide joinedAt
    if (member.joinedAt) {
      return new Date(member.joinedAt).toLocaleString('en-US', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    }
    const localDate = getJoinedDate(member.id);
    return localDate ? new Date(localDate).toLocaleString('en-US', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : null;
  };

  // Helper to get project creation date (if available)
  const getProjectCreationDate = () => {
    return project && project.createdAt ? new Date(project.createdAt).toLocaleString('en-US', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : null;
  };

  // Watch for new team members and add notification
  useEffect(() => {
    if (prevTeamMembersRef.current.length === 0) {
      prevTeamMembersRef.current = teamMembers;
      // Add project creation notification if available
      const projectCreatedDate = getProjectCreationDate();
      let initialNotifs = [];
      if (projectCreatedDate) {
        initialNotifs.push({
          id: 'project-created',
          message: 'Project was created',
          date: projectCreatedDate,
          color: '#3399CC'
        });
      }
      // Add join notifications for all current members (except leader)
      const joinNotifs = teamMembers.slice(1).map((m, idx) => {
        // Set join date in localStorage if not present
        if (!getJoinedDate(m.id)) {
          setJoinedDate(m.id, new Date().toISOString());
        }
        return {
          id: `member-joined-${m.id}`,
          message: `${m.name} joined team`,
          date: getMemberJoinDate(m) || 'Unknown',
          color: '#FF9933'
        };
      });
      setNotifications([...joinNotifs, ...initialNotifs]);
      return;
    }
    // Find new members
    const prevIds = new Set(prevTeamMembersRef.current.map(m => m.id));
    const newMembers = teamMembers.filter(m => !prevIds.has(m.id));
    // Find removed members
    const currentIds = new Set(teamMembers.map(m => m.id));
    const removedMembers = prevTeamMembersRef.current.filter(m => !currentIds.has(m.id));
    let newNotifs = [];
    if (newMembers.length > 0) {
      newNotifs = newNotifs.concat(newMembers.map(m => {
        // Set join date in localStorage if not present
        if (!getJoinedDate(m.id)) {
          setJoinedDate(m.id, new Date().toISOString());
        }
        return {
          id: Date.now() + Math.random(),
          message: `${m.name} joined team`,
          date: getMemberJoinDate(m) || new Date().toLocaleString('en-US', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          color: '#FF9933'
        };
      }));
    }
    if (removedMembers.length > 0) {
      newNotifs = newNotifs.concat(removedMembers.map(m => {
        // Set kicked date in localStorage
        setKickedDate(m.id, new Date().toISOString());
        return {
          id: Date.now() + Math.random(),
          message: `${m.name} was kicked from the team`,
          date: new Date().toLocaleString('en-US', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
          color: '#CC3333'
        };
      }));
    }
    if (newNotifs.length > 0) {
      setNotifications(prev => [...newNotifs, ...prev]);
    }
    prevTeamMembersRef.current = teamMembers;
  }, [teamMembers]);

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

  // Replace handleViewAllNotifications and closeNotificationModal
  const handleViewAllNotifications = () => {
    setSearchParams({ modal: 'notifications' });
  };
  const closeNotificationModal = () => {
    setSearchParams({});
  };

  // Modal open state from URL
  const isNotificationModalOpen = searchParams.get('modal') === 'notifications';

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
    const distribution = getRoleDistribution();
    // Only show up to 5 roles (since only 5 members allowed)
    const entries = Object.entries(distribution).slice(0, 5);
    const total = teamMembers.length;
    if (!total) return null;
    return entries.map(([role, count], index) => {
      const percent = ((count / total) * 100).toFixed(0);
      return (
        <div className="tc-role-percentage" key={index}>
          <div className="tc-role-color" style={{ backgroundColor: roleColors[role] || '#ddd' }}></div>
          <div className="tc-role-info">
            <span className="tc-role-name">{role}</span>
            <span className="tc-role-value">{percent}%</span>
          </div>
        </div>
      );
    });
  };

  // Helper: count roles in teamMembers
  const getRoleDistribution = () => {
    const distribution = {};
    teamMembers.forEach(member => {
      const role = member.preferredRoles?.[0] || 'Member';
      if (!distribution[role]) distribution[role] = 0;
      distribution[role]++;
    });
    return distribution;
  };

  // Generate conic gradient for pie chart
  function generatePieChartGradient() {
    const distribution = getRoleDistribution();
    const total = teamMembers.length;
    if (!total) return 'conic-gradient(#eee 0% 100%)';
    let gradient = 'conic-gradient(';
    let current = 0;
    const roles = Object.keys(distribution).slice(0, 5);
    roles.forEach((role, idx) => {
      const percent = (distribution[role] / total) * 100;
      const color = roleColors[role] || '#ddd';
      gradient += `${color} ${current}% ${current + percent}%`;
      current += percent;
      if (idx < roles.length - 1) gradient += ', ';
    });
    gradient += ')';
    return gradient;
  }

  // Make sure renderTeamMember is defined before it is used in the return statement
  const renderTeamMember = (member, idx) => {
    const isLeader = idx === 0; // Owner is always first
    const isCurrentUserLeader = teamMembers[0]?.id === currentUserId;
    const showActions = isCurrentUserLeader && !isLeader && projectId;
    return (
      <div
        className={`tc-member-card ${isLeader ? 'tc-leader' : ''}`}
        key={member.id}
        style={isLeader ? { borderColor: '#CA9F58' } : {}}
      >
        {showActions && (
          <div className="tc-member-options" ref={showDropdown === member.id ? dropdownRef : null}>
            <button className="tc-options-toggle" onClick={() => toggleDropdown(member.id)}>
              ⋮
            </button>
            {showDropdown === member.id && (
              <div className="tc-options-dropdown">
                <button onClick={() => handleMakeLeader(member.id)}>Make Leader</button>
                <button onClick={() => handleKickMember(member.id)}>Kick Member</button>
              </div>
            )}
          </div>
        )}
        <div className="tc-member-avatar" style={{ backgroundColor: '#eee', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={getProfilePictureUrl(member.profilePicture)}
            alt={member.name}
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>
        <h3 className="tc-member-name">{member.name}</h3>
        <p className="tc-member-role">{isLeader ? 'Leader' : (member.preferredRoles?.[0] || 'Member')}</p>
        {/* Joined date removed as per request */}
      </div>
    );
  };

  // Team member limit
  const TEAM_MEMBER_LIMIT = 5;

  if (!isAuthenticated) {
    return <NotSignedIn onSignIn={handleSignIn} />;
  }

  if (isLoading) {
    return (
      <div>
        <Navigation onLogout={handleLogout} />
        <div className="tc-container">
          <div className="tc-filter">
            <h1 className="tc-title">Team Composition and Members</h1>
          </div>
        </div>
        <main className="tc-main">
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            Loading project data... Please wait.
          </div>
        </main>
      </div>
    );
  }

  if (removedFromTeam) {
    return (
      <div>
        <Navigation onLogout={handleLogout} />
        <div className="tc-container">
          <div className="tc-filter">
            <h1 className="tc-title">Team Composition and Members</h1>
          </div>
        </div>
        <main className="tc-main">
          <div style={{ padding: '2rem', textAlign: 'center', color: '#c00' }}>
            You have no projects yet. Create or apply.
          </div>
        </main>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div>
        <Navigation onLogout={handleLogout} />
        <div className="tc-container">
          <div className="tc-filter">
            <h1 className="tc-title">Team Composition and Members</h1>
          </div>
        </div>
        <main className="tc-main">
          <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
            You have no projects yet.
          </div>
        </main>
      </div>
    );
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
          <div className="tc-actions">
            <button className="pending-members-btn" onClick={() => setShowPendingTeamModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Pending Members
            </button>
          </div>
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
              {notifications.slice(0, 3).map(renderNotification)}
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
              <div className="tc-pie-chart-legend" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px', background: '#fff', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 8px #0001', minWidth: '180px' }}>
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
          <div className="tc-members-container" style={{ justifyContent: 'flex-start', display: 'flex', flexWrap: 'wrap' }}>
            {teamMembers.length === 0 ? (
              <div className="tc-no-team-message" style={{ margin: '2rem 0', fontSize: '1.2rem', color: '#888' }}>
                You are not part of any team yet. Create or join a project to see your team here.
              </div>
            ) : (
              teamMembers.slice(0, TEAM_MEMBER_LIMIT).map((member, idx) => renderTeamMember(member, idx))
            )}
          </div>
        </div>
      </main>

      {showLogoutModal && <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />}
      {isNotificationModalOpen && (
        <NotificationModal notifications={notifications} onClose={closeNotificationModal} />
      )}
      {showPendingTeamModal && (
        <PendingTeamModal 
          isOpen={showPendingTeamModal} 
          onClose={() => setShowPendingTeamModal(false)} 
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default Team;
