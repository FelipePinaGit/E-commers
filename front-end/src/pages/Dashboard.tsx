import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { Users, Package, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProductos } from '../services/productoService';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: JSX.Element;
  color: string;
  linkTo?: string;
}

const DashboardCard = ({ title, value, icon, color, linkTo }: DashboardCardProps) => {
  const CardContent = () => (
    <div className={`p-6 rounded-lg shadow-md border-l-4 ${color} bg-white flex justify-between transition-transform duration-200 hover:scale-105`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
      </div>
      <div className="flex items-center">
        {icon}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

const Dashboard = () => {
  const { user } = useAuth();
  const { carrito } = useCarrito();
  const [productCount, setProductCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const productos = await getProductos();
        setProductCount(productos.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Bienvenido, {user?.username}
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.role === 'admin' && (
            <>
              <DashboardCard 
                title="Clientes" 
                value="Gestionar" 
                icon={<Users className="h-8 w-8 text-blue-600" />} 
                color="border-blue-500" 
                linkTo="/clientes"
              />
              <DashboardCard
                title="Ventas"
                value="Gestionar"
                icon={<Activity className="h-8 w-8 text-orange-600" />}
                color="border-orange-500"
                linkTo="/ventas"
              />
            </>
          )}

          <DashboardCard 
            title="Productos" 
            value={productCount} 
            icon={<Package className="h-8 w-8 text-green-600" />} 
            color="border-green-500"
            linkTo="/productos"
          />

          <DashboardCard 
            title="Rol de Usuario" 
            value={user?.role || ''} 
            icon={<Activity className="h-8 w-8 text-purple-600" />} 
            color="border-purple-500"
          />

          {user?.role !== 'admin' && (
            <DashboardCard 
              title="Productos en Carrito" 
              value={carrito.length} 
              icon={<Package className="h-8 w-8 text-pink-600" />} 
              color="border-pink-500"
              linkTo="/carrito"
            />
          )}
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Información de acceso</h2>

        <div className="space-y-3">
          <div>
            <p className="text-gray-600">Estás logueado como:</p>
            <p className="font-semibold">{user?.username}</p>
          </div>

          <div>
            <p className="text-gray-600">Rol:</p>
            <p className="font-semibold capitalize">{user?.role}</p>
          </div>

          <div>
            <p className="text-gray-600">Permisos:</p>
            <ul className="list-disc pl-5 mt-1">
              {user?.role === 'admin' ? (
                <>
                  <li>Gestión completa de Clientes (CRUD)</li>
                  <li>Gestión completa de Productos (CRUD)</li>
                  <li>Gestión completa de Ventas (CRUD)</li>
                </>
              ) : (
                <>
                  <li>Ver catálogo de Productos</li>
                  <li>Agregar productos al carrito</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Aquí mostramos los productos con cantidad y precio total por producto */}
      {user?.role !== 'admin' && carrito.length > 0 && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Productos en tu carrito</h2>
          <ul className="divide-y divide-gray-200">
            {carrito.map(({ producto, cantidad }) => (
              <li key={producto.id} className="py-2 flex justify-between items-center">
                <span className="text-gray-700">{producto.nombre} x {cantidad}</span>
                <span className="font-semibold text-gray-800">${(producto.precioActual * cantidad).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
