from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional
from datetime import date , timedelta
import os
from dotenv import load_dotenv
from database import get_db

load_dotenv()

ENTORNO = os.getenv("ENTORNO", "desarrollo")

app = FastAPI(
    title       = "Indicadores Técnicos API",
    version     = "1.0.0",
    docs_url    = "/docs"  if ENTORNO == "desarrollo" else None,
    redoc_url   = "/redoc" if ENTORNO == "desarrollo" else None,
    openapi_url = "/openapi.json" if ENTORNO == "desarrollo" else None,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins     = origins,
    allow_credentials = True,
    allow_methods     = ["GET", "POST"],
    allow_headers     = ["*"],
)
# ── SCHEMAS ───────────────────────────────────────────────────────────────────
class BuscarRequest(BaseModel):
    cc: str
class IndicadoresResponse(BaseModel):
    cc:                    str
    nombre:                str
    cargo:                 Optional[str]
    area:                  Optional[str]
    mes:                   int
    anio:                  int

    # G&R
    total_instalaciones:   Optional[int]
    total_garantias:       Optional[int]
    porcentaje_garantia:   Optional[float]

    total_reparaciones:    Optional[int]
    total_reiterativos:    Optional[int]
    porcentaje_reiterativo: Optional[float]
    # NPS
    conteo_promotores:     Optional[int]
    conteo_neutros:        Optional[int]
    conteo_detractores:    Optional[int]
    total_encuestas:       Optional[int]
    porcentaje_nps:        Optional[float]
# ── HEALTH CHECK ──────────────────────────────────────────────────────────────
@app.get("/")
def health():
    return {"status": "ok"}
# ── ENDPOINT PRINCIPAL ────────────────────────────────────────────────────────
@app.post("/indicadores", response_model=IndicadoresResponse)
def obtener_indicadores(datos: BuscarRequest, db: Session = Depends(get_db)):
    """
    Recibe la cédula del técnico y retorna sus indicadores del mes actual.
    Consulta directamente las tablas base filtrando por mes y año en curso.
    """
    cc = datos.cc.strip()
    if not cc:
        raise HTTPException(status_code=400, detail="La cédula no puede estar vacía.")
    hoy  = date.today()
    mes  = hoy.month
    anio = hoy.year
    # ── 1. Verifica que el técnico existe en conformacion ─────────────────────
    tecnico = db.execute(
        text("""
            SELECT cedula, nombre, cargo, proceso
            FROM tb_conformacion
            WHERE TRIM(cedula)::TEXT = TRIM(:cc)::TEXT
              AND activo = 'SI'
            LIMIT 1
        """),
        {"cc": cc}
    ).fetchone()
    if not tecnico:
        raise HTTPException(
            status_code = 404,
            detail      = "Cédula no encontrada. Verifica el número e intenta de nuevo."
        )
    # ── 2. Indicadores G&R del mes actual ────────────────────────────────────
    gr = db.execute(
        text("""
            SELECT
                SUM(total_clientes_instalados)          AS total_instalaciones,
                SUM(g_real)                    AS total_garantias,
                SUM(total_clientes_daños_finalizados)           AS total_reparaciones,
                SUM(r_real)                 AS total_reiterativos,
                -- %G
                CASE
                    WHEN SUM(total_clientes_instalados) IS NULL
                      OR SUM(total_clientes_instalados) = 0 THEN 0
                    ELSE ROUND(
                        SUM(g_real)::NUMERIC
                        / SUM(total_clientes_instalados) * 100, 2)
                END AS porcentaje_garantia,
                -- %R
                CASE
                    WHEN SUM(total_clientes_daños_finalizados) IS NULL
                      OR SUM(total_clientes_daños_finalizados) = 0 THEN 0
                    ELSE ROUND(
                        SUM(r_real)::NUMERIC
                        / SUM(total_clientes_daños_finalizados) * 100, 2)
                END AS porcentaje_reiterativo
            FROM tb_garantias_reiterativos
            WHERE TRIM(cod_funcionario)::TEXT   = TRIM(:cc)::TEXT
              AND EXTRACT(MONTH FROM fecha) = :mes
              AND EXTRACT(YEAR  FROM fecha) = :anio
        """),
        {"cc": cc, "mes": mes, "anio": anio}
    ).fetchone()
    # ── 3. Indicadores NPS del mes actual ─────────────────────────────────────
    nps = db.execute(
        text("""
            SELECT
                COUNT(CASE WHEN nps = 'Promotores'  THEN 1 END) AS conteo_promotores,
                COUNT(CASE WHEN nps = 'Neutros'     THEN 1 END) AS conteo_neutros,
                COUNT(CASE WHEN nps = 'Detractores' THEN 1 END) AS conteo_detractores,
                COUNT(CASE WHEN nps IN ('Promotores','Neutros','Detractores')
                           THEN 1 END)                           AS total_encuestas,
                -- %NPS
                CASE
                    WHEN COUNT(CASE WHEN nps IN ('Promotores','Neutros','Detractores')
                                    THEN 1 END) = 0 THEN NULL
                    ELSE ROUND(
                        (
                            COUNT(CASE WHEN nps = 'Promotores'  THEN 1 END)
                            -
                            COUNT(CASE WHEN nps = 'Detractores' THEN 1 END)
                        )::NUMERIC
                        / COUNT(CASE WHEN nps IN ('Promotores','Neutros','Detractores')
                                     THEN 1 END) * 100,
                    1)
                END AS porcentaje_nps
            FROM tb_nps
            WHERE TRIM(cod_funcionario)::TEXT  = TRIM(:cc)::TEXT
              AND EXTRACT(MONTH FROM fecha_respuesta) = :mes
              AND EXTRACT(YEAR  FROM fecha_respuesta) = :anio
        """),
        {"cc": cc, "mes": mes, "anio": anio}
    ).fetchone()

    return IndicadoresResponse(
        cc     = tecnico.cedula,
        nombre = tecnico.nombre,
        cargo  = tecnico.cargo,
        area   = tecnico.proceso,
        mes    = mes,
        anio   = anio,

        total_instalaciones    = gr.total_instalaciones,
        total_garantias        = gr.total_garantias,
        porcentaje_garantia    = gr.porcentaje_garantia,
        total_reparaciones     = gr.total_reparaciones,
        total_reiterativos     = gr.total_reiterativos,
        porcentaje_reiterativo = gr.porcentaje_reiterativo,

        conteo_promotores  = nps.conteo_promotores,
        conteo_neutros     = nps.conteo_neutros,
        conteo_detractores = nps.conteo_detractores,
        total_encuestas    = nps.total_encuestas,
        porcentaje_nps     = nps.porcentaje_nps,
    )