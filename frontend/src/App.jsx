import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import PublicQuotes from './pages/PublicQuotes';
import QuotesManager from './pages/QuotesManager';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}>
        <AuthProvider>
          <Router>
            <Navbar />
            <Box 
              component="main" 
              sx={{ 
                flex: 1,
                overflow: 'hidden',
                width: '100%'
              }}
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PublicQuotes />} />
                <Route path="/manage-quotes" element={
                  <PrivateRoute>
                    <QuotesManager />
                  </PrivateRoute>
                } />
              </Routes>
            </Box>
          </Router>
        </AuthProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;
