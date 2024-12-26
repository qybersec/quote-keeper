import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Typography
            variant="h5"
            component="div"
            sx={{ 
              cursor: 'pointer',
              fontWeight: 'bold',
              letterSpacing: 1
            }}
            onClick={() => navigate('/')}
          >
            Quote Keeper
          </Typography>

          {!isAuthPage && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {auth ? (
                <>
                  <Typography 
                    variant="subtitle1"
                    sx={(theme) => ({ 
                      backgroundColor: theme.palette.primary.dark,
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      fontWeight: 500,
                      opacity: 0.9
                    })}
                  >
                    Welcome, {auth.username}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      color="inherit"
                      variant="outlined" 
                      onClick={() => navigate('/')}
                      sx={{ 
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 }
                      }}
                    >
                      View Quotes
                    </Button>
                    <Button 
                      color="inherit"
                      variant="outlined"
                      onClick={() => navigate('/manage-quotes')}
                      sx={{ 
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 }
                      }}
                    >
                      Manage Quotes
                    </Button>
                    <IconButton 
                      color="inherit"
                      onClick={() => navigate('/profile')}
                      sx={{ ml: 1 }}
                    >
                      <SettingsIcon />
                    </IconButton>
                    <IconButton 
                      color="inherit"
                      onClick={toggleDarkMode}
                      sx={{ ml: 1 }}
                    >
                      {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                    <Button 
                      color="inherit"
                      variant="outlined"
                      onClick={handleLogout}
                      sx={{ 
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 }
                      }}
                    >
                      Logout
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    color="inherit"
                    variant="outlined" 
                    onClick={() => navigate('/login')}
                    sx={{ 
                      borderWidth: 2,
                      '&:hover': { borderWidth: 2 }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    color="inherit"
                    variant="outlined"
                    onClick={() => navigate('/register')}
                    sx={{ 
                      borderWidth: 2,
                      '&:hover': { borderWidth: 2 }
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
  );
};

export default Navbar; 