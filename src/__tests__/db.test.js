import { describe, it, expect } from 'vitest';
import {
  listarHabitaciones, obtenerHabitacion, crearHabitacion, actualizarHabitacion,
  eliminarHabitacion, estaDisponible, crearReserva, calcularNoches, hayCruce, reiniciarDB,
} from '../data/db';

describe('Base de datos simulada (CRUD)', () => {
  it('carga las 6 habitaciones iniciales del caso', () => {
    expect(listarHabitaciones()).toHaveLength(6);
  });

  it('crea, actualiza y elimina una habitación', () => {
    crearHabitacion({ codigo: 'HB099', tipo: 'Prueba', descripcion: '', capacidad: 1, precio: 1000, estado: 'Disponible', oferta: false });
    expect(obtenerHabitacion('HB099')).not.toBeNull();
    actualizarHabitacion('HB099', { precio: 2000 });
    expect(obtenerHabitacion('HB099').precio).toBe(2000);
    eliminarHabitacion('HB099');
    expect(obtenerHabitacion('HB099')).toBeNull();
  });

  it('no permite crear habitaciones con código repetido ni actualizar una inexistente', () => {
    expect(() => crearHabitacion({ codigo: 'HB001' })).toThrow('Ya existe');
    expect(() => actualizarHabitacion('XX', {})).toThrow('no encontrada');
  });

  it('evita la sobreventa: rechaza fechas que se cruzan con una reserva', () => {
    // RS002 ocupa HB005 del 21 al 25 de octubre
    expect(estaDisponible('HB005', '2026-10-22', '2026-10-24')).toBe(false);
    expect(estaDisponible('HB005', '2026-10-25', '2026-10-27')).toBe(true);
    expect(crearReserva({ huesped: 'X', habitacion: 'HB005', checkIn: '2026-10-22', checkOut: '2026-10-23' }).ok).toBe(false);
    const r = crearReserva({ huesped: 'X', habitacion: 'HB005', checkIn: '2026-11-01', checkOut: '2026-11-03' });
    expect(r.ok).toBe(true);
    expect(r.reserva.codigo).toBe('RS006');
  });

  it('calcula noches, cruces y reinicia la base', () => {
    expect(calcularNoches('2026-10-20', '2026-10-23')).toBe(3);
    expect(hayCruce('2026-10-01', '2026-10-05', '2026-10-05', '2026-10-07')).toBe(false);
    actualizarHabitacion('HB001', { estado: 'Mantención' });
    expect(estaDisponible('HB001', '2026-12-01', '2026-12-02')).toBe(false);
    expect(reiniciarDB().habitaciones[0].estado).toBe('Disponible');
  });
});
