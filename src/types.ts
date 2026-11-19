export type MacroCategoria =
  | "CHOCOLATE"
  | "DULCE DE LECHE"
  | "CREMA"
  | "FRUTA"
  | "AUTOR"
  | "MISC";

export type SubCategoria =
  | "CLASICO"
  | "SPRINKLES"
  | "FUSION"
  | "LIGHT";

// Los 5 botones del filtro (MISC existe en data pero no es botón principal)
export type Antojo = Exclude<MacroCategoria, "MISC">;

export interface Heladeria {
  id: number;
  idCadena: number | null;
  nombre: string;
  direccion: string;
  ciudad?: string;
  pais?: string;
  lat: number;
  lng: number;
  activa: boolean;
  visitas: number;
  scorePorCategoria: Partial<Record<MacroCategoria, number>>;
}

export interface Ocurrencia {
  id: number;
  fecha: string; // "YYYY-MM-DD"
  heladeria_id: number;
  heladeria_nombre: string;
  ciudad?: string;
  pais?: string;
  gusto: string;
  macrocategoria: MacroCategoria;
  subcategoria?: SubCategoria;
  disfrutabilidad: number | null;          // 40%
  textura_conservacion?: number | null;    // 25% (anticongelante / reactividad / escarcha)
  fidelidad_gusto: number | null;          // 20%
  experiencia_presentacion?: number | null;// 15%
  puntaje_grupo?: number | null;           // compatibilidad legada
  volveria_a_pedir: boolean;
  puntaje_general: number;
}

export interface BaseDeDatos {
  generadoEl: string;
  heladerias: Heladeria[];
  ocurrencias: Ocurrencia[];
}

export interface Ubicacion {
  lat: number;
  lng: number;
  origen: "gps" | "texto" | "coords";
  label?: string;
}

export interface ResultadoRankeado {
  heladeria: Heladeria;
  distanciaMetros: number;
  scoreFinal: number;
}

/**
 * Fórmula oficial de calificación de GustoHelado:
 * 40% Disfrutabilidad + 25% Textura/Conservación + 20% Fidelidad al Gusto + 15% Experiencia/Presentación
 */
export function calcularPuntajeGeneral(
  disfrutabilidad: number,
  textura_conservacion: number,
  fidelidad_gusto: number,
  experiencia_presentacion: number
): number {
  const raw =
    0.40 * disfrutabilidad +
    0.25 * textura_conservacion +
    0.20 * fidelidad_gusto +
    0.15 * experiencia_presentacion;
  return Math.round(Math.max(0, Math.min(10, raw)) * 10) / 10;
}
