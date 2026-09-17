# 📊 Indicadores Técnicos — App de KPIs

Aplicación web para consulta de indicadores de desempeño por técnico.  
El técnico ingresa su número de cédula y visualiza sus KPIs del mes actual: **% Garantías**, **% Reiterativos** y **% NPS**.

---

## 🏗️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.11+ · FastAPI · SQLAlchemy |
| Base de datos | PostgreSQL (nube) |
| Frontend | React 18 · Vite |
| Comunicación | REST API · JSON |

---

## 📁 Estructura del proyecto

```
Indicadores_App/
│
├── backend/
│   ├── main.py          ← Endpoints FastAPI (login + indicadores)
│   ├── database.py      ← Conexión a PostgreSQL
│   ├── requirements.txt ← Dependencias Python
│   ├── .env             ← Variables de entorno (NO subir a Git)
│   └── .env.example     ← Plantilla de referencia
│
└── frontend/
    ├── src/
    │   ├── App.jsx                   ← Enrutador Login ↔ Dashboard
    │   ├── main.jsx                  ← Punto de entrada Vite
    │   ├── pages/
    │   │   ├── Login.jsx             ← Formulario de cédula
    │   │   └── Dashboard.jsx         ← Vista de indicadores
    │   ├── components/
    │   │   └── TarjetaIndicador.jsx  ← Tarjeta visual por KPI
    │   └── services/
    │       └── api.js                ← Llamadas al backend
    ├── .env                          ← URL del backend
    ├── .env.example                  ← Plantilla de referencia
    └── package.json
```

---

## ⚙️ Requisitos previos

Asegúrate de tener instalado:

- **Python 3.11+** → `python --version`
- **Node.js 18+** → `node --version`
- **npm 9+** → `npm --version`
- Acceso a la base de datos **PostgreSQL en la nube**

---

## 🚀 Instalación y ejecución local

### 1. Clonar o descargar el proyecto

```bash
# Ubícate en la carpeta del proyecto
cd Indicadores_App
```

---

### 2. Configurar el backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo de variables de entorno
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac
```

Edita el archivo `.env` con tus datos reales:

```env
DATABASE_URL=postgresql://usuario:contrasena@host:5432/nombre_bd
ALLOWED_ORIGINS=http://localhost:5173
ENTORNO=desarrollo
```

```bash
# Arrancar el backend en el puerto 8001
uvicorn main:app --reload --port 8001
```

✅ Verifica en el navegador: `http://localhost:8001/docs`

---

### 3. Configurar el frontend

```bash
cd ../frontend

# Instalar dependencias de Node
npm install

# Crear archivo de variables de entorno
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac
```

El `.env` del frontend debe quedar así:

```env
VITE_API_URL=http://localhost:8001
```

```bash
# Arrancar el frontend
npm run dev
```

✅ Verifica en el navegador: `http://localhost:5173`

---

## 🔌 Endpoints del backend

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Health check — verifica que la API esté activa |
| `POST` | `/indicadores` | Recibe la cédula y retorna los KPIs del mes actual |
| `GET` | `/docs` | Documentación interactiva (solo en entorno desarrollo) |

### Ejemplo de petición a `/indicadores`

**Request:**
```json
POST /indicadores
Content-Type: application/json

{
  "cc": "1234567890"
}
```

**Response exitoso:**
```json
{
  "cc": "1234567890",
  "nombre": "Juan García",
  "cargo": "Técnico HFC",
  "area": "Cundinamarca Norte",
  "mes": 6,
  "anio": 2026,
  "total_instalaciones": 500,
  "total_garantias": 20,
  "porcentaje_garantia": 4.0,
  "total_reparaciones": 300,
  "total_reiterativos": 15,
  "porcentaje_reiterativo": 5.0,
  "conteo_promotores": 8,
  "conteo_neutros": 2,
  "conteo_detractores": 1,
  "total_encuestas": 11,
  "porcentaje_nps": 63.6
}
```

**Response error (cédula no encontrada):**
```json
{
  "detail": "Cédula no encontrada. Verifica el número e intenta de nuevo."
}
```

---

## 📐 Indicadores y fórmulas

### % Garantías (%G)
```
%G = SUM(garantias) / SUM(total_instalaciones) × 100
Meta: ≤ 5%
```

### % Reiterativos (%R)
```
%R = SUM(reiterativos) / SUM(total_reparaciones) × 100
Meta: ≤ 10%
```

### % NPS
```
%NPS = (Promotores - Detractores) / (Promotores + Neutros + Detractores) × 100
Meta: ≥ 70%

Categorías en la columna `nps`:
  - 'Promotores'  → clientes satisfechos
  - 'Neutros'     → clientes pasivos
  - 'Detractores' → clientes insatisfechos
```

### Semáforo de colores

| Color | %G y %R (menor es mejor) | %NPS (mayor es mejor) |
|-------|--------------------------|----------------------|
| 🟢 Verde | Muy por debajo de la meta | ≥ meta |
| 🟡 Amarillo | Cerca de la meta | Cerca de la meta |
| 🔴 Rojo | Supera la meta | Lejos de la meta |

---

## 🗄️ Tablas de la base de datos

### `tb_conformacion` — Personal técnico

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `cedula` | VARCHAR | Cédula del técnico — campo de login |
| `nombre` | VARCHAR | Nombre completo |
| `cargo` | VARCHAR | Cargo en la empresa |
| `proceso` | VARCHAR | Área o proceso al que pertenece |
| `activo` | VARCHAR | `'Si'` = activo · `'No'` = inactivo |

### `tb_garantias_reiterativos` — Datos G&R

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `cod_funcionario` | VARCHAR | Cédula del técnico |
| `total_clientes_instalados` | INTEGER | Total instalaciones realizadas |
| `total_daños_garantias` | INTEGER | Garantías generadas |
| `total_clientes_daños_finalizados` | INTEGER | Total reparaciones finalizadas |
| `total_daños_reiterativos` | INTEGER | Reiterativos generados |
| `fecha` | DATE | Fecha del registro |

### `nps` — Encuestas de satisfacción

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `cc` | VARCHAR | Cédula del técnico |
| `nps` | VARCHAR | `'Promotores'`, `'Neutros'` o `'Detractores'` |
| `fecha` | DATE | Fecha de la encuesta |

---

## 🔒 Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `ALLOWED_ORIGINS` | URLs del frontend permitidas por CORS | `http://localhost:5173` |
| `ENTORNO` | `desarrollo` activa `/docs` · `produccion` lo desactiva | `desarrollo` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del backend FastAPI | `http://localhost:8001` |

---

## 🐛 Errores comunes

### `InvalidRequestError: A value is required for bind parameter`
El nombre del parámetro en el SQL (`:nombre`) no coincide con la clave del diccionario Python (`{"nombre": valor}`). Verifica que sean idénticos.

### `UndefinedColumn: no existe la columna`
El nombre de la columna en el SQL no existe en la tabla. Consulta los nombres reales con:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'nombre_tabla';
```

### Error CORS al llamar desde React
Verifica que `ALLOWED_ORIGINS` en el `.env` del backend incluya la URL exacta del frontend:
```env
ALLOWED_ORIGINS=http://localhost:5173
```

### `npm run dev` no carga los datos
Verifica que `VITE_API_URL` en `frontend/.env` apunte al puerto correcto del backend:
```env
VITE_API_URL=http://localhost:8001
```

---

## 🔗 Integración con BuscadorGYR

Esta app está integrada con el **BuscadorGYR** (app Flask). El portal de técnicos del BuscadorGYR tiene un botón **"Ver mis Indicadores"** que abre esta aplicación en una nueva pestaña.

Para que el botón funcione, agrega en el `.env` del BuscadorGYR:
```env
INDICADORES_URL=http://localhost:5173
```

---

## 📦 Construcción para producción

```bash
# Construye los archivos estáticos de React
cd frontend
npm run build
# Genera la carpeta dist/ con HTML/CSS/JS optimizados

# Sirve los archivos en producción
npx serve dist --port 5173
```

Actualiza el `.env` del BuscadorGYR con la URL del servidor real:
```env
INDICADORES_URL=http://tu-servidor.com:5173
```

---

## 👤 Autor

Desarrollado para **Energía Integral EIA**  
Área de Analítica de Datos — 2026
