# 🍦 GustoHelado — Mi Bitácora Personal de Heladerías en CABA

> *"¿A qué heladería ir para minimizar la caminata pero maximizar la calidad, según mi antojo de hoy?"*

**GustoHelado** es mi primer proyecto personal de software. Lo construí para responder una pregunta concreta sobre mi vida cotidiana usando programación, datos y un poco de matemática.

No es un producto ni una startup. Es un ejercicio de curiosidad metodológica: tengo una hipótesis, diseño un sistema para recolectar datos, y dejo que los números me digan la respuesta.

---

## 🔬 La Hipótesis

Cada vez que quiero helado, enfrento el mismo dilema: ¿voy a la más cercana o vale la pena caminar más? Eso depende de qué antojo tengo y de cuán buena es cada heladería *para ese antojo en particular*, según **mi propio paladar** (no el de Google Maps).

El sistema calcula un **Blend Score** en tiempo real:

```text
Score Final = (Puntaje Histórico × 0.7) + (Proximidad × 0.3)
```

- **Puntaje Histórico (70%)**: promedio de mis calificaciones personales para el tipo de helado que quiero hoy.
- **Proximidad (30%)**: qué tan cerca está según mi ubicación actual (GPS o dirección ingresada), usando la fórmula de Haversine.

---

## 🗺️ Arquitectura del Sistema

```
📱 Google Form (celular)
       │
       ▼ Form Submit
📊 Google Sheets  ←──── Catálogo de Heladerías y Categorías
       │
       ▼ Apps Script (trigger automático)
📊 Sheet OCURRENCIAS  ← fila normalizada con IDs + puntajes
       │
       ▼ GitHub Actions (viernes 23:00 UTC o manual)
🐍 Python / Pandas ETL
       │
       ▼
📄 heladerias_prod.json  (JSON estático precalculado)
       │
       ▼
⚛️  React / Vite App  ←── GPS del usuario en tiempo real
       │
       ▼
🎯 Recomendación final ordenada por Score
```

### Por qué esta arquitectura

- **Costo $0**: Google Sheets funciona como base de datos. No hay servidor propio.
- **Sin backend**: el frontend consume un JSON estático. Todo el cálculo de distancias y scoring corre en el navegador.
- **Automatización real**: el pipeline de Python corre en GitHub Actions cada semana y actualiza los datos de producción automáticamente.

---

## 📁 Estructura del Repositorio

```
GUSTOHELADO/
├── src/                          # Frontend React + TypeScript
│   ├── components/
│   │   ├── recommender/          # Recomendador (GPS, slider, mapa)
│   │   └── dataset/              # Vista de datos del Sheets
│   ├── lib/
│   │   ├── scoring.ts            # Algoritmo de Blend Score
│   │   ├── geo.ts                # Haversine + geocodificación
│   │   └── data.ts               # Fetch del JSON según entorno
│   └── types.ts                  # Tipos TypeScript compartidos
│
├── data_pipeline/
│   ├── process_data.py           # ETL: lee Sheets → genera JSON
│   ├── requirements.txt
│   └── mock_sheets/              # CSVs para desarrollo local
│       ├── heladerias.csv
│       ├── categorias.csv
│       └── ocurrencias.csv       # Generado automáticamente (400 visitas simuladas)
│
├── public/data/
│   ├── heladerias_test.json      # Generado por pipeline --mode test
│   └── heladerias_prod.json      # Generado por GitHub Actions --mode prod
│
├── .env.test                     # Apunta a heladerias_test.json
├── .env.production               # Apunta a heladerias_prod.json
└── .github/workflows/pipeline.yml  # CI/CD: ETL + build + deploy
```

---

## 💻 Cómo Correrlo en Local

### Requisitos
- Node.js v18+
- Python 3.10+

### 1. Instalar dependencias del frontend
```bash
npm install
```

### 2. Configurar el entorno Python
```bash
python3 -m venv venv
source venv/bin/activate   # macOS / Linux
# venv\Scripts\activate    # Windows

pip install -r data_pipeline/requirements.txt
```

### 3. Generar los datos
El pipeline lee del Google Sheets real. Necesitás las credenciales configuradas (ver sección de Producción):
```bash
export SPREADSHEET_ID="tu_spreadsheet_id"
export GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

python3 data_pipeline/process_data.py
```
Esto genera `public/data/heladerias_prod.json`.

### 4. Levantar la app
```bash
npm run dev
```
Abre `http://localhost:5173`.

---

## ⚙️ Configuración para Producción

El pipeline en modo `prod` lee los datos reales desde mi Google Sheets usando una **Service Account de Google Cloud** (gratuita, no requiere tarjeta de crédito).

### Paso 1 — Crear la Service Account (una sola vez)

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear un proyecto (o usar uno existente)
3. Habilitar la **Google Sheets API**
4. Ir a *IAM y administración → Cuentas de servicio → Crear cuenta*
5. Descargar el archivo JSON de credenciales
6. Compartir el Google Sheets con el email de la service account (permiso de **Lector**)

### Paso 2 — Configurar los Secrets en GitHub

En *Settings → Secrets and variables → Actions* del repositorio, agregar:

| Secret | Valor |
|--------|-------|
| `SPREADSHEET_ID` | ID del Google Sheets (parte de la URL) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Contenido completo del JSON de credenciales |

### Cómo se dispara el pipeline

- **Automáticamente**: todos los viernes a las 23:00 UTC (cron job)
- **En cada push a `main`**
- **Manualmente**: desde la pestaña *Actions* del repo → *Run workflow*

---

## 📊 Estructura del Google Sheets

El Sheets (`HELADERIAS_BBDD`) tiene 4 pestañas que funcionan como tablas relacionales:

| Pestaña | Propósito | Clave primaria |
|---------|-----------|----------------|
| `HELADERIAS` | Catálogo de locales con coordenadas | `ID` |
| `CATEGORIAS` | Taxonomía de sabores (CHOCOLATE, DDL, CREMA...) | `ID` |
| `OCURRENCIAS` | Registro de cada visita con puntajes | `ID` |
| `CADENAS` | Marcas/franquicias | `ID_CADENA` |

El Google Form inserta en `OCURRENCIAS` a través de un **trigger de Apps Script** que normaliza los nombres del Form en IDs numéricos antes de escribir.

---

## 🤔 Qué aprendí haciendo esto

- Normalización básica de base de datos (tablas relacionales con claves foráneas)
- ETL con Python/Pandas (joins, groupby, exportación a JSON)
- Arquitectura Jamstack: separar datos estáticos de lógica de presentación
- Geolocalización en el browser (Web GPS API + fórmula de Haversine)
- Automatización con GitHub Actions y Google Apps Script
- Cómo conectar sistemas sin un backend propio

---

*Proyecto personal de Sebastian Porini — CABA, Argentina*
