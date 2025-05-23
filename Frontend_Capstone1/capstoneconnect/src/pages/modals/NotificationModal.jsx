import React, { useEffect } from 'react';
import '../../css/NotificationModal.css';

const NotificationModal = ({ notifications, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="notifm-overlay">
      <div className="notifm-modal">
        <div className="notifm-header">
          <h2>All Notifications</h2>
          <button className="notifm-close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="notifm-content">
          {notifications.length === 0 ? (
            <div>No notifications found.</div>
          ) : (
            notifications.map((notification) => (
              <div className="notifm-item" key={notification.id}>
                <div
                  className="notifm-avatar"
                  style={{ backgroundColor: notification.color || '#ddd' }}
                ></div>
                <div className="notifm-content-text">
                  <p className="notifm-message">{notification.message}</p>
                  <p className="notifm-date">{notification.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
