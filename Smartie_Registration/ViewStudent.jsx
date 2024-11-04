import * as React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';

export default function ViewStudent() {
  const [students, setStudents] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [editFormData, setEditFormData] = React.useState({
    firstName: '',
    lastName: '',
    studentEmail: '',
    studentUsername: '',
    studentPassword: ''
  });

  // Fetch students on component mount
  React.useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch("http://localhost:8080/student/get")
      .then(res => res.json())
      .then(data => {
        setStudents(data);
      })
      .catch(error => console.error("Error fetching students:", error));
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
    setOpen(true);
  };

  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      fetch(`http://localhost:8080/student/delete/${studentId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            fetchStudents(); // Refresh the list
          }
        })
        .catch(error => console.error("Error deleting student:", error));
    }
  };

  const handleSaveUpdate = () => {
    fetch('http://localhost:8080/student/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editFormData)
    })
      .then(response => {
        if (response.ok) {
          setOpen(false);
          fetchStudents(); // Refresh the list
        }
      })
      .catch(error => console.error("Error updating student:", error));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#2074d4', mb: 3 }}>
        Student Records
      </Typography>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.studentId}>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.studentEmail}</TableCell>
                <TableCell>{student.studentUsername}</TableCell>
                <TableCell align="center">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small" 
                    onClick={() => handleUpdate(student)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    size="small"
                    onClick={() => handleDelete(student.studentId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Student</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editFormData.firstName}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editFormData.lastName}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="studentEmail"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editFormData.studentEmail}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="studentUsername"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={editFormData.studentUsername}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            name="studentPassword"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={editFormData.studentPassword}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveUpdate} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}