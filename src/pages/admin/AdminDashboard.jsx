import { Link } from 'react-router-dom';
import { listarHabitaciones, listarReservas } from '../../data/db';

export default function AdminDashboard() {
  const habitaciones = listarHabitaciones();
  const reservas = listarReservas();
  const activas = reservas.filter((r) => ['Reservado', 'Check-in', 'Hospedado'].includes(r.estado)).length;
  const noDisponibles = habitaciones.filter((h) => h.estado !== 'Disponible').length;

  const tarjetas = [
    { titulo: 'Habitaciones', valor: habitaciones.length, color: 'primary' },
    { titulo: 'Reservas activas', valor: activas, color: 'success' },
    { titulo: 'Fuera de servicio / mantención', valor: noDisponibles, color: 'warning' },
  ];

  return (
    <div className="container my-5">
      <h1 className="mb-4">Panel de administración</h1>
      <div className="row g-3 mb-4">
        {tarjetas.map((t) => (
          <div className="col-12 col-md-4" key={t.titulo}>
            <div className={`card text-bg-${t.color} p-3`}>
              <div>{t.titulo}</div>
              <div className="display-6 fw-bold">{t.valor}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex gap-2 flex-wrap">
        <Link className="btn btn-dark" to="/admin/habitaciones">Gestionar habitaciones</Link>
        <Link className="btn btn-outline-dark" to="/admin/reservas">Ver reservas</Link>
      </div>
    </div>
  );
}
