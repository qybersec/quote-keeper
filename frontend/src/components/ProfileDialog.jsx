import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '../context/ThemeContext';

const ProfileDialog = ({ open, onClose }) => {
  const { auth, login, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [tab, setTab] = useState(0);
  const [profileData, setProfileData] = useState({
    email: auth?.email || '',
    username: auth?.username || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    setSuccess('');
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
      setError(err.response?.data?.message || 'Failed to update profile');
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
      setError(err.response?.data?.message || 'Failed to update password');
      setSuccess('');
    }
  };

  const handleLogoutClick = () => {
    setLogoutConfirmOpen(true);
  };

  const handleLogoutConfirm = () => {
    onClose();
    logout();
    setLogoutConfirmOpen(false);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Profile Settings
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              onClick={toggleDarkMode}
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'rotate(180deg)'
                }
              }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <AnimatePresence mode="wait">
            {(success || error) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              </motion.div>
            )}
          </AnimatePresence>

          <Tabs value={tab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tab label="Update Profile" />
            <Tab label="Change Password" />
          </Tabs>

          {tab === 0 && (
            <Box component="form" onSubmit={handleProfileSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={profileData.username}
                onChange={(e) => setProfileData({ 
                  ...profileData, 
                  username: e.target.value 
                })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ 
                  ...profileData,
                  email: e.target.value 
                })}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
              >
                Update Profile
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Box component="form" onSubmit={handlePasswordSubmit}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
              >
                Update Password
              </Button>
            </Box>
          )}

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={handleLogoutClick}
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'error.main',
                  color: 'white'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to logout?
        </DialogContent>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            onClick={() => setLogoutConfirmOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            color="error"
            onClick={handleLogoutConfirm}
          >
            Logout
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default ProfileDialog; 