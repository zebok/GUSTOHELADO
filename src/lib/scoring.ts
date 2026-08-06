import { Heladeria, Ubicacion, ResultadoRankeado, Antojo } from "../types";
import { haversineMetros } from "./geo";

/**
 * Filtra, calcula distancia y rankea las heladerías según la ubicación actual del usuario,
 * los antojos seleccionados y la distancia máxima en metros.
 */
export function rankearHeladerias(
  heladerias: Heladeria[],
  ubicacion: Ubicacion | null,
  antojos: Antojo[],
  maxDistanceMeters: number,
  pesoScore: number = 0.7,
  pesoDistancia: number = 0.3
): ResultadoRankeado[] {
  if (!ubicacion || antojos.length === 0) return [];

  const resultados: ResultadoRankeado[] = [];

  for (const heladeria of heladerias) {
    // 1. Filtro duro: Solo heladerías activas
    if (!heladeria.activa) continue;

    // 2. Filtro por antojos: Debe tener score histórico para al menos uno de los seleccionados
    let sumScores = 0;
    let countScores = 0;
    for (const a of antojos) {
      const scoreCategoria = heladeria.scorePorCategoria[a];
      if (scoreCategoria !== undefined) {
        sumScores += scoreCategoria;
        countScores++;
      }
    }

    if (countScores === 0) continue; // No tiene ninguno de los antojos seleccionados

    const scorePromedio = sumScores / countScores;

    // 3. Calcular distancia viva
    const distancia = haversineMetros(
      ubicacion.lat,
      ubicacion.lng,
      heladeria.lat,
      heladeria.lng
    );

    // 4. Filtro duro por radio máximo
    if (distancia > maxDistanceMeters) continue;

    // 5. Normalizar variables para el Score Final
    // normScore: Rango de 0 a 1 (los puntajes históricos son de 1 a 10)
    const normScore = scorePromedio / 10;

    // normProximidad: Rango de 0 a 1 (donde 1 es distancia 0, y 0 es la distancia máxima del radio)
    const normProximidad = 1 - distancia / maxDistanceMeters;

    // 6. Calcular Blend Score
    const scoreFinal = pesoScore * normScore + pesoDistancia * normProximidad;

    resultados.push({
      heladeria,
      distanciaMetros: Math.round(distancia),
      scoreFinal: parseFloat(scoreFinal.toFixed(3)),
    });
  }

  // 7. Ordenar de forma descendente por el score final
  return resultados.sort((a, b) => b.scoreFinal - a.scoreFinal);
}
