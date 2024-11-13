import { Link } from 'react-router-dom';

export default function Navbar() {      
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <button className="menu-button">
            <span className="menu-icon"></span>
          </button>
          <Link to="/home" className="navbar-title">Student</Link>
        </div>
        <div className="navbar-right">
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/view-students" className="nav-link">View Students</Link>
          <Link to="/" className="nav-link">Login</Link>
        </div>
      </div>
    </nav>
  );
}