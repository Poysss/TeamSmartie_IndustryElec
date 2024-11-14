import { Link } from 'react-router-dom';
import { Home, UserPlus, Users, LogIn, Menu, GraduationCap } from 'lucide-react';

export default function Navbar() {      
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <button className="menu-button">
            <Menu size={24} color="white" />
          </button>
          <Link to="/home" className="navbar-title">
            <GraduationCap size={24} className="navbar-logo" />
            <span>Student Management</span>
          </Link>
        </div>
        <div className="navbar-right">
          <Link to="/register" className="nav-link">
            <UserPlus size={20} />
            <span>Register</span>
          </Link>
          <Link to="/view-students" className="nav-link">
            <Users size={20} />
            <span>View Students</span>
          </Link>
          <Link to="/" className="nav-link">
            <LogIn size={20} />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}