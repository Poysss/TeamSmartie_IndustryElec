import { Link } from 'react-router-dom';
import { UserPlus, Users, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-header">
        <GraduationCap size={64} className="home-logo" />
        <h1>Welcome to Smartie</h1>
      </div>
      <div className="home-buttons">
        <Link to="/register" className="home-button">
          <UserPlus size={24} />
          <span>Register New Student</span>
        </Link>
        <Link to="/view-students" className="home-button">
          <Users size={24} />
          <span>View Students</span>
        </Link>
      </div>
    </div>
  );
}