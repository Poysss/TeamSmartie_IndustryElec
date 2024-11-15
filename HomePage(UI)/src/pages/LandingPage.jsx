import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import backgroundImage from './Smartie.webp';
import { 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  IconButton, 
  Tooltip, 
  Modal 
} from '@mui/material';

const ModalComponent = ({ isOpen, onClose, onCreateClass }) => {
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    language: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onCreateClass(formData);
    setFormData({ name: '', teacher: '', language: '' }); // Reset form
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: '15px',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 3,
          }}
        >
          New Class
        </Typography>
        <FormControl sx={{ mb: 4.5, width: '100%' }}>
          <TextField
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            label="Name"
            placeholder="Enter class name"
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                height: '80px'
              }
            }}
          />
        </FormControl>
        <FormControl sx={{ mb: 4.5, width: '100%' }}>
          <TextField
            name="teacher"
            value={formData.teacher}
            onChange={handleInputChange}
            label="Teacher (optional)"
            placeholder="Enter teacher name"
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                height: '80px'
              }
            }}
          />
        </FormControl>
        <FormControl sx={{ mb: 4.5, width: '100%' }}>
          <InputLabel id="language-label">
            Language
            <Tooltip title="Select the language for your class" placement="top">
              <IconButton size="small" sx={{ ml: 0.5 }}>
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </InputLabel>
          <Select
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            labelId="language-label"
            label="Language"
            sx={{
              borderRadius: '15px',
              height: '80px'
            }}
          >
            <MenuItem value="">Select...</MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Spanish">Spanish</MenuItem>
            <MenuItem value="French">French</MenuItem>
          </Select>
        </FormControl>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            mt: 3
          }}
        >
          <Button
            onClick={onClose}
            variant="text"
            color="inherit"
            sx={{ height: '60px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              height: '60px',
              bgcolor: '#FCD34D',
              '&:hover': {
                bgcolor: '#F59E0B'
              }
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState([]); // State to store created classes

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateClass = (classData) => {
    setClasses(prevClasses => [...prevClasses, classData]);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #5e72e4, #f6c862)',
        height: '100vh',
        width: '100vw',
        m: 0,
        p: 0,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: '#0EA5E9'
      }}
    >
      {/* Navigation Bar */}
      <Box
        sx={{
          height: '100px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          bgcolor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} >
          <Box
            sx={{
              width: '60px',
              height: '60px',
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              borderRadius: '30%'
            }}
          />
          <Typography
            sx={{
              fontSize: '30px',
              fontWeight: 600,
              background: 'linear-gradient(to right, #5e72e4, #f6c862)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer'
            }}
            onClick={handleLogoClick}
          >
            SMARTIE
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{
              height: '30px',
              borderRadius: '8px',
              width: '10px',
              borderColor: '#0EA5E9',
              background: 'linear-gradient(to right, #5e72e4, #f6c862)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              '&:hover': {
                borderColor: '#0285c7',
                bgcolor: 'linear-gradient(to right, #5e72e4, #f6c862)'
              }
            }}
          >
            Logout
          </Button>
          <Box
            sx={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              bgcolor: '#E5E7EB'
            }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: '25px',
              fontWeight: 600,
              color: 'white',
              ml: '250px'
            }}
          >
            My Classes
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2.5, mr: '250px' }}>
            <Button
              variant="contained"
              startIcon={<PlayCircleOutlineIcon sx={{ fontSize: 35 }} />}
              sx={{
                minWidth: '100px',
                height: '56px',
                bgcolor: 'white',
                color: '#059669',
                borderRadius: '6px',
                fontSize: '20px',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#f9fafb'
                }
              }}
            >
              Study Games
            </Button>
            
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon sx={{ fontSize: 35 }} />}
              onClick={handleOpenModal}
              sx={{
                minWidth: '200px',
                height: '56px',
                bgcolor: 'white',
                color: '#0EA5E9',
                borderRadius: '6px',
                fontSize: '20px',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#f9fafb'
                }
              }}
            >
              New Class
            </Button>
          </Box>
        </Box>

        {/* Classes Display */}
        <Box
          sx={{
            height: '384px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          {classes.length === 0 ? (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              No classes created yet
            </Typography>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 3, 
              width: '100%', 
              px: '250px' 
            }}>
              {classes.map((classItem, index) => (
                <Box
                  key={index}
                  sx={{
                    marginBottom: '200px',
                    bgcolor: 'white',
                    borderRadius: '10px',
                    p: 3,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                >
                  <Typography variant="h6">{classItem.name}</Typography>
                  <Typography color="textSecondary">{classItem.teacher}</Typography>
                  <Typography color="textSecondary">{classItem.language}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Modal */}
      <ModalComponent 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateClass={handleCreateClass}
      />
    </Box>
  );
};

export default LandingPage;