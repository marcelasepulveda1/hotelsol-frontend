import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { obtenerHabitacion, estaDisponible } from '../data/db';
import { useReserva } from '../context/ReservaContext';
import { formatoCLP } from '../utils';
import Boton from '../components/Boton';

export default function DetalleHabitacion() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { setSeleccion } = useReserva();
  const habitacion = obtenerHabitacion(codigo);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState('');

  if (!habitacion) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">Habitación no encontrada.</div>
        <Link to="/habitaciones">Volver</Link>
      </div>
    );
  }

  const reservar = () => {
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setError('Selecciona fechas válidas: la salida debe ser posterior a la llegada.');
      return;
    }
    if (!estaDisponible(codigo, checkIn, checkOut)) {
      setError('La habitación no está disponible en esas fechas.');
      return;
    }
    setSeleccion({ habitacion, checkIn, checkOut });
    navigate('/reserva');
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <h1>{habitacion.tipo} <small className="text-muted fs-5">{habitacion.codigo}</small></h1>
          <p className="lead">{habitacion.descripcion}</p>
          <p>👥 Capacidad: {habitacion.capacidad}</p>
          <p className="fs-4 fw-bold">{formatoCLP(habitacion.precio)} / noche</p>
          <p>Incluye desayuno buffet.</p>
        </div>
        <div className="col-12 col-lg-5">
          <div className="card p-3 shadow-sm">
            <h5>Elige tus fechas</h5>
            <label className="form-label" htmlFor="in">Llegada</label>
            <input id="in" type="date" className="form-control mb-2" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            <label className="form-label" htmlFor="out">Salida</label>
            <input id="out" type="date" className="form-control mb-3" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
            <Boton etiqueta="Agregar a mi reserva" variante="success" onClick={reservar} />
          </div>
        </div>
      </div>
    </div>
  );
}
