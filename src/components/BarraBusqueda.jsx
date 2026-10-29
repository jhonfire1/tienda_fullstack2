function BarraBusqueda({ texto, onCambiarTexto }) {
  return (
    <input
      type="search"
      className="form-control"
      placeholder="Buscar videojuego..."
      value={texto}
      onChange={(evento) => onCambiarTexto(evento.target.value)}
    />
  );
}

export default BarraBusqueda;
