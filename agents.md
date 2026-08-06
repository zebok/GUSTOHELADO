# Guía para Agentes de IA — Helado Finder CABA

Esta guía está diseñada para que cualquier agente de IA (Claude, Cursor, Copilot, etc.) entienda de inmediato la arquitectura del repositorio y cómo interactuar con el código sin romper el diseño.

## Arquitectura Jamstack y Datos Estáticos

El proyecto no tiene base de datos activa ni servidores en ejecución para simplificar costos y optimizar la performance:
1. **Pipeline de Datos (Python/Pandas)**: Toma las bitácoras del usuario (en Google Sheets en producción o CSV locales en desarrollo) y genera el archivo JSON consolidador.
2. **Frontend Estático (React/TypeScript/Vite)**: Lee el archivo JSON correspondiente a las variables de entorno inyectadas y realiza todo el cálculo reactivo (GPS, Haversine, Slider de distancias y scoring dinámico) en el navegador.

---

## Aislamiento de Entornos (Dev/Prod Isolation)

La aplicación implementa un estricto aislamiento entre la fase de desarrollo/pruebas y producción:

### 1. Variables de Entorno en el Frontend
* **Modo Test** (`npm run dev:test`): Vite inyecta variables desde `.env.test`.
  * `VITE_DATA_SOURCE=/data/heladerias_test.json` (Generado por el pipeline local con 400 visitas simuladas).
* **Modo Producción** (`npm run dev:prod` o `npm run build`): Vite inyecta variables desde `.env.production`.
  * `VITE_DATA_SOURCE=/data/heladerias_prod.json` (Generado automáticamente por GitHub Actions sincronizando desde Google Sheets).

### 2. Pipeline en Python (`data_pipeline/process_data.py`)
* **Test (`python process_data.py --mode test`)**:
  * Carga las heladerías del archivo local `data_pipeline/mock_sheets/heladerias.csv`.
  * Genera **400 ocurrencias (visitas) simuladas** determinísticamente con pesos realistas de sabor y calidad.
  * Guarda las ocurrencias en `data_pipeline/mock_sheets/ocurrencias.csv` y exporta la base compilada a `public/data/heladerias_test.json`.
* **Prod (`python process_data.py --mode prod`)**:
  * Requiere `SPREADSHEET_ID` y `GOOGLE_SERVICE_ACCOUNT_JSON` en el entorno.
  * Descarga los datos reales directamente desde el Google Sheet especificado y los procesa para guardarlos en `public/data/heladerias_prod.json`.

---

## Flujo de Estado y Reglas de Componentes en React

* **Lifting State Up**: `App.tsx` carga la data una sola vez y maneja la pestaña activa (`recommender` | `profile`).
* **Estado del Recomendador**: Centralizado en `RecommenderView.tsx` (`userLocation`, `maxDistanceMeters` y `selectedAntojo`).
* **Datos Derivados**: El listado ordenado (`rankedResults`) se calcula mediante un `useMemo` reactivo a partir del estado de recomendación utilizando la función `rankearHeladerias` de `src/lib/scoring.ts`.
* **Componentes Tontos**: `LocationInput`, `CravingFilter` y `DistanceSlider` son puros controladores controlados (reciben valor y función callback onChange).
* **Consumidores Puros**: `MapView` y `ResultsList` solo reciben los resultados derivados y los representan en pantalla.

---

## Pautas de Estilos y Diseño Premium (Estilo Pizarrón Monocromo)

* **Tailwind CSS v4**: El proyecto utiliza la versión v4 instalada mediante su plugin nativo de Vite `@tailwindcss/vite`.
* **Estilos Globales**: Centralizados en `src/index.css`.
* **Pizarrón Grafito (Blackboard Panel)**: Aplicar la clase `.blackboard-panel` (fondo negro carbón/grafito `#181818` / `#1c1c1c`, bordes discontinuos tipo tiza blanca/gris `border-dashed`) para contenedores y controles interactivos.
* **Paleta Monocromática**: Utilizar texto e indicadores imitando tizas blancas (`#f5f5f4`) y grises (`#78716c`).
* **Acento Ocre Mate**: Únicamente destacar la heladería recomendada **#1** y las pestañas de selección activa con un sutil amarillo ocre mate (`#d9a752`). No usar otros colores.
* **Tipografías Manuscritas**: Utilizar `'Architects Daughter'` (`font-hand`) para títulos/badges y `'Patrick Hand'` (`font-body-hand`) para cuerpo de texto. Para métricas analíticas, usar formato monoespaciado (`font-mono`) encerrado entre corchetes, ej: `[ 1500m ]`.
* **Mapa Estilo Pizarrón**: El mapa Leaflet utiliza los tiles oscuros `CartoDB Dark Matter` (donde las calles se dibujan como líneas de tiza gris) y popups en negro carbón con bordes punteados.
