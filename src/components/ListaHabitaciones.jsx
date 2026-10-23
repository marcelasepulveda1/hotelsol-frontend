import HabitacionCard from './HabitacionCard';

// Lista responsiva: 1 columna en celular, 2 en tablet, 3 en escritorio.
export default function ListaHabitaciones({ habitaciones }) {
  if (habitaciones.length === 0) {
    return <div className="alert alert-info">No hay habitaciones que coincidan con la búsqueda.</div>;
  }
  return (
    <div className="row g-4">
      {habitaciones.map((h) => (
        <div className="col-12 col-md-6 col-lg-4" key={h.codigo}>
          <HabitacionCard habitacion={h} />
        </div>
      ))}
    </div>
  );
}
