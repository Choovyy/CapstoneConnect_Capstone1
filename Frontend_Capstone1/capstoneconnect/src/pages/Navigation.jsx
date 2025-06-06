import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Navigation.css';
import logo from '../assets/logo.png';

const Navigation = ({ onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="header__logo">
        <Link to="/home">
          <img src={logo} alt="CapstoneConnect Logo" />
        </Link>
      </div>
      <nav className="header__nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/home">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile">Profile</Link>
          </li>
          <li className="nav-item">
            <Link to="/project">Projects</Link>
          </li>
          <li className="nav-item">
            <Link to="/team">Team</Link>
          </li>
          <li className="nav-item">
            <Link to="/matching">Your Match</Link>
          </li>
        </ul>
      </nav>
      <div className="header__auth">
        <button className="btn btn--primary" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Navigation;
