const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

/**
 * Consulta los indicadores del técnico por cédula.
 * @param {string} cc - Número de cédula
 * @returns {Promise<IndicadoresResponse>}
 */
export const obtenerIndicadores = async (cc) => {
  const response = await fetch(`${API_URL}/indicadores`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ cc: cc.trim() }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Error al consultar los indicadores.");
  }

  return response.json();
};

/** Nombres de los meses en español */
export const nombreMes = (numero) => [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
][numero - 1] || "";