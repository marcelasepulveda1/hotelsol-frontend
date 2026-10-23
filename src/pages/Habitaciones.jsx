import { useState } from 'react';
import { listarHabitaciones } from '../data/db';
import ListaHabitaciones from '../components/ListaHabitaciones';
import Filtros from '../components/Filtros';

export default function Habitaciones({ soloOfertas = false }) {
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState('');
  const todas = listarHabitaciones().filter((h) => !soloOfertas || h.oferta);
  const tipos = [...new Set(todas.map((h) => h.tipo))];

  const filtradas = todas.filter(
    (h) =>
      (tipo === '' || h.tipo === tipo) &&
      (h.tipo + ' ' + h.descripcion).toLowerCase().includes(texto.toLowerCase())
  );

  return (
    <div className="container my-5">
      <h1 className="mb-4">{soloOfertas ? 'Ofertas' : 'Habitaciones'}</h1>
      <Filtros texto={texto} onTexto={setTexto} tipo={tipo} onTipo={setTipo} tipos={tipos} />
      <ListaHabitaciones habitaciones={filtradas} />
    </div>
  );
}
