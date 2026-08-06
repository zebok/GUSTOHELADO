export type MacroCategoria =
  | "CHOCOLATE"
  | "DULCE DE LECHE"
  | "CREMA"
  | "FRUTA"
  | "AUTOR"
  | "MISC";

// Los 5 botones del filtro (MISC existe en data pero no es botón)
export type Antojo = Exclude<MacroCategoria, "MISC">;

export interface Heladeria {
  id: number;
  idCadena: number | null;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  barrio: string;
  activa: boolean;
  visitas: number;
  scorePorCategoria: Partial<Record<MacroCategoria, number>>; // precalculado en Python
}

export interface BaseDeDatos {
  generadoEl: string;
  heladerias: Heladeria[];
}

export interface Ubicacion {
  lat: number;
  lng: number;
  origen: "gps" | "texto" | "coords";
}

// Lo que el front arma en runtime (suma la distancia viva)
export interface ResultadoRankeado {
  heladeria: Heladeria;
  distanciaMetros: number;
  scoreFinal: number;
}
