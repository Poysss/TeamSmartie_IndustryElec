import { useState, useEffect } from 'react';
import { Edit, Trash2, Save, X, Search, UserPlus, Users } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentUsername.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-student-page">
      <div className="view-student-header">
        <div className="header-title">
          <Users size={32} className="header-icon" />
          <h2 className="table-title">Student Records</h2>
        </div>
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

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
            {filteredStudents.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.studentEmail}</td>
                <td>{student.studentUsername}</td>
                <td className="action-buttons">
                  <button className="update-button" onClick={() => handleUpdate(student)}>
                    <Edit size={16} />
                    <span>Update</span>
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(student.studentId)}>
                    <Trash2 size={16} />
                    <span>Delete</span>
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
            <div className="modal-header">
              <UserPlus size={24} className="modal-icon" />
              <h3 className="modal-title">Update Student</h3>
            </div>
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
                  <X size={16} />
                  <span>Cancel</span>
                </button>
                <button type="submit" className="modal-save">
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}