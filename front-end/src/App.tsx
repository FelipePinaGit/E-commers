import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext'; // ⬅️ Importá el provider
import AppRoutes from './routes';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <CarritoProvider> {/* ⬅️ Envolvé acá */}
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <AppRoutes />
            </main>
          </div>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
