import { listarReservas } from '../../data/db';

const colores = { Reservado: 'primary', 'Check-in': 'info', Hospedado: 'success', 'Check-out': 'secondary', Cancelado: 'danger' };

export default function AdminReservas() {
  const reservas = listarReservas();
  return (
    <div className="container my-5">
      <h1 className="mb-4">Reservas</h1>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead><tr><th>Código</th><th>Huésped</th><th>Habitación</th><th>Check-in</th><th>Check-out</th><th>Estado</th></tr></thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.codigo}>
                <td>{r.codigo}</td><td>{r.huesped}</td><td>{r.habitacion}</td><td>{r.checkIn}</td><td>{r.checkOut}</td>
                <td><span className={`badge bg-${colores[r.estado] || 'dark'}`}>{r.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
