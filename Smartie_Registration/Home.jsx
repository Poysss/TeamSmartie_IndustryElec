import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to Student Management System</h1>
      <div className="home-buttons">
        <Link to="/register" className="home-button">Register New Student</Link>
        <Link to="/view-students" className="home-button">View Students</Link>
      </div>
    </div>
  );
}