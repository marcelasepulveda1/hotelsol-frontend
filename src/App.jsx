import { Routes, Route } from 'react-router-dom';
import { ReservaProvider } from './context/ReservaContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Habitaciones from './pages/Habitaciones';
import DetalleHabitacion from './pages/DetalleHabitacion';
import Reserva from './pages/Reserva';
import Checkout from './pages/Checkout';
import Resultado from './pages/Resultado';
import Nosotros from './pages/Nosotros';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHabitaciones from './pages/admin/AdminHabitaciones';
import AdminReservas from './pages/admin/AdminReservas';

export default function App() {
  return (
    <ReservaProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/habitaciones" element={<Habitaciones />} />
            <Route path="/habitaciones/:codigo" element={<DetalleHabitacion />} />
            <Route path="/ofertas" element={<Habitaciones soloOfertas />} />
            <Route path="/reserva" element={<Reserva />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/reserva-exitosa" element={<Resultado exito />} />
            <Route path="/reserva-error" element={<Resultado exito={false} />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/habitaciones" element={<AdminHabitaciones />} />
            <Route path="/admin/reservas" element={<AdminReservas />} />
            <Route path="*" element={<div className="container my-5"><h1>Página no encontrada</h1></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ReservaProvider>
  );
}
