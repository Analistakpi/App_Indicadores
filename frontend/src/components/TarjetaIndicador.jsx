/**
 * Tarjeta visual para un indicador.
 * meta_tipo: "menor_es_mejor" | "mayor_es_mejor"
 */
export default function TarjetaIndicador({ titulo, valor, unidad, meta, meta_tipo = "menor_es_mejor", detalle }) {

  const sinDatos = valor === null || valor === undefined;

  // Color según cumplimiento de la meta
  const obtenerColor = () => {
    if (sinDatos) return "#6b8082";
    if (meta_tipo === "menor_es_mejor") {
      if (valor <= meta * 0.7)  return "#2e7d32"; // muy bien — verde
      if (valor <= meta)        return "#BBD032"; // dentro de meta — verde EIA
      return "#c62828";                            // fuera de meta — rojo
    } else {
      if (valor >= meta)        return "#2e7d32"; // cumple — verde
      if (valor >= meta * 0.85) return "#BBD032"; // cerca — verde EIA
      return "#c62828";                            // lejos — rojo
    }
  };

  const color = obtenerColor();
  const porcentajeBarra = meta
    ? meta_tipo === "menor_es_mejor"
      ? Math.min((meta / Math.max(valor, 0.01)) * 100, 100)
      : Math.min((valor / meta) * 100, 100)
    : 0;

  return (
    <div style={estilos.card}>
      <div style={{ ...estilos.barraSuperior, background: color }} />
      <div style={estilos.cuerpo}>

        <p style={estilos.titulo}>{titulo}</p>

        {sinDatos ? (
          <p style={estilos.sinDatos}>Sin datos este mes</p>
        ) : (
          <>
            <p style={{ ...estilos.valor, color }}>
              {valor}{unidad}
            </p>

            {/* Barra de progreso */}
            {meta && (
              <div style={estilos.barraContenedor}>
                <div style={{
                  ...estilos.barraRelleno,
                  width:      `${porcentajeBarra}%`,
                  background: color,
                }}/>
              </div>
            )}

            {/* Meta */}
            {meta && (
              <p style={estilos.metaTxt}>
                Meta: {meta_tipo === "menor_es_mejor" ? "≤" : "≥"} {meta}{unidad}
              </p>
            )}

            {/* Detalle */}
            {detalle && (
              <div style={estilos.detalle}>
                {Object.entries(detalle).map(([k, v]) => (
                  <div key={k} style={estilos.detalleItem}>
                    <span style={estilos.detalleLabel}>{k}</span>
                    <span style={estilos.detalleValor}>{v ?? "—"}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
const estilos = {
  card: {
    background:   "#fff",
    border:       "1px solid #d6ddd6",
    borderRadius: "16px",
    boxShadow:    "0 4px 20px rgba(69,93,96,.10)",
    overflow:     "hidden",
    fontFamily:   "sans-serif",
  },
  barraSuperior: {
    height: "5px",
  },
  cuerpo: {
    padding: "1.4rem 1.5rem",
  },
  titulo: {
    fontWeight:    700,
    fontSize:      ".8rem",
    textTransform: "uppercase",
    letterSpacing: ".08em",
    color:         "#455D60",
    margin:        "0 0 .6rem",
  },
  valor: {
    fontWeight: 800,
    fontSize:   "2.4rem",
    margin:     "0 0 .75rem",
    lineHeight: 1,
  },
  sinDatos: {
    color:      "#99aabb",
    fontSize:   ".88rem",
    fontStyle:  "italic",
    margin:     ".5rem 0",
  },
  barraContenedor: {
    background:   "#f4f6f4",
    borderRadius: "999px",
    height:       "8px",
    overflow:     "hidden",
    marginBottom: ".6rem",
  },
  barraRelleno: {
    height:       "100%",
    borderRadius: "999px",
    transition:   "width .6s ease",
  },
  metaTxt: {
    fontSize: ".78rem",
    color:    "#6b8082",
    margin:   "0 0 .75rem",
  },
  detalle: {
    borderTop:  "1px solid #f0f3f0",
    paddingTop: ".75rem",
    marginTop:  ".25rem",
  },
  detalleItem: {
    display:        "flex",
    justifyContent: "space-between",
    fontSize:       ".78rem",
    color:          "#6b8082",
    padding:        ".2rem 0",
  },
  detalleLabel: { fontWeight: 500 },
  detalleValor: { fontWeight: 600, color: "#455D60" },
};