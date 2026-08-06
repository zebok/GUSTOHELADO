import { Ubicacion } from "../types";

/**
 * Calcula la distancia en metros entre dos coordenadas geográficas usando la fórmula Haversine.
 */
export function haversineMetros(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radio de la Tierra en metros
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fallback de coordenadas conocidas en CABA para pruebas sin internet/API
const LOCAL_MOCK_GEOCODING: Record<string, { lat: number; lng: number }> = {
  obelisco: { lat: -34.6037389, lng: -58.3815704 },
  "plaza serrano": { lat: -34.5885834, lng: -58.4301984 },
  "plaza de mayo": { lat: -34.6080556, lng: -58.3722222 },
  "alto palermo": { lat: -34.5878, lng: -58.4111 },
  belgrano: { lat: -34.5615, lng: -58.4563 },
  colegiales: { lat: -34.5743, lng: -58.4498 },
  almagro: { lat: -34.6037, lng: -58.4231 },
  "villa crespo": { lat: -34.5976, lng: -58.4436 },
};

/**
 * Geocodifica una dirección física a latitud/longitud utilizando Nominatim de OpenStreetMap.
 * Si falla o está en modo offline/mock, utiliza un mapeo de palabras clave comunes en CABA.
 */
export async function geocodeDireccion(
  direccion: string
): Promise<Ubicacion | null> {
  const query = direccion.trim().toLowerCase();
  if (!query) return null;

  // 1. Verificar si coincide con coordenadas escritas a mano (ej. "-34.5902, -58.4279")
  const coordsRegex = /^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)$/;
  const match = query.match(coordsRegex);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[3]);
    return { lat, lng, origen: "coords" };
  }

  // 2. Verificar fallback local
  for (const [key, coords] of Object.entries(LOCAL_MOCK_GEOCODING)) {
    if (query.includes(key)) {
      console.log(`Geocodificación local encontrada para "${key}":`, coords);
      return { ...coords, origen: "texto" };
    }
  }

  // 3. Consulta a la API de Nominatim
  try {
    // Para mejorar la precisión en CABA, agregamos contexto geográfico si no está presente
    const searchString = query.includes("buenos aires")
      ? query
      : `${query}, Ciudad Autónoma de Buenos Aires, Argentina`;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      searchString
    )}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        // Nominatim requiere User-Agent válido
        "User-Agent": "HeladoFinderCABA/1.0 (contact: support@heladofinder.caba)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      return { lat, lng, origen: "texto" };
    }
  } catch (error) {
    console.warn("Error consultando Nominatim API, usando fallback de coordenadas de Obelisco:", error);
  }

  // Fallback definitivo: Obelisco
  return { ...LOCAL_MOCK_GEOCODING["obelisco"], origen: "texto" };
}
