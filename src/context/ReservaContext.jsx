import { createContext, useContext, useState } from 'react';

// Estado global del "carrito de reserva": qué habitación eligió el huésped y qué servicios agregó.
const ReservaContext = createContext(null);

export function ReservaProvider({ children }) {
  const [seleccion, setSeleccion] = useState(null); // { habitacion, checkIn, checkOut }
  const [servicios, setServicios] = useState([]);

  const agregarServicio = (servicio) =>
    setServicios((prev) => (prev.some((s) => s.codigo === servicio.codigo) ? prev : [...prev, servicio]));
  const quitarServicio = (codigo) => setServicios((prev) => prev.filter((s) => s.codigo !== codigo));
  const limpiar = () => {
    setSeleccion(null);
    setServicios([]);
  };

  return (
    <ReservaContext.Provider value={{ seleccion, setSeleccion, servicios, agregarServicio, quitarServicio, limpiar }}>
      {children}
    </ReservaContext.Provider>
  );
}

export const useReserva = () => useContext(ReservaContext);
