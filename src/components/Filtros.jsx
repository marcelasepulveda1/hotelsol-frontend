// Filtros de búsqueda: controlados desde el componente padre por props.
export default function Filtros({ texto, onTexto, tipo, onTipo, tipos }) {
  return (
    <div className="row g-2 mb-4">
      <div className="col-12 col-md-8">
        <input
          className="form-control"
          placeholder="Buscar habitación..."
          value={texto}
          onChange={(e) => onTexto(e.target.value)}
          aria-label="Buscar"
        />
      </div>
      <div className="col-12 col-md-4">
        <select className="form-select" value={tipo} onChange={(e) => onTipo(e.target.value)} aria-label="Tipo">
          <option value="">Todos los tipos</option>
          {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
    </div>
  );
}
