import { BaseDeDatos } from "../types";

/**
 * Carga la base de datos de heladerías generada por el pipeline de Python.
 * El archivo heladerias_prod.json es generado automáticamente por GitHub Actions
 * leyendo el Google Sheets real.
 */
export async function fetchHeladerias(): Promise<BaseDeDatos> {
  const dataSource = "/data/heladerias_prod.json";

  try {
    const response = await fetch(dataSource);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as BaseDeDatos;
    return data;
  } catch (error) {
    console.error(`Error cargando base de datos desde ${dataSource}:`, error);
    throw error;
  }
}
