// src/components/layout/Navbar.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Home, 
  BookOpen, 
  User, 
  BarChart2,
  ChevronDown 
} from 'lucide-react';
import '../../styles/components/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const isLoggedIn = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <BookOpen className="logo-icon" />
          <span>Smartie</span>
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          <Home size={20} />
          <span>Home</span>
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="nav-link">
              <BarChart2 size={20} />
              <span>Dashboard</span>
            </Link>
            <div className="profile-menu-container" ref={menuRef}>
              <button 
                className="profile-menu-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <User size={20} />
                <span>{user?.firstName || 'Profile'}</span>
                <ChevronDown size={16} className={`chevron ${showProfileMenu ? 'rotate' : ''}`} />
              </button>
              {showProfileMenu && (
                <div className="profile-dropdown">
                  {user && (
                    <div className="profile-header">
                      <span className="user-name">{`${user.firstName} ${user.lastName}`}</span>
                      <span className="user-email">{user.studentEmail}</span>
                    </div>
                  )}
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                    <User size={16} />
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;