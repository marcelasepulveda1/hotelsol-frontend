import { Link, useNavigate } from 'react-router-dom';
import { useReserva } from '../context/ReservaContext';
import { listarServicios, calcularNoches } from '../data/db';
import { formatoCLP } from '../utils';
import Boton from '../components/Boton';

// "Carrito" de la reserva: habitación + noches + servicios adicionales.
export default function Reserva() {
  const { seleccion, servicios, agregarServicio, quitarServicio, limpiar } = useReserva();
  const navigate = useNavigate();

  if (!seleccion) {
    return (
      <div className="container my-5 text-center">
        <h1>Mi reserva</h1>
        <p>Aún no has elegido una habitación.</p>
        <Link className="btn btn-primary" to="/habitaciones">Ver habitaciones</Link>
      </div>
    );
  }

  const noches = calcularNoches(seleccion.checkIn, seleccion.checkOut);
  const subtotal = seleccion.habitacion.precio * noches;
  const totalServicios = servicios.reduce((s, x) => s + x.precio, 0);

  return (
    <div className="container my-5">
      <h1 className="mb-4">Mi reserva</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card p-3 mb-3">
            <h5>{seleccion.habitacion.tipo} ({seleccion.habitacion.codigo})</h5>
            <p className="mb-0">{seleccion.checkIn} → {seleccion.checkOut} · {noches} noche(s)</p>
          </div>
          <h5>Servicios adicionales</h5>
          <ul className="list-group">
            {listarServicios().map((s) => {
              const agregado = servicios.some((x) => x.codigo === s.codigo);
              return (
                <li key={s.codigo} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{s.nombre} · {s.precio === 0 ? 'Incluido' : formatoCLP(s.precio)}</span>
                  {s.precio > 0 && (
                    agregado
                      ? <Boton etiqueta="Quitar" variante="outline-danger" onClick={() => quitarServicio(s.codigo)} />
                      : <Boton etiqueta="Agregar" variante="outline-success" onClick={() => agregarServicio(s)} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-12 col-lg-5">
          <div className="card p-3 shadow-sm">
            <p>Habitación: {formatoCLP(subtotal)}</p>
            <p>Servicios: {formatoCLP(totalServicios)}</p>
            <h4>Total: {formatoCLP(subtotal + totalServicios)}</h4>
            <div className="d-flex gap-2 mt-2">
              <Boton etiqueta="Vaciar" variante="secondary" onClick={limpiar} />
              <Boton etiqueta="Continuar al pago" variante="success" onClick={() => navigate('/checkout')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
