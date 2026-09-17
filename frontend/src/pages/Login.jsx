import { useState } from "react";
import { obtenerIndicadores } from "../services/api";

export default function Login({ onResultado }) {
  const [cc, setCc]             = useState("");
  const [error, setError]       = useState("");
  const [cargando, setCargando] = useState(false);

  const buscar = async (e) => {
    e.preventDefault();
    setError("");

    if (!cc.trim()) {
      setError("Ingresa tu número de cédula.");
      return;
    }

    setCargando(true);
    try {
      const datos = await obtenerIndicadores(cc.trim());
      onResultado(datos);
    } catch (err) {
      setError(err.message || "No se pudo consultar. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estilos.fondo}>
      <div style={estilos.card}>

        {/* Header */}
        <div style={estilos.header}>
          <div style={estilos.icono}>📊</div>
          <h1 style={estilos.titulo}>Indicadores Técnicos</h1>
          <p style={estilos.subtitulo}>
            Ingresa tu cédula para consultar tus indicadores del mes
          </p>
        </div>

        {/* Formulario */}
        <div style={estilos.body}>
          {error && <div style={estilos.alerta}>⚠️ {error}</div>}

          <form onSubmit={buscar}>
            <label style={estilos.label}>Número de Cédula</label>
            <input
              type        = "text"
              value       = {cc}
              onChange    = {(e) => setCc(e.target.value)}
              placeholder = "Ej: 1234567890"
              maxLength   = {20}
              autoFocus
              disabled    = {cargando}
              style       = {estilos.input}
            />

            <button
              type     = "submit"
              disabled = {cargando}
              style    = {{
                ...estilos.boton,
                opacity: cargando ? .7 : 1,
                cursor:  cargando ? "not-allowed" : "pointer",
              }}
            >
              {cargando
                ? "Consultando..."
                : "Ver mis indicadores →"}
            </button>
          </form>
        </div>

        <div style={estilos.footer}>
          Solo lectura — tus datos no se modifican
        </div>
      </div>
    </div>
  );
}

const estilos = {
  fondo: {
    minHeight:      "100vh",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    background:     "#f4f6f4",
    padding:        "1.5rem",
    fontFamily:     "sans-serif",
  },
  card: {
    background:   "#fff",
    borderRadius: "20px",
    boxShadow:    "0 8px 40px rgba(69,93,96,.15)",
    width:        "100%",
    maxWidth:     "420px",
    overflow:     "hidden",
  },
  header: {
    background:  "linear-gradient(135deg, #455D60, #017778)",
    padding:     "2.5rem 2rem 2rem",
    textAlign:   "center",
  },
  icono: {
    fontSize:      "2.5rem",
    display:       "block",
    marginBottom:  ".75rem",
  },
  titulo: {
    fontWeight: 800,
    fontSize:   "1.5rem",
    color:      "#fff",
    margin:     "0 0 .4rem",
  },
  subtitulo: {
    color:    "rgba(255,255,255,.7)",
    fontSize: ".88rem",
    margin:   0,
  },
  body: {
    padding: "2rem",
  },
  alerta: {
    background:   "#fff8e1",
    border:       "1px solid #ffe082",
    borderLeft:   "4px solid #BBD032",
    borderRadius: "10px",
    padding:      ".75rem 1rem",
    fontSize:     ".88rem",
    color:        "#5d4e00",
    marginBottom: "1.25rem",
  },
  label: {
    display:      "block",
    fontWeight:   600,
    fontSize:     ".88rem",
    color:        "#455D60",
    marginBottom: ".5rem",
  },
  input: {
    width:        "100%",
    border:       "1.5px solid #d6ddd6",
    borderRadius: "10px",
    padding:      ".7rem 1rem",
    fontSize:     "1rem",
    outline:      "none",
    boxSizing:    "border-box",
    fontFamily:   "sans-serif",
    marginBottom: "1.25rem",
    transition:   "border-color .2s",
  },
  boton: {
    width:        "100%",
    background:   "linear-gradient(135deg, #455D60, #017778)",
    color:        "#fff",
    border:       "none",
    borderRadius: "10px",
    padding:      ".8rem",
    fontWeight:   700,
    fontSize:     ".97rem",
    boxShadow:    "0 4px 16px rgba(1,119,120,.30)",
    fontFamily:   "sans-serif",
    transition:   "opacity .15s",
  },
  footer: {
    textAlign:  "center",
    padding:    "1rem 2rem 1.5rem",
    fontSize:   ".78rem",
    color:      "#99aabb",
  },
};