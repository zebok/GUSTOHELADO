# GustoHelado — Bitácora Personal y Recomendador de Heladerías

[English](README.md) | [Español](README.es.md)

Demo en vivo: https://zebok.github.io/GUSTOHELADO/

## Acerca de

Este proyecto nace de una motivación simple y cotidiana: mi pasión por el helado.
Nací y crecí en Buenos Aires, Argentina. También he vivido en otros sitios y he viajado mucho.

Buenos Aires es una de las ciudades con el helado mas rico que he probado en mi vida.
Estoy rodeado de una oferta inmensa de heladerías nacionales, internacionales, artesanales y comerciales. Con el tiempo, y tras haber probado helados en distintas partes del mundo, desarrollé un paladar bastante crítico sobre el tema.
No soy un crítico profesional, pero sé distinguir un sabor fiel de uno artificial y disfruto buscar la mejor experiencia de consumo posible.

Un día, empecé a anotar y a calificarlos. Donde sea.
Hoy en día, lo tengo todo organizado en una única hoja de Google Sheets.
Y a partir de eso, como un joven con preguntas y respuestas, hice una página web para agilizar el proceso de carga, y compartir mis recomendaciones con el resto del mundo.

Esta, es mi bitácora personal sobre los helados.

## Funcionalidades

- **Recomendador por antojo**: elegí qué te pide el cuerpo (chocolate, dulce de leche, cremas, frutas o sabores de autor) y obtené sugerencias rankeadas.
- **Ubicación en vivo o manual**: la app usa tu posición por GPS o una ubicación que ingresás a mano.
- **Control de radio de caminata**: ajustá la distancia máxima y mirá qué hay cerca.
- **Ranking por Blend Score**: los resultados se ordenan con un puntaje calculado en tiempo real en el navegador.
- **Vista de mapa**: los resultados se muestran en un mapa interactivo.
- **Insights personales**: KPIs y gráficos interactivos (Chart.js) que exploran mi historial de degustaciones.
- **Dataset abierto**: explorá la base completa de heladerías y degustaciones registradas.

## Cómo funcionan las recomendaciones

La aplicación ordena las heladerías cercanas usando un puntaje compuesto, calculado en tiempo real en el navegador:

- **Calidad Histórica (70%)**: promedio de mis calificaciones personales para la categoría de sabor que elijas (chocolates, dulces de leche, cremas, frutas o sabores de autor).
- **Proximidad Geográfica (30%)**: distancia lineal (fórmula de Haversine) entre mi ubicación actual —obtenida por GPS o ingresada manualmente— y el local, normalizada según el radio de caminata que selecciones.

## Arquitectura
El flujo de datos está diseñado para operar sin costo de servidores ni bases de datos complejas:

Google Form (ingreso de datos desde el celular o la pc)
   │
   ▼
Google Sheets (base de datos relacional y catálogo de locales)
   │
   ▼ (automatizado mediante GitHub Actions)
ETL Pipeline (script de Python y Pandas que procesa y limpia los datos)
   │
   ▼
Archivo JSON estático (public/data/heladerias_prod.json)
   │
   ▼
Aplicación React (filtros, cálculo geográfico, visualizaciones lindas y fluidas, en tiempo real)
```

1. **Google Form y Sheets**: un formulario de Google, junto con un script de Apps Script, convierte los textos ingresados en identificadores y guarda los registros de forma estructurada en la pestaña de ocurrencias.
2. **ETL Pipeline**: un script en Python lee las pestañas de la planilla, cruza los datos, calcula los promedios y genera un archivo JSON unificado para que el front sea muy fluido.
3. **Frontend React**: la app lee el JSON estático y realiza de forma reactiva la geolocalización, el filtrado y el cálculo del puntaje — sin depender de un backend.

## Aprendizajes clave

Este proyecto fue un ejercicio práctico sobre:

- Diseño de bases de datos relacionales y normalización utilizando Google Sheets.
- Ingesta y transformación de datos (ETL) con Python y Pandas para generar archivos estructurados y limpios.
- Integración de geolocalización y cálculo de distancias usando fórmulas matemáticas directas en JavaScript (fórmula de Haversine).
- Automatización e integración continua mediante GitHub Actions y Google Apps Script — sin depender de un backend dedicado.

---

Esta es mi bitácora personal sobre los helados. Y mi primer proyecto de datos.
