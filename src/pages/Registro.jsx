import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useReserva } from '../context/ReservaContext';
import { registrarUsuario } from '../data/db';

const vacio = { nombre: '', correo: '', clave: '', confirmar: '' };

export default function Registro() {
  const { setUsuario } = useReserva();
  const navigate = useNavigate();
  const [form, setForm] = useState(vacio);
  const [errores, setErrores] = useState({});

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) e.correo = 'Correo no válido';
    if (form.clave.length < 6) e.clave = 'La contraseña debe tener al menos 6 caracteres';
    if (form.clave !== form.confirmar) e.confirmar = 'Las contraseñas no coinciden';
    return e;
  };

  const enviar = (ev) => {
    ev.preventDefault();
    const e = validar();
    if (Object.keys(e).length === 0) {
      const resultado = registrarUsuario({ nombre: form.nombre, correo: form.correo, clave: form.clave });
      if (resultado.ok) {
        setUsuario(resultado.usuario);
        navigate('/');
        return;
      }
      e.correo = resultado.mensaje; // correo repetido
    }
    setErrores(e);
  };

  const campo = (name, label, type = 'text') => (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className={`form-control ${errores[name] ? 'is-invalid' : ''}`} value={form[name]} onChange={cambiar} />
      {errores[name] && <div className="invalid-feedback">{errores[name]}</div>}
    </div>
  );

  return (
    <div className="container my-5" style={{ maxWidth: 480 }}>
      <h1 className="mb-4">Crear cuenta</h1>
      <form onSubmit={enviar} noValidate>
        {campo('nombre', 'Nombre completo')}
        {campo('correo', 'Correo', 'email')}
        {campo('clave', 'Contraseña', 'password')}
        {campo('confirmar', 'Confirmar contraseña', 'password')}
        <button type="submit" className="btn btn-success w-100">Registrarme</button>
      </form>
      <p className="mt-3 text-center">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
