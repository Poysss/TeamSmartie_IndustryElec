import { useState, useEffect } from 'react';
import { studentApi } from '../services/api';

export default function ViewStudent() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    studentEmail: '',
    studentUsername: '',
    studentPassword: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await studentApi.getAllStudents();
      setStudents(data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  const handleUpdate = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      studentEmail: student.studentEmail,
      studentUsername: student.studentUsername,
      studentPassword: student.studentPassword
    });
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentApi.deleteStudent(studentId);
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    try {
      await studentApi.updateStudent(editFormData);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      setError('Failed to update student');
    }
  };

  return (
    <div className="view-student-page">
      <h2 className="table-title">Student Records</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="table-container">
        <table className="student-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.studentEmail}</td>
                <td>{student.studentUsername}</td>
                <td className="action-buttons">
                  <button className="update-button" onClick={() => handleUpdate(student)}>
                    Update
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(student.studentId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Update Student</h3>
            <form onSubmit={handleSaveUpdate}>
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={editFormData.firstName}
                  onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={editFormData.lastName}
                  onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editFormData.studentEmail}
                  onChange={(e) => setEditFormData({...editFormData, studentEmail: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  value={editFormData.studentUsername}
                  onChange={(e) => setEditFormData({...editFormData, studentUsername: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={editFormData.studentPassword}
                  onChange={(e) => setEditFormData({...editFormData, studentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="button" className="modal-cancel" onClick={() => setSelectedStudent(null)}>
                  Cancel
                </button>
                <button type="submit" className="modal-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}