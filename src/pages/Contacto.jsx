import { useState } from 'react';
import { guardarMensaje } from '../data/db';

const vacio = { nombre: '', correo: '', asunto: 'Consulta', mensaje: '' };

export default function Contacto() {
  const [form, setForm] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) e.correo = 'Correo no válido';
    if (form.mensaje.trim().length < 10) e.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    return e;
  };

  const enviar = (ev) => {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    guardarMensaje(form);
    setForm(vacio);
    setEnviado(true);
  };

  return (
    <div className="container my-5">
      <div className="row g-5">
        <div className="col-12 col-md-5">
          <h1>Contacto</h1>
          <p className="text-muted">¿Tienes dudas sobre tu reserva o quieres cotizar para un grupo? Escríbenos.</p>
          <ul className="list-unstyled">
            <li>📍 Providencia, Santiago</li>
            <li>📞 +56 2 2345 6789</li>
            <li>✉ reservas@hotelsol.cl</li>
          </ul>
        </div>
        <div className="col-12 col-md-7">
          {/* Renderizado condicional: después de enviar se muestra el mensaje de éxito */}
          {enviado && <div className="alert alert-success" role="alert">¡Gracias! Te responderemos a la brevedad.</div>}
          <form onSubmit={enviar} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="nombre">Nombre</label>
              <input id="nombre" name="nombre" className={`form-control ${errores.nombre ? 'is-invalid' : ''}`} value={form.nombre} onChange={cambiar} />
              {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="correo">Correo</label>
              <input id="correo" name="correo" type="email" className={`form-control ${errores.correo ? 'is-invalid' : ''}`} value={form.correo} onChange={cambiar} />
              {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="asunto">Asunto</label>
              <select id="asunto" name="asunto" className="form-select" value={form.asunto} onChange={cambiar}>
                <option>Consulta</option>
                <option>Reserva de grupo</option>
                <option>Reclamo</option>
                <option>Otro</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="mensaje">Mensaje</label>
              <textarea id="mensaje" name="mensaje" rows="4" className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`} value={form.mensaje} onChange={cambiar} />
              {errores.mensaje && <div className="invalid-feedback">{errores.mensaje}</div>}
            </div>
            <button type="submit" className="btn btn-success">Enviar mensaje</button>
          </form>
        </div>
      </div>
    </div>
  );
}
