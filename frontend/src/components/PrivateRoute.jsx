import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();
  
  if (!auth) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute; 