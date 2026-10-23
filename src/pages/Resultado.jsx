import { useLocation, Link } from 'react-router-dom';

// Vista de resultado: éxito o error, según la prop "exito".
export default function Resultado({ exito }) {
  const { state } = useLocation();
  return (
    <div className="container my-5 text-center" style={{ maxWidth: 640 }}>
      {exito ? (
        <>
          <h1 className="text-success">✔ Reserva confirmada</h1>
          <p className="lead">Código de reserva: <strong>{state?.codigo}</strong></p>
          <p>{state?.huesped} · {state?.checkIn} → {state?.checkOut}</p>
        </>
      ) : (
        <>
          <h1 className="text-danger">✖ No se pudo realizar la reserva</h1>
          <p className="lead">{state?.mensaje || 'Ocurrió un error.'}</p>
        </>
      )}
      <Link to="/habitaciones" className="btn btn-primary mt-3">Volver a habitaciones</Link>
    </div>
  );
}
