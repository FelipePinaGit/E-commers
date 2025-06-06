import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import AppRoutes from './routes';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CarritoProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <AppRoutes />
            </main>
          </div>
        </CarritoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
