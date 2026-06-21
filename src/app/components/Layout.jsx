import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Calendar, Scissors, LogOut } from 'lucide-react';

export function Layout({ children }) {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async (e) => {
    e.preventDefault();
    const res = await logout();
    console.log(res)
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {user && 
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="h-6 w-6" />
                <span className="text-xl">Salon Booking</span>
              </div>

              {user && (
                <nav className="flex items-center gap-6">
                  <Link
                    to="/services"
                    className={`flex items-center gap-2 ${
                      isActive('/services') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Scissors className="h-4 w-4" />
                    Services
                  </Link>
                  <Link
                    to="/appointments"
                    className={`flex items-center gap-2 ${
                      isActive('/appointments') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    Appointments
                  </Link>
                  <div className="flex items-center gap-4 ml-4 pl-4 border-l">
                    <span className="text-sm text-gray-600">{user.name}</span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </nav>
              )}
            </div>
          </div>
        </header>
      }
      {!loading && 
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      }
    </div>
  );
}
