import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import ProfileDialog from './ProfileDialog';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleMouseEnter = (event) => setAnchorEl(event.currentTarget);
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ 
                cursor: 'pointer',
                fontWeight: 'bold',
                letterSpacing: 1,
                padding: 2,
                margin: 0,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 0.8)',
                  transform: 'translateY(-1px)'
                },
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
              onClick={() => navigate('/')}
            >
              Quote Keeper
            </Typography>

            {!isAuthPage && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {auth ? (
                  <>
                    <Button
                      onMouseEnter={handleMouseEnter}
                      endIcon={<KeyboardArrowDownIcon />}
                      sx={(theme) => ({ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        color: 'white',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          transform: 'translateY(-1px)'
                        }
                      })}
                    >
                      Welcome, {auth.username}!
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{ 
                        onMouseLeave: handleClose,
                        sx: { pointerEvents: 'auto' }
                      }}
                      sx={{ pointerEvents: 'none' }}
                      PaperProps={{
                        elevation: 3,
                        sx: {
                          minWidth: 200,
                          mt: 1,
                          '& .MuiMenuItem-root': {
                            py: 1.5,
                            px: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.08)'
                            }
                          }
                        }
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <MenuItem onClick={() => {
                        navigate('/manage-quotes');
                        handleClose();
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <CollectionsBookmarkIcon sx={{ fontSize: 20 }} />
                          My Quotes
                        </Box>
                      </MenuItem>
                      <MenuItem onClick={() => {
                        setProfileOpen(true);
                        handleClose();
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <AccountCircleIcon sx={{ fontSize: 20 }} />
                          Profile Settings
                        </Box>
                      </MenuItem>
                      <Divider sx={{ my: 1 }} />
                      <MenuItem 
                        onClick={() => {
                          handleClose();
                          logout();
                          navigate('/login');
                        }}
                        sx={{ 
                          color: 'error.main',
                          '&:hover': {
                            backgroundColor: 'error.main',
                            color: 'white'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <LogoutIcon sx={{ fontSize: 20 }} />
                          Logout
                        </Box>
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      color="inherit"
                      variant="outlined" 
                      onClick={() => navigate('/login')}
                      sx={{ 
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          borderWidth: 1,
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      color="inherit"
                      variant="outlined"
                      onClick={() => navigate('/register')}
                      sx={{ 
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                          borderWidth: 1,
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      Register
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <ProfileDialog 
        open={profileOpen} 
        onClose={() => setProfileOpen(false)} 
      />
    </>
  );
};

export default Navbar; 