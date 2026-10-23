// Botón reutilizable: recibe la etiqueta, la función onClick y el estilo por props.
export default function Boton({ etiqueta, onClick, variante = 'primary', tipo = 'button', deshabilitado = false }) {
  return (
    <button type={tipo} className={`btn btn-${variante}`} onClick={onClick} disabled={deshabilitado}>
      {etiqueta}
    </button>
  );
}
