export type Lang = "es" | "en";

export type Dict = Record<string, string>;

export const defaultLang: Lang = "es";
export const LANGS: Lang[] = ["es", "en"];

export const translations: Record<Lang, Dict> = {
  es: {
    // App
    "app.title": "GustoHelado — Bitácora Personal y Recomendador de Heladerías",
    "app.description": "Recomendador premium de heladerías en CABA según tu ubicación y antojo.",

    // Common
    "common.loading": "Cargando datos...",
    "common.loadError":
      "No se pudieron cargar los datos. El pipeline de datos puede estar desactualizado.",
    "common.retry": "Reintentar",
    "common.about": "Acerca de",

    // Tabs
    "tabs.finder": "Finder",
    "tabs.bitacora": "Bitácora",
    "tabs.analisis": "Análisis",

    // Intro
    "intro.tagline": "Bitácora Personal · CABA",
    "intro.kicker": "Helado · Buenos Aires",
    "intro.headline": "El recomendador de heladerías que nació de mi paladar.",
    "intro.story1":
      "Nací y crecí en Buenos Aires, una de las ciudades con el helado más rico que probé en mi vida. Con el tiempo desarrollé un paladar crítico: sé distinguir un sabor fiel de uno artificial.",
    "intro.story2":
      "Un día empecé a anotar y calificar cada degustación. Hoy todo vive en una sola hoja de Google Sheets, y esta web lo convierte en recomendaciones en tiempo real.",
    "intro.blend.label": "Lógica del Blend Score",
    "intro.blend.quality": "Calidad de mi paladar (70%)",
    "intro.blend.proximity": "Cercanía geográfica (30%)",
    "intro.blend.formula": "score = 0.7 × Calidad + 0.3 × Proximidad",
    "intro.cta": "VER PROYECTO",

    // Finder
    "finder.title": "Encontrar heladería",
    "finder.subtitle":
      "Elegí tu antojo, indicá tu ubicación y el radio. El sistema rankea las heladerías según mis propias calificaciones históricas y la distancia.",
    "finder.logTasting": "📝 Cargar degustación",
    "finder.empty.title": "Indicá tu ubicación",
    "finder.empty.subtitle":
      "Escribí una dirección de CABA o usá GPS para ver el mapa y las recomendaciones.",

    // Cravings
    "craving.title": "Experiencia deseada",
    "craving.subtitle": "Seleccioná las categorías que te interesan hoy.",
    "craving.classicLine": "Línea clásica",
    "craving.specials": "Especiales",
    "craving.CHOCOLATE": "Chocolate",
    "craving.DULCE DE LECHE": "Dulce de leche",
    "craving.CREMA": "Crema",
    "craving.FRUTA": "Fruta",
    "craving.AUTOR": "Sabores de autor",

    // Location
    "location.title": "Ubicación",
    "location.located": "Ubicado",
    "location.placeholder": "Dirección en CABA...",
    "location.search": "Buscar",
    "location.gps": "Ubicación por GPS",
    "location.coords": "Coordenadas: {lat}, {lng}",
    "location.error.noGeolocation": "Tu navegador no soporta geolocalización.",
    "location.error.gps": "No pudimos obtener tu ubicación. Probá con una dirección.",
    "location.error.notFound": "No encontramos esa dirección.",
    "location.error.search": "Error al buscar la dirección.",

    // Distance
    "distance.title": "Radio máximo",
    "distance.walking": "~{n} min caminando",

    // Results
    "results.title": "Resultados recomendados",
    "results.count.one": "{n} heladería en rango",
    "results.count.many": "{n} heladerías en rango",
    "results.empty.title": "Sin resultados",
    "results.empty.subtitle.part1": "No hay heladerías con calificaciones en",
    "results.empty.subtitle.part2": "dentro del radio seleccionado.",
    "results.empty.noCategories": "ninguna categoría",

    // Card tags
    "tag.walk": "Caminar poco",
    "tag.topQuality": "Calidad Top",
    "tag.balance": "Equilibrio perfecto",
    "tag.top": "Top {label}",
    "tag.ddl": "DDL",
    "tag.autor": "Autor",
    "card.insights": "Ver insights ({n} visitas)",

    // Map
    "map.yourLocation": "Tu ubicación",

    // KPIs
    "kpis.title": "Análisis",
    "kpis.subtitle": "Degustaciones registradas e indicadores clave del proyecto.",
    "kpis.clearFilters": "Limpiar filtros",
    "kpis.allShops": "Todas las heladerías",
    "kpis.allCategories": "Todas las categorías",
    "kpis.tastings": "Degustaciones",
    "kpis.tastingsSub": "registradas en la selección actual",
    "kpis.avgScore": "Puntuación promedio",
    "kpis.avgScoreSub": "sobre 10 puntos históricos",
    "kpis.repurchase": "Tasa de recompra",
    "kpis.repurchaseSub": "volvería a pedir el gusto",
    "kpis.monthlyHistory": "Historial de visitas mensual",
    "kpis.noTemporal": "Sin evolución temporal disponible",
    "kpis.avgByCategory": "Calificaciones promedio por categoría",
    "kpis.scoreByShop": "Puntuación por heladería",
    "kpis.mostOrdered": "Gustos más pedidos",
    "kpis.noData": "No hay datos suficientes",
    "kpis.visits.one": "{n} visita",
    "kpis.visits.many": "{n} visitas",
    "kpis.avgScoreShort": "score prom. {n}",
    "kpis.noTastings": "No hay degustaciones registradas para el filtro seleccionado.",
    "kpis.curiosities": "Datos curiosos globales",
    "kpis.favCategory": "Categoría favorita",
    "kpis.favCategorySub": "Promedio de {n} puntos",
    "kpis.mostOrderedCat": "Categoría más pedida",
    "kpis.degustaciones.one": "{n} degustación",
    "kpis.degustaciones.many": "{n} degustaciones",
    "kpis.starFlavor": "Gusto estrella",
    "kpis.elecciones.one": "{n} elección",
    "kpis.elecciones.many": "{n} elecciones",
    "kpis.chart.tastingsPerMonth": "Degustaciones por mes",
    "kpis.chart.avgRating": "Calificación Promedio",

    // Categories (full)
    "cat.CHOCOLATE": "Chocolate",
    "cat.DULCE DE LECHE": "Dulce de Leche",
    "cat.CREMA": "Crema",
    "cat.FRUTA": "Fruta",
    "cat.AUTOR": "De Autor",
    "cat.MISC": "Variedades",

    // Categories (short, for dataset table)
    "catShort.CHOCOLATE": "Chocolate",
    "catShort.DULCE DE LECHE": "DDL",
    "catShort.CREMA": "Crema",
    "catShort.FRUTA": "Fruta",
    "catShort.AUTOR": "Autor",
    "catShort.MISC": "Misc",

    // Months
    "month.1": "Ene",
    "month.2": "Feb",
    "month.3": "Mar",
    "month.4": "Abr",
    "month.5": "May",
    "month.6": "Jun",
    "month.7": "Jul",
    "month.8": "Ago",
    "month.9": "Sep",
    "month.10": "Oct",
    "month.11": "Nov",
    "month.12": "Dic",

    // Dataset
    "dataset.title": "Bitácora",
    "dataset.subtitle": "Los datos reales del Google Sheets, directamente.",
    "dataset.updated": "actualizado {fecha}",
    "dataset.addRecord": "Agregar registro",
    "dataset.occurrences": "Ocurrencias ({n})",
    "dataset.shops": "Heladerías ({n})",
    "table.search": "Buscar por heladería, gusto o categoría...",
    "table.searchShop": "Buscar por nombre o dirección...",
    "table.scoreMin": "Score ≥",
    "table.from": "Desde",
    "table.to": "Hasta",
    "table.repeatAll": "Volvería: todos",
    "table.repeatYes": "Volvería: sí",
    "table.repeatNo": "Volvería: no",
    "table.clearFilters": "Limpiar filtros",
    "table.count": "{n} de {m} registros",
    "table.date": "Fecha",
    "table.shop": "Heladería",
    "table.flavor": "Gusto",
    "table.cat": "Cat.",
    "table.fidelity": "Fid.",
    "table.group": "Grp.",
    "table.enjoy": "Disf.",
    "table.score": "Score",
    "table.repeat": "Volvería",
    "table.noRecords": "No hay registros con esos filtros",
    "table.noResults": "No hay resultados",
    "table.name": "Nombre",
    "table.address": "Dirección",
    "table.visits": "Visitas",
    "table.activeOnly": "Solo activas",
    "table.shopCount.one": "{n} heladería",
    "table.shopCount.many": "{n} heladerías",
    "table.inactive": "(inactiva)",
  },

  en: {
    // App
    "app.title": "GustoHelado — Personal Ice Cream Log & Recommender",
    "app.description":
      "Premium ice cream shop recommender in CABA based on your location and craving.",

    // Common
    "common.loading": "Loading data...",
    "common.loadError": "Couldn't load the data. The data pipeline may be outdated.",
    "common.retry": "Retry",
    "common.about": "About",

    // Tabs
    "tabs.finder": "Finder",
    "tabs.bitacora": "Log",
    "tabs.analisis": "Analysis",

    // Intro
    "intro.tagline": "Personal Ice Cream Log · CABA",
    "intro.kicker": "Ice cream · Buenos Aires",
    "intro.headline": "The ice cream recommender born from my palate.",
    "intro.story1":
      "I was born and raised in Buenos Aires, one of the cities with the best ice cream I've ever tasted. Over time I developed a critical palate: I can tell a faithful flavor from an artificial one.",
    "intro.story2":
      "One day I started writing tastings down and rating them. Today it all lives in a single Google Sheet — and this website turns it into real-time recommendations.",
    "intro.blend.label": "How the Blend Score works",
    "intro.blend.quality": "My palate's quality (70%)",
    "intro.blend.proximity": "Geographic proximity (30%)",
    "intro.blend.formula": "score = 0.7 × Quality + 0.3 × Proximity",
    "intro.cta": "ENTER PROJECT",

    // Finder
    "finder.title": "Find an ice cream shop",
    "finder.subtitle":
      "Pick your craving, set your location and radius. The system ranks shops by my historical ratings and distance.",
    "finder.logTasting": "📝 Log a tasting",
    "finder.empty.title": "Set your location",
    "finder.empty.subtitle":
      "Type a CABA address or use GPS to see the map and recommendations.",

    // Cravings
    "craving.title": "Desired experience",
    "craving.subtitle": "Select the categories you're into today.",
    "craving.classicLine": "Classic line",
    "craving.specials": "Specials",
    "craving.CHOCOLATE": "Chocolate",
    "craving.DULCE DE LECHE": "Dulce de leche",
    "craving.CREMA": "Cream",
    "craving.FRUTA": "Fruit",
    "craving.AUTOR": "Signature flavors",

    // Location
    "location.title": "Location",
    "location.located": "Located",
    "location.placeholder": "Address in CABA...",
    "location.search": "Search",
    "location.gps": "GPS location",
    "location.coords": "Coordinates: {lat}, {lng}",
    "location.error.noGeolocation": "Your browser doesn't support geolocation.",
    "location.error.gps": "Couldn't get your location. Try an address instead.",
    "location.error.notFound": "We couldn't find that address.",
    "location.error.search": "Error searching that address.",

    // Distance
    "distance.title": "Max radius",
    "distance.walking": "~{n} min walking",

    // Results
    "results.title": "Recommended results",
    "results.count.one": "{n} shop in range",
    "results.count.many": "{n} shops in range",
    "results.empty.title": "No results",
    "results.empty.subtitle.part1": "No shops with ratings in",
    "results.empty.subtitle.part2": "within the selected radius.",
    "results.empty.noCategories": "no category",

    // Card tags
    "tag.walk": "Short walk",
    "tag.topQuality": "Top quality",
    "tag.balance": "Perfect balance",
    "tag.top": "Top {label}",
    "tag.ddl": "DDL",
    "tag.autor": "Signature",
    "card.insights": "View insights ({n} visits)",

    // Map
    "map.yourLocation": "Your location",

    // KPIs
    "kpis.title": "Analysis",
    "kpis.subtitle": "Recorded tastings and key project indicators.",
    "kpis.clearFilters": "Clear filters",
    "kpis.allShops": "All shops",
    "kpis.allCategories": "All categories",
    "kpis.tastings": "Tastings",
    "kpis.tastingsSub": "in the current selection",
    "kpis.avgScore": "Average score",
    "kpis.avgScoreSub": "out of 10 historical points",
    "kpis.repurchase": "Repurchase rate",
    "kpis.repurchaseSub": "would order that flavor again",
    "kpis.monthlyHistory": "Monthly visit history",
    "kpis.noTemporal": "No temporal data available",
    "kpis.avgByCategory": "Average ratings by category",
    "kpis.scoreByShop": "Score by shop",
    "kpis.mostOrdered": "Most ordered flavors",
    "kpis.noData": "Not enough data",
    "kpis.visits.one": "{n} visit",
    "kpis.visits.many": "{n} visits",
    "kpis.avgScoreShort": "avg score {n}",
    "kpis.noTastings": "No tastings recorded for the selected filter.",
    "kpis.curiosities": "Global fun facts",
    "kpis.favCategory": "Favorite category",
    "kpis.favCategorySub": "Average of {n} points",
    "kpis.mostOrderedCat": "Most ordered category",
    "kpis.degustaciones.one": "{n} tasting",
    "kpis.degustaciones.many": "{n} tastings",
    "kpis.starFlavor": "Star flavor",
    "kpis.elecciones.one": "{n} pick",
    "kpis.elecciones.many": "{n} picks",
    "kpis.chart.tastingsPerMonth": "Tastings per month",
    "kpis.chart.avgRating": "Average rating",

    // Categories (full)
    "cat.CHOCOLATE": "Chocolate",
    "cat.DULCE DE LECHE": "Dulce de Leche",
    "cat.CREMA": "Cream",
    "cat.FRUTA": "Fruit",
    "cat.AUTOR": "Signature",
    "cat.MISC": "Misc",

    // Categories (short, for dataset table)
    "catShort.CHOCOLATE": "Chocolate",
    "catShort.DULCE DE LECHE": "DDL",
    "catShort.CREMA": "Cream",
    "catShort.FRUTA": "Fruit",
    "catShort.AUTOR": "Signature",
    "catShort.MISC": "Misc",

    // Months
    "month.1": "Jan",
    "month.2": "Feb",
    "month.3": "Mar",
    "month.4": "Apr",
    "month.5": "May",
    "month.6": "Jun",
    "month.7": "Jul",
    "month.8": "Aug",
    "month.9": "Sep",
    "month.10": "Oct",
    "month.11": "Nov",
    "month.12": "Dec",

    // Dataset
    "dataset.title": "Log",
    "dataset.subtitle": "The real data from Google Sheets, straight through.",
    "dataset.updated": "updated {fecha}",
    "dataset.addRecord": "Add record",
    "dataset.occurrences": "Occurrences ({n})",
    "dataset.shops": "Shops ({n})",
    "table.search": "Search by shop, flavor or category...",
    "table.searchShop": "Search by name or address...",
    "table.scoreMin": "Score ≥",
    "table.from": "From",
    "table.to": "To",
    "table.repeatAll": "Would order: all",
    "table.repeatYes": "Would order: yes",
    "table.repeatNo": "Would order: no",
    "table.clearFilters": "Clear filters",
    "table.count": "{n} of {m} records",
    "table.date": "Date",
    "table.shop": "Shop",
    "table.flavor": "Flavor",
    "table.cat": "Cat.",
    "table.fidelity": "Fid.",
    "table.group": "Grp.",
    "table.enjoy": "Enjoy.",
    "table.score": "Score",
    "table.repeat": "Repeat",
    "table.noRecords": "No records match those filters",
    "table.noResults": "No results",
    "table.name": "Name",
    "table.address": "Address",
    "table.visits": "Visits",
    "table.activeOnly": "Active only",
    "table.shopCount.one": "{n} shop",
    "table.shopCount.many": "{n} shops",
    "table.inactive": "(inactive)",
  },
};

export function localeFor(lang: Lang): string {
  return lang === "es" ? "es-AR" : "en-US";
}
