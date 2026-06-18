import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const DEV_BYPASS = true;

  if(DEV_BYPASS){
    return children;
  }
  if(loading){
    return <p>Loading...</p>
  }
  if (!isAuthenticated) {
    
    return <Navigate to="/" replace />;
  }


  return <>{children}</>;
}
