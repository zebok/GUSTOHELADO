export type Lang = "es" | "en";

export type Dict = Record<string, string>;

export const defaultLang: Lang = "es";
export const LANGS: Lang[] = ["es", "en"];

export const translations: Record<Lang, Dict> = {
  es: {
    // App
    "app.title": "GustoHelado — Bitácora Personal y Recomendador de Heladerías",
    "app.description": "Mi bitácora personal de helados desde 2010: clasificación propia, análisis de datos y recomendador según mi paladar.",

    // Common
    "common.loading": "Cargando bitácora...",
    "common.loadError":
      "No se pudieron cargar los datos. El pipeline de datos puede estar desactualizado.",
    "common.retry": "Reintentar",
    "common.about": "Mi historia",
    "common.quickLog": "+ Cargar tomada",

    // Tabs
    "tabs.finder": "Qué pedir hoy",
    "tabs.bitacora": "Bitácora",
    "tabs.analisis": "Análisis",

    // Intro (Storytelling)
    "intro.tagline": "Bitácora Personal · 2010–2026",
    "intro.kicker": "Buenos Aires · Berlín · Aarhus · El Mundo",
    "intro.headline": "Me gusta el helado, soy curioso y analizo datos. Esta es mi bitácora desde 2010.",
    "intro.story1":
      "Crecí en Buenos Aires, una de las ciudades con el mejor helado del mundo. En 2010 empecé a anotar cada gusto que pedía: primero en mi barrio, después viviendo en Berlín y en Aarhus, y en cada viaje que hice.",
    "intro.story2":
      "Con los años mi paladar fue mutando: del Banana Split, la Tramontana y el Dulce de Leche Granizado hacia las tortas hechas helado, la gianduia, los frutos secos y el gusto insignia de cada casa.",
    "intro.story3":
      "Armé mi propio sistema para clasificar cada gusto y calificarlo del 0.0 al 10. Hoy lo uso desde el celular para cargar cada tomada y saber exactamente qué pedir cuando entro a una heladería.",
    "intro.step1.label": "01 · El hábito",
    "intro.step2.label": "02 · El paladar",
    "intro.step3.label": "03 · El método",
    "intro.taxonomy.label": "Mi Clasificación (Categoría × Subcategoría)",
    "intro.taxonomy.sub": "Cada gusto tiene una gran familia y una estructura física:",
    "intro.formula.label": "Mi Ecuación de Calificación (0.0 a 10.0)",
    "intro.metric.enjoy": "Disfrutabilidad (40%) · Qué tanto me gustó",
    "intro.metric.texture": "Textura y Frío (25%) · Cremosidad, cero escarcha y fusión",
    "intro.metric.fidelity": "Fidelidad (20%) · Qué tan real sabe a lo que promete",
    "intro.metric.experience": "Experiencia (15%) · Cucurucho, vasito, pote o exhibición",
    "intro.blend.label": "Lógica del Recomendador",
    "intro.blend.quality": "Mi puntaje histórico (70%)",
    "intro.blend.proximity": "Cercanía geográfica (30%)",
    "intro.blend.formula": "Puntaje Gusto = 0.40×Disf + 0.25×Textura + 0.20×Fidelidad + 0.15×Exp",
    "intro.cta": "ENTRAR A MI BITÁCORA",
    "intro.skip": "Saltar intro",
    "intro.next": "Siguiente",
    "intro.prev": "Anterior",

    // Finder
    "finder.title": "¿Qué helado pido hoy?",
    "finder.subtitle":
      "Elegí qué tenés ganas de tomar, tu ubicación (o ciudad) y el radio. El mapa cruza mi historial de calificaciones con la distancia.",
    "finder.logTasting": "🍦 Cargar tomada",
    "finder.empty.title": "Elegí dónde estás parado",
    "finder.empty.subtitle":
      "Tocá un punto rápido abajo, escribí una dirección o activá el GPS para ver qué heladería te conviene y qué pedir ahí.",
    "finder.presets.label": "Saltos rápidos:",

    // Cravings
    "craving.title": "Antojo de hoy",
    "craving.subtitle": "Filtrá por las grandes familias de gustos.",
    "craving.classicLine": "Familias clásicas",
    "craving.specials": "Creaciones",
    "craving.CHOCOLATE": "Chocolate",
    "craving.DULCE DE LECHE": "Dulce de leche",
    "craving.CREMA": "Cremas y Tortas",
    "craving.FRUTA": "Frutas",
    "craving.AUTOR": "De Autor",

    // Location
    "location.title": "Ubicación",
    "location.located": "Ubicado",
    "location.placeholder": "Dirección o esquina (ej. Monroe 2072, Belgrano)...",
    "location.search": "Buscar",
    "location.gps": "Ubicación por GPS",
    "location.coords": "Coordenadas: {lat}, {lng}",
    "location.error.noGeolocation": "Tu navegador no soporta geolocalización.",
    "location.error.gps": "No pudimos obtener tu ubicación. Probá con una dirección o salto rápido.",
    "location.error.notFound": "No encontramos esa dirección.",
    "location.error.search": "Error al buscar la dirección.",

    // Distance
    "distance.title": "Radio de búsqueda",
    "distance.walking": "~{n} min caminando",

    // Results
    "results.title": "Dónde pedir según mi historial",
    "results.count.one": "{n} heladería en rango",
    "results.count.many": "{n} heladerías en rango",
    "results.empty.title": "Sin heladerías en ese radio",
    "results.empty.subtitle.part1": "No tengo registros con",
    "results.empty.subtitle.part2": "dentro de esta distancia. Probá ampliando el radio.",
    "results.empty.noCategories": "ninguna categoría",

    // Card tags
    "tag.walk": "A pasos",
    "tag.topQuality": "De mis favoritas",
    "tag.balance": "Ideal hoy",
    "tag.top": "Top {label}",
    "tag.ddl": "DDL",
    "tag.autor": "Autor",
    "card.insights": "Ver mis {n} tomadas",
    "card.whatToOrder": "Qué pedir acá:",
    "card.avoid": "Evitar:",

    // Map
    "map.yourLocation": "Tu ubicación",

    // KPIs
    "kpis.title": "Análisis de mi Paladar",
    "kpis.subtitle": "Cruces de mis degustaciones, evolución desde 2010 y desglose por métrica.",
    "kpis.clearFilters": "Limpiar filtros",
    "kpis.allShops": "Todas las heladerías",
    "kpis.allCategories": "Todas las categorías",
    "kpis.allSubcategories": "Todas las subcategorías",
    "kpis.allCountries": "Todos los países",
    "kpis.tastings": "Ocurrencias",
    "kpis.tastingsSub": "gustos probados en la selección",
    "kpis.avgScore": "Puntaje promedio",
    "kpis.avgScoreSub": "40% Disf · 25% Text · 20% Fid · 15% Exp",
    "kpis.repurchase": "Volvería a pedir",
    "kpis.repurchaseSub": "tasa de repetición del gusto en ese local",
    "kpis.monthlyHistory": "Evolución histórica de degustaciones",
    "kpis.noTemporal": "Sin evolución temporal disponible",
    "kpis.avgByCategory": "Promedio por categoría y métrica",
    "kpis.metricsBreakdown": "Desglose de mis 4 métricas de calificación",
    "kpis.subcatBreakdown": "Distribución por Subcategoría",
    "kpis.scoreByShop": "Mis heladerías mejor puntuadas",
    "kpis.mostOrdered": "Los gustos que más pedí",
    "kpis.noData": "No hay datos suficientes",
    "kpis.visits.one": "{n} ocurrencia",
    "kpis.visits.many": "{n} ocurrencias",
    "kpis.avgScoreShort": "prom. {n}",
    "kpis.noTastings": "No hay degustaciones registradas para el filtro seleccionado.",
    "kpis.curiosities": "ADN de mi paladar (2010–2026)",
    "kpis.favCategory": "Categoría mejor puntuada",
    "kpis.favCategorySub": "Promedio de {n} pts",
    "kpis.mostOrderedCat": "Categoría que más pido",
    "kpis.degustaciones.one": "{n} ocurrencia",
    "kpis.degustaciones.many": "{n} ocurrencias",
    "kpis.starFlavor": "Gusto más repetido",
    "kpis.elecciones.one": "{n} vez pedido",
    "kpis.elecciones.many": "{n} veces pedido",
    "kpis.chart.tastingsPerMonth": "Ocurrencias",
    "kpis.chart.avgRating": "Calificación Promedio",

    // Categories (full)
    "cat.CHOCOLATE": "Chocolate",
    "cat.DULCE DE LECHE": "Dulce de Leche",
    "cat.CREMA": "Cremas y Tortas",
    "cat.FRUTA": "Fruta",
    "cat.AUTOR": "De Autor",
    "cat.MISC": "Misceláneos",

    // Categories (short)
    "catShort.CHOCOLATE": "Choc",
    "catShort.DULCE DE LECHE": "DDL",
    "catShort.CREMA": "Crema",
    "catShort.FRUTA": "Fruta",
    "catShort.AUTOR": "Autor",
    "catShort.MISC": "Misc",

    // Subcategories
    "subcat.CLASICO": "Clásico / Puro",
    "subcat.SPRINKLES": "Sprinkles (Agregados)",
    "subcat.FUSION": "Fusión / Pastelería",
    "subcat.LIGHT": "Light / Funcional",
    "subcatShort.CLASICO": "Clásico",
    "subcatShort.SPRINKLES": "Sprinkles",
    "subcatShort.FUSION": "Fusión",
    "subcatShort.LIGHT": "Light",

    // Metrics
    "metric.disfrutabilidad": "Disfrutabilidad",
    "metric.textura_conservacion": "Textura / Conservación",
    "metric.fidelidad_gusto": "Fidelidad al Gusto",
    "metric.experiencia_presentacion": "Experiencia / Presentación",

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
    "dataset.title": "Bitácora de Ocurrencias",
    "dataset.subtitle": "Registro completo de cada gusto probado desde 2010 en Buenos Aires y viajes.",
    "dataset.updated": "actualizado {fecha}",
    "dataset.addRecord": "Cargar tomada",
    "dataset.occurrences": "Ocurrencias ({n})",
    "dataset.shops": "Heladerías ({n})",
    "table.search": "Buscar por heladería, gusto, ciudad o país...",
    "table.searchShop": "Buscar por nombre, dirección, ciudad o país...",
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
    "table.city": "Ciudad",
    "table.flavor": "Gusto",
    "table.cat": "Cat.",
    "table.subcat": "Subcat.",
    "table.enjoy": "Disf. (40%)",
    "table.texture": "Text. (25%)",
    "table.fidelity": "Fid. (20%)",
    "table.experience": "Exp. (15%)",
    "table.score": "Score",
    "table.repeat": "Volvería",
    "table.noRecords": "No hay registros con esos filtros",
    "table.noResults": "No hay resultados",
    "table.name": "Nombre",
    "table.address": "Dirección",
    "table.visits": "Tomadas",
    "table.activeOnly": "Solo activas",
    "table.shopCount.one": "{n} heladería",
    "table.shopCount.many": "{n} heladerías",
    "table.inactive": "(inactiva)",
  },

  en: {
    // App
    "app.title": "GustoHelado — Personal Ice Cream Log & Recommender",
    "app.description":
      "My personal ice cream log since 2010: custom taxonomy, data analysis, and recommender built for my palate.",

    // Common
    "common.loading": "Loading log...",
    "common.loadError": "Couldn't load the data. The data pipeline may be outdated.",
    "common.retry": "Retry",
    "common.about": "My story",
    "common.quickLog": "+ Log scoop",

    // Tabs
    "tabs.finder": "What to order",
    "tabs.bitacora": "Log",
    "tabs.analisis": "Analysis",

    // Intro
    "intro.tagline": "Personal Log · 2010–2026",
    "intro.kicker": "Buenos Aires · Berlin · Aarhus · The World",
    "intro.headline": "I love ice cream, I'm curious, and I analyze data. This is my log since 2010.",
    "intro.story1":
      "I grew up in Buenos Aires, one of the best ice cream cities on Earth. In 2010 I started logging every flavor I ordered: first in my neighborhood, then while living in Berlin and Aarhus, and across every trip.",
    "intro.story2":
      "Over the years my palate evolved: from Banana Split, Tramontana, and Dulce de Leche Granizado to cake-inspired flavors, gianduia, roasted nuts, and each shop's signature creation.",
    "intro.story3":
      "I designed my own taxonomy and 0.0–10 scoring equation. Today I use it on my phone to log new tastings and know exactly what to order whenever I walk into a gelateria.",
    "intro.step1.label": "01 · The habit",
    "intro.step2.label": "02 · The palate",
    "intro.step3.label": "03 · The method",
    "intro.taxonomy.label": "My Taxonomy (Category × Subcategory)",
    "intro.taxonomy.sub": "Every flavor belongs to a main family and a structural type:",
    "intro.formula.label": "My Rating Equation (0.0 to 10.0)",
    "intro.metric.enjoy": "Enjoyability (40%) · Pure subjective pleasure",
    "intro.metric.texture": "Texture & Cold (25%) · Creaminess, zero ice crystals & melt reactivity",
    "intro.metric.fidelity": "Flavor Fidelity (20%) · How true it tastes to what it claims",
    "intro.metric.experience": "Experience (15%) · Cone quality, cup presentation, thermal tub & vibe",
    "intro.blend.label": "Recommender Logic",
    "intro.blend.quality": "My historical score (70%)",
    "intro.blend.proximity": "Geographic proximity (30%)",
    "intro.blend.formula": "Flavor Score = 0.40×Enjoy + 0.25×Texture + 0.20×Fidelity + 0.15×Exp",
    "intro.cta": "ENTER MY LOG",
    "intro.skip": "Skip intro",
    "intro.next": "Next",
    "intro.prev": "Back",

    // Finder
    "finder.title": "What should I order today?",
    "finder.subtitle":
      "Pick your craving, location (or city preset) and radius. The system crosses my historical ratings with distance.",
    "finder.logTasting": "🍦 Log tasting",
    "finder.empty.title": "Pick where you are",
    "finder.empty.subtitle":
      "Tap a quick city/neighborhood jump below, type an address, or use GPS to see the best spots and what to order there.",
    "finder.presets.label": "Quick jumps:",

    // Cravings
    "craving.title": "Today's craving",
    "craving.subtitle": "Filter by the main flavor families.",
    "craving.classicLine": "Classic families",
    "craving.specials": "Creations",
    "craving.CHOCOLATE": "Chocolate",
    "craving.DULCE DE LECHE": "Dulce de leche",
    "craving.CREMA": "Creams & Cakes",
    "craving.FRUTA": "Fruits",
    "craving.AUTOR": "Signature",

    // Location
    "location.title": "Location",
    "location.located": "Located",
    "location.placeholder": "Address or corner (e.g. Monroe 2072, Belgrano)...",
    "location.search": "Search",
    "location.gps": "GPS location",
    "location.coords": "Coordinates: {lat}, {lng}",
    "location.error.noGeolocation": "Your browser doesn't support geolocation.",
    "location.error.gps": "Couldn't get your location. Try an address or quick preset.",
    "location.error.notFound": "We couldn't find that address.",
    "location.error.search": "Error searching that address.",

    // Distance
    "distance.title": "Search radius",
    "distance.walking": "~{n} min walking",

    // Results
    "results.title": "Where to order based on my history",
    "results.count.one": "{n} shop in range",
    "results.count.many": "{n} shops in range",
    "results.empty.title": "No shops in that radius",
    "results.empty.subtitle.part1": "No recorded tastings in",
    "results.empty.subtitle.part2": "within this distance. Try expanding the radius.",
    "results.empty.noCategories": "no category",

    // Card tags
    "tag.walk": "Steps away",
    "tag.topQuality": "Personal favorite",
    "tag.balance": "Ideal today",
    "tag.top": "Top {label}",
    "tag.ddl": "DDL",
    "tag.autor": "Signature",
    "card.insights": "See my {n} tastings",
    "card.whatToOrder": "What to order here:",
    "card.avoid": "Avoid:",

    // Map
    "map.yourLocation": "Your location",

    // KPIs
    "kpis.title": "My Palate Analysis",
    "kpis.subtitle": "Cross-analysis of my tastings, evolution since 2010, and 4-metric breakdown.",
    "kpis.clearFilters": "Clear filters",
    "kpis.allShops": "All shops",
    "kpis.allCategories": "All categories",
    "kpis.allSubcategories": "All subcategories",
    "kpis.allCountries": "All countries",
    "kpis.tastings": "Occurrences",
    "kpis.tastingsSub": "flavors tasted in selection",
    "kpis.avgScore": "Average score",
    "kpis.avgScoreSub": "40% Enj · 25% Tex · 20% Fid · 15% Exp",
    "kpis.repurchase": "Would order again",
    "kpis.repurchaseSub": "repeat rate for that flavor at that shop",
    "kpis.monthlyHistory": "Historical tasting timeline",
    "kpis.noTemporal": "No temporal data available",
    "kpis.avgByCategory": "Average by category & metric",
    "kpis.metricsBreakdown": "Breakdown of my 4 rating metrics",
    "kpis.subcatBreakdown": "Distribution by Subcategory",
    "kpis.scoreByShop": "My highest-rated shops",
    "kpis.mostOrdered": "My most ordered flavors",
    "kpis.noData": "Not enough data",
    "kpis.visits.one": "{n} occurrence",
    "kpis.visits.many": "{n} occurrences",
    "kpis.avgScoreShort": "avg {n}",
    "kpis.noTastings": "No tastings recorded for the selected filter.",
    "kpis.curiosities": "My Palate DNA (2010–2026)",
    "kpis.favCategory": "Highest-rated category",
    "kpis.favCategorySub": "Average of {n} pts",
    "kpis.mostOrderedCat": "Most ordered category",
    "kpis.degustaciones.one": "{n} occurrence",
    "kpis.degustaciones.many": "{n} occurrences",
    "kpis.starFlavor": "Most repeated flavor",
    "kpis.elecciones.one": "{n} time ordered",
    "kpis.elecciones.many": "{n} times ordered",
    "kpis.chart.tastingsPerMonth": "Occurrences",
    "kpis.chart.avgRating": "Average Rating",

    // Categories (full)
    "cat.CHOCOLATE": "Chocolate",
    "cat.DULCE DE LECHE": "Dulce de Leche",
    "cat.CREMA": "Creams & Cakes",
    "cat.FRUTA": "Fruit",
    "cat.AUTOR": "Signature",
    "cat.MISC": "Misc",

    // Categories (short)
    "catShort.CHOCOLATE": "Choc",
    "catShort.DULCE DE LECHE": "DDL",
    "catShort.CREMA": "Cream",
    "catShort.FRUTA": "Fruit",
    "catShort.AUTOR": "Signature",
    "catShort.MISC": "Misc",

    // Subcategories
    "subcat.CLASICO": "Classic / Pure",
    "subcat.SPRINKLES": "Sprinkles (Solids)",
    "subcat.FUSION": "Fusion / Pastry",
    "subcat.LIGHT": "Light / Functional",
    "subcatShort.CLASICO": "Classic",
    "subcatShort.SPRINKLES": "Sprinkles",
    "subcatShort.FUSION": "Fusion",
    "subcatShort.LIGHT": "Light",

    // Metrics
    "metric.disfrutabilidad": "Enjoyability",
    "metric.textura_conservacion": "Texture / Cold",
    "metric.fidelidad_gusto": "Flavor Fidelity",
    "metric.experiencia_presentacion": "Experience / Presentation",

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
    "dataset.title": "Occurrences Log",
    "dataset.subtitle": "Complete record of every flavor tasted since 2010 in Buenos Aires and abroad.",
    "dataset.updated": "updated {fecha}",
    "dataset.addRecord": "Log tasting",
    "dataset.occurrences": "Occurrences ({n})",
    "dataset.shops": "Shops ({n})",
    "table.search": "Search by shop, flavor, city or country...",
    "table.searchShop": "Search by name, address, city or country...",
    "table.scoreMin": "Score ≥",
    "table.from": "From",
    "table.to": "To",
    "table.repeatAll": "Repeat: all",
    "table.repeatYes": "Repeat: yes",
    "table.repeatNo": "Repeat: no",
    "table.clearFilters": "Clear filters",
    "table.count": "{n} of {m} records",
    "table.date": "Date",
    "table.shop": "Shop",
    "table.city": "City",
    "table.flavor": "Flavor",
    "table.cat": "Cat.",
    "table.subcat": "Subcat.",
    "table.enjoy": "Enj. (40%)",
    "table.texture": "Tex. (25%)",
    "table.fidelity": "Fid. (20%)",
    "table.experience": "Exp. (15%)",
    "table.score": "Score",
    "table.repeat": "Repeat",
    "table.noRecords": "No records match those filters",
    "table.noResults": "No results",
    "table.name": "Name",
    "table.address": "Address",
    "table.visits": "Tastings",
    "table.activeOnly": "Active only",
    "table.shopCount.one": "{n} shop",
    "table.shopCount.many": "{n} shops",
    "table.inactive": "(inactive)",
  },
};

export function localeFor(lang: Lang): string {
  return lang === "es" ? "es-AR" : "en-US";
}
