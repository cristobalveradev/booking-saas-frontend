import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Redirect to home/dashboard if they are already logged in
    return <Navigate to="/services" replace />;
  }

  // If NOT authenticated, show the login/signup page (the children)
  return <>{children}</>;
}