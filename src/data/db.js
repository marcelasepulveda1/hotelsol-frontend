// Base de datos simulada de HotelSol.
// Los datos iniciales vienen del caso; se guardan en localStorage para que persistan.

const STORAGE_KEY = 'hotelsol_db';

export const datosIniciales = {
  habitaciones: [
    { codigo: 'HB001', tipo: 'Single', descripcion: 'Habitación individual con cama de 1 plaza.', capacidad: 1, precio: 45000, estado: 'Disponible', oferta: false },
    { codigo: 'HB002', tipo: 'Doble', descripcion: 'Habitación con cama de 2 plazas.', capacidad: 2, precio: 65000, estado: 'Disponible', oferta: true },
    { codigo: 'HB003', tipo: 'Doble Twin', descripcion: 'Habitación con 2 camas de 1 plaza.', capacidad: 2, precio: 70000, estado: 'Disponible', oferta: false },
    { codigo: 'HB004', tipo: 'Superior', descripcion: 'Habitación amplia con vista a la ciudad.', capacidad: 2, precio: 90000, estado: 'Disponible', oferta: true },
    { codigo: 'HB005', tipo: 'Suite', descripcion: 'Suite con sala de estar y jacuzzi.', capacidad: 3, precio: 150000, estado: 'Disponible', oferta: false },
    { codigo: 'HB006', tipo: 'Familiar', descripcion: 'Habitación con 2 camas de 2 plazas.', capacidad: 4, precio: 120000, estado: 'Disponible', oferta: false },
  ],
  servicios: [
    { codigo: 'SV001', nombre: 'Desayuno buffet', precio: 0 },
    { codigo: 'SV002', nombre: 'Almuerzo', precio: 12000 },
    { codigo: 'SV003', nombre: 'Cena', precio: 18000 },
    { codigo: 'SV005', nombre: 'Estacionamiento', precio: 8000 },
    { codigo: 'SV007', nombre: 'Lavandería', precio: 5000 },
  ],
  reservas: [
    { codigo: 'RS001', huesped: 'Juan Pérez', habitacion: 'HB002', checkIn: '2026-10-20', checkOut: '2026-10-23', estado: 'Reservado' },
    { codigo: 'RS002', huesped: 'María González', habitacion: 'HB005', checkIn: '2026-10-21', checkOut: '2026-10-25', estado: 'Reservado' },
    { codigo: 'RS003', huesped: 'Carlos Muñoz', habitacion: 'HB001', checkIn: '2026-10-19', checkOut: '2026-10-20', estado: 'Hospedado' },
    { codigo: 'RS004', huesped: 'Ana Silva', habitacion: 'HB006', checkIn: '2026-10-22', checkOut: '2026-10-28', estado: 'Reservado' },
    { codigo: 'RS005', huesped: 'Pedro Rojas', habitacion: 'HB003', checkIn: '2026-10-18', checkOut: '2026-10-19', estado: 'Check-out' },
  ],
  usuarios: [
    { nombre: 'Administrador', correo: 'admin@hotelsol.cl', clave: 'admin123', rol: 'admin' },
    { nombre: 'Juan Pérez', correo: 'juan@correo.cl', clave: 'juan123', rol: 'cliente' },
  ],
  mensajes: [],
};

// ---------- Persistencia ----------
export function cargarDB() {
  const guardado = localStorage.getItem(STORAGE_KEY);
  if (guardado) return JSON.parse(guardado);
  guardarDB(datosIniciales);
  return structuredClone(datosIniciales);
}

export function guardarDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function reiniciarDB() {
  guardarDB(datosIniciales);
  return structuredClone(datosIniciales);
}

// ---------- CRUD de habitaciones ----------
export function listarHabitaciones() {
  return cargarDB().habitaciones;
}

export function obtenerHabitacion(codigo) {
  return listarHabitaciones().find((h) => h.codigo === codigo) || null;
}

export function crearHabitacion(habitacion) {
  const db = cargarDB();
  if (db.habitaciones.some((h) => h.codigo === habitacion.codigo)) {
    throw new Error('Ya existe una habitación con ese código');
  }
  db.habitaciones.push(habitacion);
  guardarDB(db);
  return habitacion;
}

export function actualizarHabitacion(codigo, cambios) {
  const db = cargarDB();
  const i = db.habitaciones.findIndex((h) => h.codigo === codigo);
  if (i === -1) throw new Error('Habitación no encontrada');
  db.habitaciones[i] = { ...db.habitaciones[i], ...cambios };
  guardarDB(db);
  return db.habitaciones[i];
}

export function eliminarHabitacion(codigo) {
  const db = cargarDB();
  db.habitaciones = db.habitaciones.filter((h) => h.codigo !== codigo);
  guardarDB(db);
}

// ---------- Reservas ----------
export function listarReservas() {
  return cargarDB().reservas;
}

export function listarServicios() {
  return cargarDB().servicios;
}

// Dos rangos de fechas se cruzan si uno empieza antes de que el otro termine.
export function hayCruce(inicioA, finA, inicioB, finB) {
  return inicioA < finB && inicioB < finA;
}

// Revisa si la habitación está libre en esas fechas (evita la sobreventa del caso).
export function estaDisponible(codigoHabitacion, checkIn, checkOut) {
  const hab = obtenerHabitacion(codigoHabitacion);
  if (!hab || hab.estado !== 'Disponible') return false;
  return !listarReservas().some(
    (r) =>
      r.habitacion === codigoHabitacion &&
      ['Reservado', 'Check-in', 'Hospedado'].includes(r.estado) &&
      hayCruce(checkIn, checkOut, r.checkIn, r.checkOut)
  );
}

export function crearReserva({ huesped, habitacion, checkIn, checkOut }) {
  if (!estaDisponible(habitacion, checkIn, checkOut)) {
    return { ok: false, mensaje: 'La habitación no está disponible en esas fechas.' };
  }
  const db = cargarDB();
  const codigo = 'RS' + String(db.reservas.length + 1).padStart(3, '0');
  const reserva = { codigo, huesped, habitacion, checkIn, checkOut, estado: 'Reservado' };
  db.reservas.push(reserva);
  guardarDB(db);
  return { ok: true, reserva };
}

// ---------- Usuarios (registro e inicio de sesión) ----------
// Se usa "|| []" por si el navegador tiene guardada una BD antigua sin usuarios.
export function listarUsuarios() {
  return cargarDB().usuarios || [];
}

export function registrarUsuario({ nombre, correo, clave }) {
  const db = cargarDB();
  db.usuarios = db.usuarios || [];
  if (db.usuarios.some((u) => u.correo === correo)) {
    return { ok: false, mensaje: 'Ya existe una cuenta con ese correo.' };
  }
  const usuario = { nombre, correo, clave, rol: 'cliente' };
  db.usuarios.push(usuario);
  guardarDB(db);
  return { ok: true, usuario };
}

export function iniciarSesion(correo, clave) {
  const usuario = listarUsuarios().find((u) => u.correo === correo && u.clave === clave);
  if (!usuario) return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };
  return { ok: true, usuario };
}

// ---------- Mensajes de contacto ----------
export function listarMensajes() {
  return cargarDB().mensajes || [];
}

export function guardarMensaje(mensaje) {
  const db = cargarDB();
  db.mensajes = db.mensajes || [];
  db.mensajes.push({ ...mensaje, fecha: new Date().toISOString().slice(0, 10) });
  guardarDB(db);
}

export function calcularNoches(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.round(ms / 86400000));
}
