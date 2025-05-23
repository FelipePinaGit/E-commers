import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Clientes from './pages/Clientes';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route 
        path="/clientes" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Clientes />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/productos" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'user']}>
            <Productos />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/ventas" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Ventas />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'user']}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes