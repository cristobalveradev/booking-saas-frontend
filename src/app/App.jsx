import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { ServicesPage } from './components/ServicesPage';
import { AppointmentsPage } from './components/AppointmentsPage';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { UserProvider } from './contexts/UserProvider';
export default function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
         
        <UserProvider>

         
        <Layout>
          <Routes>
            
            <Route path="/" element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
              
            } />
            
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <ServicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        
        </UserProvider>
        
      </AuthProvider>
    </BrowserRouter>
  );
}
