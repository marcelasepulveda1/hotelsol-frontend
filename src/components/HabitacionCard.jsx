import { Link } from 'react-router-dom';
import { formatoCLP } from '../utils';

// Tarjeta de una habitación. Recibe los datos por props.
export default function HabitacionCard({ habitacion }) {
  const { codigo, tipo, descripcion, capacidad, precio, estado, oferta } = habitacion;
  const precioFinal = oferta ? precio * 0.8 : precio;
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title">{tipo}</h5>
          {oferta && <span className="badge bg-danger">-20%</span>}
        </div>
        <p className="card-text text-muted small">{descripcion}</p>
        <p className="mb-1">👥 {capacidad} {capacidad === 1 ? 'persona' : 'personas'}</p>
        <p className="fw-bold fs-5 mb-1">
          {oferta && <del className="text-muted fs-6 me-2">{formatoCLP(precio)}</del>}
          {formatoCLP(precioFinal)} <span className="fs-6 fw-normal">/ noche</span>
        </p>
        <span className={`badge mb-3 align-self-start ${estado === 'Disponible' ? 'bg-success' : 'bg-secondary'}`}>{estado}</span>
        <Link to={`/habitaciones/${codigo}`} className="btn btn-outline-primary mt-auto">Ver detalle</Link>
      </div>
    </div>
  );
}
