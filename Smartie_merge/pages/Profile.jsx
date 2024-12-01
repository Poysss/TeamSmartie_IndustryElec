// src/pages/Profile.jsx

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Edit2, 
  Save,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader,
  Check,
  Camera,
} from 'lucide-react';
import authService from '../services/auth.service';
import '../styles/pages/profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.studentEmail || '',
    username: user?.studentUsername || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.username) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }

    return true;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const updatedData = {
        studentId: user.studentId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        studentEmail: formData.email,
        studentUsername: formData.username,
        studentPassword: formData.newPassword || user.studentPassword,
        profileImage: profileImage // Include the base64 image
      };

      const response = await authService.updateProfile(updatedData);
      
      // Update local storage with new user data including the profile image
      localStorage.setItem('user', JSON.stringify({
        ...response,
        profileImage: profileImage, // Add profile image to stored user data
        token: user.token
      }));
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-image-container" onClick={handleImageClick}>
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="profile-image-placeholder">
                <User size={48} />
              </div>
            )}
            {isEditing && (
              <div className="image-overlay">
                <Camera size={20} />
                <span>Change Photo</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden-input"
              disabled={!isEditing}
            />
          </div>
          <h1>{user?.firstName} {user?.lastName}</h1>
          <p className="username">@{user?.studentUsername}</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <Check size={20} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <User size={18} />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>

          {isEditing && (
            <div className="password-section">
              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="profile-actions">
            {!isEditing ? (
              <button
                type="button"
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={20} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                    setSuccess('');
                    // Reset form data to current user data
                    setFormData({
                      firstName: user?.firstName || '',
                      lastName: user?.lastName || '',
                      email: user?.studentEmail || '',
                      username: user?.studentUsername || '',
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setProfileImage(user?.profileImage || null);
                  }}
                >
                  <X size={20} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;