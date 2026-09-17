import TarjetaIndicador from "../components/TarjetaIndicador";
import { nombreMes }    from "../services/api";

export default function Dashboard({ datos, onVolver }) {
  const mes = `${nombreMes(datos.mes)} ${datos.anio}`;

  return (
    <div style={estilos.fondo}>

      {/* NAVBAR */}
      <nav style={estilos.navbar}>
        <div style={estilos.navContenido}>
          <span style={estilos.navBrand}>📊 Indicadores Técnicos</span>
          <button onClick={onVolver} style={estilos.btnVolver}>
            ← Nueva consulta
          </button>
        </div>
      </nav>

      <main style={estilos.main}>
        <div style={estilos.contenedor}>

          {/* PERFIL DEL TÉCNICO */}
          <div style={estilos.perfil}>
            <div style={estilos.avatar}>
              {datos.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={estilos.nombre}>{datos.nombre}</h2>
              <div style={estilos.perfilMeta}>
                <span style={estilos.chip}>
                  CC: {datos.cc}
                </span>
                {datos.cargo && (
                  <span style={estilos.chip}>{datos.cargo}</span>
                )}
                {datos.area && (
                  <span style={estilos.chip}>{datos.area}</span>
                )}
                <span style={{ ...estilos.chip, background: "#017778", color: "#fff" }}>
                  📅 {mes}
                </span>
              </div>
            </div>
          </div>

          {/* GRID DE INDICADORES */}
          <div style={estilos.seccion}>
            <h3 style={estilos.seccionTitulo}>
              <span style={estilos.lineaDecorativa}/>
              Garantías y Reiterativos
            </h3>
            <div style={estilos.grid}>

              <TarjetaIndicador
                titulo    = "% Garantías"
                valor     = {datos.porcentaje_garantia}
                unidad    = "%"
                meta      = {3}
                meta_tipo = "menor_es_mejor"
                detalle   = {{
                  "Instalaciones": datos.total_instalaciones,
                  "Garantías":     datos.total_garantias,
                }}
              />

              <TarjetaIndicador
                titulo    = "% Reiterativos"
                valor     = {datos.porcentaje_reiterativo}
                unidad    = "%"
                meta      = {5}
                meta_tipo = "menor_es_mejor"
                detalle   = {{
                  "Reparaciones":  datos.total_reparaciones,
                  "Reiterativos":  datos.total_reiterativos,
                }}
              />

            </div>
          </div>

          <div style={estilos.seccion}>
            <h3 style={estilos.seccionTitulo}>
              <span style={estilos.lineaDecorativa}/>
              NPS — Satisfacción del Cliente
            </h3>
            <div style={estilos.grid}>

              <TarjetaIndicador
                titulo    = "% NPS"
                valor     = {datos.porcentaje_nps}
                unidad    = "%"
                meta      = {65}
                meta_tipo = "mayor_es_mejor"
                detalle   = {{
                  "Promotores":  datos.conteo_promotores,
                  "Neutros":     datos.conteo_neutros,
                  "Detractores": datos.conteo_detractores,
                  "Total":       datos.total_encuestas,
                }}
              />

            </div>
          </div>

        </div>
      </main>

      <footer style={estilos.footer}>
        Indicadores del mes de {mes} — Los datos se actualizan automáticamente
      </footer>
    </div>
  );
}

const estilos = {
  fondo: {
    minHeight:  "100vh",
    background: "#f4f6f4",
    fontFamily: "sans-serif",
    display:    "flex",
    flexDirection: "column",
  },
  navbar: {
    background: "#455D60",
    padding:    ".9rem 1.5rem",
    boxShadow:  "0 2px 12px rgba(46,62,64,.25)",
  },
  navContenido: {
    maxWidth:       "1000px",
    margin:         "0 auto",
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
  },
  navBrand: {
    fontWeight: 800,
    fontSize:   "1.15rem",
    color:      "#BBD032",
  },
  btnVolver: {
    background:   "transparent",
    border:       "1px solid rgba(255,255,255,.3)",
    color:        "rgba(255,255,255,.8)",
    borderRadius: "8px",
    padding:      ".4rem 1rem",
    cursor:       "pointer",
    fontSize:     ".85rem",
    fontFamily:   "sans-serif",
    transition:   "all .2s",
  },
  main: {
    flex:    1,
    padding: "2.5rem 1rem 3rem",
  },
  contenedor: {
    maxWidth: "1000px",
    margin:   "0 auto",
  },

  /* Perfil */
  perfil: {
    display:       "flex",
    alignItems:    "center",
    gap:           "1.25rem",
    background:    "#fff",
    border:        "1px solid #d6ddd6",
    borderRadius:  "16px",
    padding:       "1.5rem 2rem",
    marginBottom:  "2rem",
    boxShadow:     "0 4px 20px rgba(69,93,96,.08)",
    flexWrap:      "wrap",
  },
  avatar: {
    width:          "56px",
    height:         "56px",
    borderRadius:   "50%",
    background:     "linear-gradient(135deg, #455D60, #017778)",
    color:          "#BBD032",
    fontWeight:     800,
    fontSize:       "1.6rem",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
  },
  nombre: {
    fontWeight:   800,
    fontSize:     "1.35rem",
    color:        "#455D60",
    margin:       "0 0 .5rem",
  },
  perfilMeta: {
    display:  "flex",
    gap:      ".5rem",
    flexWrap: "wrap",
  },
  chip: {
    background:   "#f4f6f4",
    border:       "1px solid #d6ddd6",
    borderRadius: "20px",
    padding:      ".25rem .75rem",
    fontSize:     ".78rem",
    fontWeight:   600,
    color:        "#455D60",
  },

  /* Secciones */
  seccion: {
    marginBottom: "2rem",
  },
  seccionTitulo: {
    display:      "flex",
    alignItems:   "center",
    gap:          ".75rem",
    fontWeight:   700,
    fontSize:     ".9rem",
    textTransform: "uppercase",
    letterSpacing: ".08em",
    color:        "#455D60",
    margin:       "0 0 1.25rem",
  },
  lineaDecorativa: {
    display:    "inline-block",
    width:      "4px",
    height:     "18px",
    background: "#BBD032",
    borderRadius: "2px",
  },

  /* Grid */
  grid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap:                 "1.25rem",
  },

  footer: {
    textAlign:  "center",
    padding:    "1.2rem",
    fontSize:   ".78rem",
    color:      "#6b8082",
    borderTop:  "1px solid #d6ddd6",
  },
};