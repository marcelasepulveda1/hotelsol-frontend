import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Boton from '../components/Boton';
import ListaHabitaciones from '../components/ListaHabitaciones';
import Filtros from '../components/Filtros';
import { datosIniciales } from '../data/db';

const conRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Componentes reutilizables', () => {
  // Prueba de PROPS + EVENTO con mock (vi.fn)
  it('Boton muestra la etiqueta recibida y ejecuta onClick', async () => {
    const alHacerClic = vi.fn();
    render(<Boton etiqueta="Reservar" onClick={alHacerClic} />);
    await userEvent.click(screen.getByRole('button', { name: 'Reservar' }));
    expect(alHacerClic).toHaveBeenCalledTimes(1);
  });

  // Prueba de RENDERIZADO de lista
  it('ListaHabitaciones renderiza todas las habitaciones recibidas', () => {
    conRouter(<ListaHabitaciones habitaciones={datosIniciales.habitaciones} />);
    expect(screen.getAllByText('Ver detalle')).toHaveLength(6);
  });

  // Prueba de RENDERIZADO CONDICIONAL
  it('ListaHabitaciones muestra un aviso cuando la lista está vacía', () => {
    conRouter(<ListaHabitaciones habitaciones={[]} />);
    expect(screen.getByText(/No hay habitaciones/)).toBeInTheDocument();
  });

  it('la tarjeta muestra la insignia de oferta solo si la habitación está en oferta', () => {
    conRouter(<ListaHabitaciones habitaciones={datosIniciales.habitaciones.slice(0, 2)} />);
    expect(screen.getAllByText('-20%')).toHaveLength(1);
  });

  it('Filtros avisa al padre cuando el usuario escribe o elige un tipo', async () => {
    const onTexto = vi.fn();
    const onTipo = vi.fn();
    render(<Filtros texto="" onTexto={onTexto} tipo="" onTipo={onTipo} tipos={['Suite']} />);
    await userEvent.type(screen.getByLabelText('Buscar'), 'a');
    await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'Suite');
    expect(onTexto).toHaveBeenCalledWith('a');
    expect(onTipo).toHaveBeenCalledWith('Suite');
  });
});
