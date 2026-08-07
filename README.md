# GustoHelado — Bitácora Personal y Recomendador de Heladerías

Acceso a la aplicación en vivo: https://zebok.github.io/GUSTOHELADO/

Este proyecto nace de una motivación simple y cotidiana: mi pasión por el helado. Como argentino viviendo en la Ciudad de Buenos Aires, estoy rodeado de una oferta inmensa de heladerías nacionales, internacionales, artesanales y comerciales. Con el tiempo, y tras haber probado helados en distintas partes del mundo, desarrollé un paladar bastante crítico sobre el tema. No soy un crítico profesional, pero sé distinguir un sabor fiel de uno artificial y disfruto buscar la mejor experiencia de consumo posible.

Para resolver de manera metódica la pregunta de cuál es la menor distancia que puedo recorrer según mi antojo de helado actual y mi propio criterio de calidad, decidí registrar mis visitas e implementar esta herramienta.

---

## Propósito y Modelo de Recomendación

La aplicación evalúa y ordena las heladerías activas cercanas calculando un puntaje compuesto (Blend Score) en tiempo real en el navegador:

```text
Score Final = (Calidad Histórica * 0.7) + (Proximidad Geográfica * 0.3)
```

1. **Calidad Histórica (70%)**: Promedio de mis calificaciones personales para la categoría de sabor elegida (Chocolates, Dulces de Leche, Cremas, Frutas o Sabores de Autor).
2. **Proximidad Geográfica (30%)**: Distancia lineal (usando la fórmula de Haversine) entre mi ubicación actual (obtenida por GPS o ingresada manualmente) y el local, normalizada en relación con el radio de caminata seleccionado.

---

## Arquitectura del Sistema

El flujo de datos está estructurado para operar sin costo de servidores ni bases de datos complejas:

```text
Google Form (Ingreso de datos desde celular)
   │
   ▼
Google Sheets (Base de datos relacional y catálogo de locales)
   │
   ▼ (Automatizado mediante GitHub Actions semanal)
ETL Pipeline (Script de Python y Pandas que procesa y limpia los datos)
   │
   ▼
Archivo JSON Estático (public/data/heladerias_prod.json)
   │
   ▼
Aplicación React (Filtros, cálculo geográfico y scoring en tiempo real)
```

1. **Google Form y Sheets**: Utilizo un formulario de Google que, mediante un script automatizado (Apps Script), convierte los textos ingresados en identificadores y los guarda de forma estructurada en la pestaña de ocurrencias de mi planilla.
2. **ETL Pipeline**: Un script en Python lee las pestañas del Google Sheets, realiza los cruces de datos, calcula los promedios y genera un archivo JSON unificado.
3. **Frontend React**: La aplicación web lee el archivo JSON estático y realiza de forma reactiva la geolocalización, el filtrado y el cálculo matemático del score de recomendación.

---

## Aprendizajes Clave

Durante el desarrollo de este proyecto, trabajé en los siguientes conceptos:
- Diseño de bases de datos relacionales y normalización utilizando Google Sheets.
- Ingesta y transformación de datos (ETL) con Python y Pandas para generar archivos estructurados limpios.
- Integración de geolocalización y cálculo de distancias usando fórmulas matemáticas directas en JavaScript (fórmula de Haversine).
- Automatización e integración continua mediante GitHub Actions y Google Apps Script sin depender de un backend dedicado.
