import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword } from '../services/api';

const Profile = () => {
  const { auth, login } = useAuth();
  const [profileData, setProfileData] = useState({
    email: auth?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(profileData);
      if (response.data) {
        login(response.data);
        setSuccess('Profile updated successfully');
        setError('');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to update profile. Please try again later.'
      );
      setSuccess('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      const response = await updatePassword(passwordData);
      if (response.data) {
        setSuccess('Password updated successfully');
        setError('');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      console.error('Password update error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to update password. Please try again later.'
      );
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: -4 }}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Settings
        </Typography>
        
        <Box component="form" onSubmit={handleProfileSubmit} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Update Email
          </Typography>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleProfileChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Update Profile
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box component="form" onSubmit={handlePasswordSubmit}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Update Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 