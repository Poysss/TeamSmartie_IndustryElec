import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Addstudent() {
  const [firstName, setFirstName] = React.useState(''); 
  const [lastName, setLastName] = React.useState(''); 
  const [studentEmail, setStudentEmail] = React.useState('');
  const [studentUsername, setStudentUsername] = React.useState(''); 
  const [studentPassword, setStudentPassword] = React.useState('');  

  const handleClick = (e) => {
    e.preventDefault();
    const student = { 
      firstName, 
      lastName, 
      studentEmail,
      studentUsername, 
      studentPassword 
    };
    console.log(student);
    fetch("http://localhost:8080/student/add",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(student)
    }).then(() => {
      console.log("New Student Added");
    });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '30px' }}>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', width: '100%', padding: 3, paddingTop: 5, boxShadow: 3, borderRadius: 2, backgroundColor: 'background.paper', '& .MuiTextField-root': { m: 1, width: '100%' }, border: '1px solid #ddd' }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#2074d4', mb: 1 }}>Register</Typography>

        <TextField id="first-name" label="First Name" variant="outlined" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <TextField id="last-name" label="Last Name" variant="outlined" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <TextField id="email" label="Email" variant="outlined" fullWidth value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
        <TextField id="username" label="Username" variant="outlined" fullWidth value={studentUsername} onChange={(e) => setStudentUsername(e.target.value)} />
        <TextField id="password" label="Password" type="password" variant="outlined" fullWidth value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} />
        
        <Button variant="contained" sx={{ mt: 2, width: '100%' }} onClick={handleClick}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}
