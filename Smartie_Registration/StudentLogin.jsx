import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, UserPlus, GraduationCap } from 'lucide-react';
import { studentApi } from '../services/api';

export default function StudentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const student = await studentApi.login(username, password);
      if (student) {
        navigate('/home');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <GraduationCap size={48} className="login-logo" />
          <h2>Student Login</h2>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon-wrapper">
              <User size={20} className="input-icon" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-icon-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="register-link">
          <p>
            <UserPlus size={16} className="register-icon" />
            New Student? <Link to="/register">Register Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}