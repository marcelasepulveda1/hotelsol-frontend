import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useReserva } from '../context/ReservaContext';
import { crearReserva } from '../data/db';

const vacio = { nombre: '', apellidos: '', correo: '', telefono: '' };

export default function Checkout() {
  const { seleccion, limpiar } = useReserva();
  const navigate = useNavigate();
  const [form, setForm] = useState(vacio);
  const [errores, setErrores] = useState({});

  if (!seleccion) return <Navigate to="/reserva" />;

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!form.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios';
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) e.correo = 'Correo no válido';
    return e;
  };

  const enviar = (ev) => {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    const resultado = crearReserva({
      huesped: `${form.nombre} ${form.apellidos}`,
      habitacion: seleccion.habitacion.codigo,
      checkIn: seleccion.checkIn,
      checkOut: seleccion.checkOut,
    });
    if (resultado.ok) {
      limpiar();
      navigate('/reserva-exitosa', { state: resultado.reserva });
    } else {
      navigate('/reserva-error', { state: { mensaje: resultado.mensaje } });
    }
  };

  const campo = (name, label, type = 'text') => (
    <div className="col-12 col-md-6">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className={`form-control ${errores[name] ? 'is-invalid' : ''}`} value={form[name]} onChange={cambiar} />
      {errores[name] && <div className="invalid-feedback">{errores[name]}</div>}
    </div>
  );

  return (
    <div className="container my-5" style={{ maxWidth: 720 }}>
      <h1 className="mb-4">Datos del huésped</h1>
      <form onSubmit={enviar} noValidate className="row g-3">
        {campo('nombre', 'Nombre')}
        {campo('apellidos', 'Apellidos')}
        {campo('correo', 'Correo', 'email')}
        {campo('telefono', 'Teléfono (opcional)')}
        <div className="col-12">
          <button type="submit" className="btn btn-success btn-lg w-100">Confirmar reserva</button>
        </div>
      </form>
    </div>
  );
}
