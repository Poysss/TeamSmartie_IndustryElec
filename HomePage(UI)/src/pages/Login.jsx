import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {

  //login handler
  const navigate = useNavigate();//navigate function

  const handleEmailSubmit = (e) => {
    e.preventDefault();//Prevents the default form submission(di mo load)
    // Simulates log in authentication
    localStorage.setItem('authToken', 'dummy-token');//represents that the user has logged in
    navigate('/dashboard');//redirects to dashboard or home if successfully logged in
  };

  return (
    <Box 
      sx={{//main container
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        display: 'flex',
        overflow: 'hidden',
        background: 'linear-gradient(to right, #47b4d8 50%, #ffffff 50%)',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      {/* Left Side - Blue Section */}
      <Box
        sx={{
          width: '50%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 4,
          boxSizing: 'border-box'
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.2,
            mb: 2,
            fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4.5rem' }
          }}
        >
          Ready to <br/>
          Learn Something<br/>
          New?
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 2,
            textAlign: 'center',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          Quick sign-in with email or Google
        </Typography>
      </Box>

      {/* Right Side - White Section */}
      <Box
        sx={{
          width: '50%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'white'
        }}
      >
        <Container maxWidth="sm">
          <Box
            component="form"
            onSubmit={handleEmailSubmit}//handle form data processing or validation.
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              width: '100%',
              maxWidth: 400,
              mx: 'auto'
            }}
          >
            <TextField
              fullWidth
              type="email"
              placeholder="Email"
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  height: '56px',
                  borderRadius: '12px'
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#ffc107',
                color: 'white',
                borderRadius: '12px',
                height: '56px',
                fontSize: '1.1rem',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: '#ffb000'
                }
              }}
            >
              Send Sign-In Link
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography sx={{ px: 2, color: 'text.secondary' }}>or</Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <Button
            //Google sign-in simulation
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => {
                localStorage.setItem('authToken', 'google-token');//dummy token(stores a token to verify the user is logged in)
                navigate('/dashboard');//redirects user to dashboard/home
              }}
              sx={{
                height: '56px',
                color: 'black',
                borderColor: 'rgba(0, 0, 0, 0.23)',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 500,
                '&:hover': {
                  borderColor: 'rgba(0, 0, 0, 0.87)'
                }
              }}
            >
              Sign In With Google
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;