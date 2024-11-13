import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../services/api';

export default function AddStudent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const student = {
        firstName,
        lastName,
        studentEmail,
        studentUsername,
        studentPassword
      };

      await studentApi.register(student);
      navigate('/view-students');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Register New Student</h2>
        {error && <div className="error-message">{error}</div>}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={studentUsername}
              onChange={(e) => setStudentUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Register Student</button>
        </form>
      </div>
    </div>
  );
}