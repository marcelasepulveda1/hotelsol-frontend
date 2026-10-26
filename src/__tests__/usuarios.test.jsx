import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import * as db from '../data/db';

const irA = (ruta) => render(<MemoryRouter initialEntries={[ruta]}><App /></MemoryRouter>);

describe('Usuarios y contacto', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // Pruebas de la BD simulada
  it('registrarUsuario no permite correos repetidos', () => {
    expect(db.registrarUsuario({ nombre: 'Ana', correo: 'ana@correo.cl', clave: '123456' }).ok).toBe(true);
    const repetido = db.registrarUsuario({ nombre: 'Ana 2', correo: 'ana@correo.cl', clave: '123456' });
    expect(repetido.ok).toBe(false);
    expect(repetido.mensaje).toMatch(/Ya existe/);
  });

  it('si el navegador tiene una BD antigua sin usuarios, se agregan los usuarios iniciales', () => {
    localStorage.setItem('hotelsol_db', JSON.stringify({ habitaciones: [], servicios: [], reservas: [] }));
    expect(db.iniciarSesion('admin@hotelsol.cl', 'admin123').ok).toBe(true);
    expect(db.listarMensajes()).toEqual([]);
  });

  it('iniciarSesion acepta credenciales correctas y rechaza las incorrectas', () => {
    expect(db.iniciarSesion('admin@hotelsol.cl', 'admin123').usuario.rol).toBe('admin');
    expect(db.iniciarSesion('admin@hotelsol.cl', 'mala').ok).toBe(false);
  });

  // Renderizado condicional: el enlace Admin aparece solo al ingresar como administrador
  it('login de administrador muestra su nombre y el enlace Admin', async () => {
    irA('/login');
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Ingresa tu correo');
    await userEvent.type(screen.getByLabelText('Correo'), 'admin@hotelsol.cl');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'admin123');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByText(/Hola, Administrador/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Salir' }));
    expect(screen.getByRole('link', { name: 'Ingresar' })).toBeInTheDocument();
  });

  it('login con clave incorrecta muestra error', async () => {
    irA('/login');
    await userEvent.type(screen.getByLabelText('Correo'), 'juan@correo.cl');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'equivocada');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('incorrectos');
  });

  it('registro valida el formulario y luego crea la cuenta', async () => {
    irA('/registro');
    await userEvent.click(screen.getByRole('button', { name: 'Registrarme' }));
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Marcela');
    await userEvent.type(screen.getByLabelText('Correo'), 'marcela@correo.cl');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'clave123');
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'otra123');
    await userEvent.click(screen.getByRole('button', { name: 'Registrarme' }));
    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    await userEvent.clear(screen.getByLabelText('Confirmar contraseña'));
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'clave123');
    await userEvent.click(screen.getByRole('button', { name: 'Registrarme' }));
    expect(screen.getByText(/Hola, Marcela/)).toBeInTheDocument();
  });

  it('registro con correo repetido muestra el error en el campo', async () => {
    irA('/registro');
    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Otro Juan');
    await userEvent.type(screen.getByLabelText('Correo'), 'juan@correo.cl');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'clave123');
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'clave123');
    await userEvent.click(screen.getByRole('button', { name: 'Registrarme' }));
    expect(screen.getByText('Ya existe una cuenta con ese correo.')).toBeInTheDocument();
  });

  // Uso de mock: espiamos guardarMensaje para comprobar que se llama con los datos del formulario
  it('contacto valida y envía el mensaje (mock de guardarMensaje)', async () => {
    const espia = vi.spyOn(db, 'guardarMensaje');
    irA('/contacto');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres')).toBeInTheDocument();
    expect(espia).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText('Nombre'), 'Marcela');
    await userEvent.type(screen.getByLabelText('Correo'), 'marcela@correo.cl');
    await userEvent.selectOptions(screen.getByLabelText('Asunto'), 'Reserva de grupo');
    await userEvent.type(screen.getByLabelText('Mensaje'), 'Quiero cotizar 3 habitaciones.');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Gracias');
    expect(db.listarMensajes()).toHaveLength(1);
    expect(db.listarMensajes()[0].asunto).toBe('Reserva de grupo');
  });
});
