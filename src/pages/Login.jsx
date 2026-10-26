import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useReserva } from '../context/ReservaContext';
import { iniciarSesion } from '../data/db';

export default function Login() {
  const { setUsuario } = useReserva();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const enviar = (ev) => {
    ev.preventDefault();
    if (!correo.trim() || !clave.trim()) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    const resultado = iniciarSesion(correo, clave);
    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }
    setUsuario(resultado.usuario);
    // El administrador va al panel; el cliente vuelve al inicio
    navigate(resultado.usuario.rol === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="container my-5" style={{ maxWidth: 480 }}>
      <h1 className="mb-4">Iniciar sesión</h1>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={enviar} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="correo">Correo</label>
          <input id="correo" type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="clave">Contraseña</label>
          <input id="clave" type="password" className="form-control" value={clave} onChange={(e) => setClave(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-success w-100">Ingresar</button>
      </form>
      <p className="mt-3 text-center">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </div>
  );
}
