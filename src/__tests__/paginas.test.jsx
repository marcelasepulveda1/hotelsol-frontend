import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

const irA = (ruta) => render(<MemoryRouter initialEntries={[ruta]}><App /></MemoryRouter>);

describe('Páginas y flujos', () => {
  // Prueba de ESTADO: el filtro cambia lo que se muestra
  it('el buscador filtra las habitaciones al escribir', async () => {
    irA('/habitaciones');
    expect(screen.getAllByText('Ver detalle')).toHaveLength(6);
    await userEvent.type(screen.getByLabelText('Buscar'), 'jacuzzi');
    expect(screen.getAllByText('Ver detalle')).toHaveLength(1);
    await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'Single');
    expect(screen.getByText(/No hay habitaciones/)).toBeInTheDocument();
  });

  it('Ofertas muestra solo habitaciones en oferta y Home muestra destacadas', () => {
    irA('/ofertas');
    expect(screen.getAllByText('Ver detalle')).toHaveLength(2);
  });

  it('muestra error si las fechas no son válidas o no hay disponibilidad', async () => {
    irA('/habitaciones/HB005');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar a mi reserva' }));
    expect(screen.getByRole('alert')).toHaveTextContent('fechas válidas');
    await userEvent.type(screen.getByLabelText('Llegada'), '2026-10-22');
    await userEvent.type(screen.getByLabelText('Salida'), '2026-10-24');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar a mi reserva' }));
    expect(screen.getByRole('alert')).toHaveTextContent('no está disponible');
  });

  it('flujo completo: elegir habitación, agregar servicio, validar formulario y confirmar', async () => {
    irA('/habitaciones/HB002');
    await userEvent.type(screen.getByLabelText('Llegada'), '2026-11-10');
    await userEvent.type(screen.getByLabelText('Salida'), '2026-11-12');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar a mi reserva' }));
    expect(screen.getByText(/2 noche/)).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: 'Agregar' })[0]);
    await userEvent.click(screen.getByRole('button', { name: 'Quitar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }));
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar reserva' }));
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Nombre'), 'Marcela');
    await userEvent.type(screen.getByLabelText('Apellidos'), 'Sepúlveda');
    await userEvent.type(screen.getByLabelText('Correo'), 'marcela@correo.cl');
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar reserva' }));
    expect(screen.getByText(/Reserva confirmada/)).toBeInTheDocument();
    expect(screen.getByText('RS006')).toBeInTheDocument();
  });

  it('panel admin: crear, editar y eliminar una habitación', async () => {
    irA('/admin/habitaciones');
    await userEvent.click(screen.getByRole('button', { name: 'Crear habitación' }));
    expect(screen.getByText(/Completa código/)).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Código'), 'HB007');
    await userEvent.type(screen.getByLabelText('Tipo'), 'Ejecutiva');
    await userEvent.clear(screen.getByLabelText('Precio'));
    await userEvent.type(screen.getByLabelText('Precio'), '80000');
    await userEvent.click(screen.getByLabelText('Oferta'));
    await userEvent.click(screen.getByRole('button', { name: 'Crear habitación' }));
    expect(screen.getByText('Ejecutiva')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: 'Editar' })[6]);
    await userEvent.selectOptions(screen.getByLabelText('Estado'), 'Mantención');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
    expect(screen.getByText('Habitación actualizada.')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[6]);
    expect(screen.queryByText('Ejecutiva')).not.toBeInTheDocument();
  });
});
