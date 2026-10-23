import { NavLink, Link } from 'react-router-dom';
import { useReserva } from '../context/ReservaContext';

export default function Navbar() {
  const { seleccion } = useReserva();
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">☀ HotelSol</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Abrir menú">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/habitaciones">Habitaciones</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/ofertas">Ofertas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>
          </ul>
          <Link className="btn btn-success btn-sm" to="/reserva">
            🛏 Mi reserva {seleccion ? '(1)' : '(0)'}
          </Link>
        </div>
      </div>
    </nav>
  );
}
