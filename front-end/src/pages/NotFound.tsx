import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-bold text-blue-500">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2">Página no encontrada</h2>
      <p className="text-gray-600 mb-8">La página que estás buscando no existe o ha sido movida</p>
      
      <Link 
        to="/dashboard" 
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <Home className="h-5 w-5 mr-2" />
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;