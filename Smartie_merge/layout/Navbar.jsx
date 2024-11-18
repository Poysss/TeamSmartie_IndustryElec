import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, BookOpen, User, BarChart2 } from 'lucide-react';
import '../../styles/components/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
            <Link to="/profile" className="nav-link">
              <User size={20} />
              <span>Profile</span>
            </Link>
            <button onClick={handleLogout} className="nav-link logout-btn">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
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