import { Link } from 'react-router-dom';
import { listarHabitaciones } from '../data/db';
import ListaHabitaciones from '../components/ListaHabitaciones';

export default function Home() {
  const destacadas = listarHabitaciones().slice(0, 3);
  return (
    <>
      <section className="bg-warning-subtle py-5 text-center">
        <div className="container">
          <h1 className="display-5 fw-bold">Bienvenido a HotelSol</h1>
          <p className="lead">Hotel boutique en Providencia. Reserva en línea y revisa tu reserva en tiempo real.</p>
          <Link to="/habitaciones" className="btn btn-dark btn-lg">Ver habitaciones</Link>
        </div>
      </section>
      <section className="container my-5">
        <h2 className="mb-4">Habitaciones destacadas</h2>
        <ListaHabitaciones habitaciones={destacadas} />
      </section>
    </>
  );
}
