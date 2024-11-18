import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import '../styles/pages/not-found.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <AlertTriangle size={64} className="error-icon" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-button">
          <Home size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;