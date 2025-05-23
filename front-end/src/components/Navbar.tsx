import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, User, LayoutDashboard, Users, Package, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Don't render navbar on login page
  if (location.pathname === '/login') {
    return null;
  }
  
  const isActive = (path: string) => location.pathname === path;
  
  const NavLink = ({ to, label, icon }: { to: string, label: string, icon: JSX.Element }) => (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
        isActive(to)
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={() => setIsOpen(false)}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  );
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">E-Commerce</span>
            </Link>
          </div>
          
          {isAuthenticated && (
            <>
              {/* Desktop menu */}
              <div className="hidden md:flex md:items-center md:space-x-4">
                <NavLink 
                  to="/dashboard" 
                  label="Dashboard" 
                  icon={<LayoutDashboard className="h-5 w-5" />} 
                />
                
                {user?.role === 'admin' && (
                  <>
                    <NavLink 
                      to="/clientes" 
                      label="Clientes" 
                      icon={<Users className="h-5 w-5" />} 
                    />
                    <NavLink 
                      to="/ventas" 
                      label="Ventas" 
                      icon={<ShoppingCart className="h-5 w-5" />} 
                    />
                  </>
                )}
                
                <NavLink 
                  to="/productos" 
                  label="Productos" 
                  icon={<Package className="h-5 w-5" />} 
                />
                
                <div className="px-4 py-2 border-l ml-2 flex items-center text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="ml-2">{user?.username} ({user?.role})</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2">Cerrar sesión</span>
                </button>
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isAuthenticated && isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink 
              to="/dashboard" 
              label="Dashboard" 
              icon={<LayoutDashboard className="h-5 w-5" />} 
            />
            
            {user?.role === 'admin' && (
              <>
                <NavLink 
                  to="/clientes" 
                  label="Clientes" 
                  icon={<Users className="h-5 w-5" />} 
                />
                <NavLink 
                  to="/ventas" 
                  label="Ventas" 
                  icon={<ShoppingCart className="h-5 w-5" />} 
                />
              </>
            )}
            
            <NavLink 
              to="/productos" 
              label="Productos" 
              icon={<Package className="h-5 w-5" />} 
            />
            
            <div className="flex items-center px-4 py-2 text-gray-700 border-t">
              <User className="h-5 w-5" />
              <span className="ml-2">{user?.username} ({user?.role})</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors rounded-md"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar