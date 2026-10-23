import { useState } from 'react';
import { listarHabitaciones, crearHabitacion, actualizarHabitacion, eliminarHabitacion } from '../../data/db';
import { formatoCLP } from '../../utils';
import Boton from '../../components/Boton';

const vacia = { codigo: '', tipo: '', descripcion: '', capacidad: 1, precio: 0, estado: 'Disponible', oferta: false };
const ESTADOS = ['Disponible', 'Mantención', 'Fuera de servicio'];

// CRUD de habitaciones conectado a la base de datos simulada (localStorage).
export default function AdminHabitaciones() {
  const [habitaciones, setHabitaciones] = useState(listarHabitaciones());
  const [form, setForm] = useState(vacia);
  const [editando, setEditando] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const refrescar = () => setHabitaciones(listarHabitaciones());

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value });
  };

  const guardar = (e) => {
    e.preventDefault();
    if (!form.codigo || !form.tipo || form.precio <= 0) {
      setMensaje('Completa código, tipo y un precio mayor a 0.');
      return;
    }
    try {
      if (editando) actualizarHabitacion(editando, form);
      else crearHabitacion(form);
      setMensaje(editando ? 'Habitación actualizada.' : 'Habitación creada.');
      setForm(vacia);
      setEditando(null);
      refrescar();
    } catch (err) {
      setMensaje(err.message);
    }
  };

  const editar = (h) => {
    setForm(h);
    setEditando(h.codigo);
  };

  const borrar = (codigo) => {
    eliminarHabitacion(codigo);
    refrescar();
    setMensaje('Habitación eliminada.');
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Gestión de habitaciones</h1>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <form onSubmit={guardar} className="row g-2 mb-4">
        <div className="col-6 col-md-2"><input className="form-control" name="codigo" placeholder="Código" value={form.codigo} onChange={cambiar} disabled={!!editando} aria-label="Código" /></div>
        <div className="col-6 col-md-2"><input className="form-control" name="tipo" placeholder="Tipo" value={form.tipo} onChange={cambiar} aria-label="Tipo" /></div>
        <div className="col-12 col-md-3"><input className="form-control" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={cambiar} aria-label="Descripción" /></div>
        <div className="col-4 col-md-1"><input className="form-control" type="number" name="capacidad" value={form.capacidad} onChange={cambiar} aria-label="Capacidad" /></div>
        <div className="col-8 col-md-2"><input className="form-control" type="number" name="precio" value={form.precio} onChange={cambiar} aria-label="Precio" /></div>
        <div className="col-8 col-md-2">
          <select className="form-select" name="estado" value={form.estado} onChange={cambiar} aria-label="Estado">
            {ESTADOS.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div className="col-4 col-md-2 form-check ms-2">
          <input className="form-check-input" type="checkbox" id="oferta" name="oferta" checked={form.oferta} onChange={cambiar} />
          <label className="form-check-label" htmlFor="oferta">Oferta</label>
        </div>
        <div className="col-12 col-md-3">
          <button type="submit" className="btn btn-success w-100">{editando ? 'Guardar cambios' : 'Crear habitación'}</button>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr><th>Código</th><th>Tipo</th><th>Capacidad</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {habitaciones.map((h) => (
              <tr key={h.codigo}>
                <td>{h.codigo}</td><td>{h.tipo}</td><td>{h.capacidad}</td><td>{formatoCLP(h.precio)}</td><td>{h.estado}</td>
                <td className="d-flex gap-1">
                  <Boton etiqueta="Editar" variante="outline-primary" onClick={() => editar(h)} />
                  <Boton etiqueta="Eliminar" variante="outline-danger" onClick={() => borrar(h.codigo)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
