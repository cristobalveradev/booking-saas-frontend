import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  

  if(loading){
    return <p>Loading...</p>
  }
  if (!isAuthenticated) {
    
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
