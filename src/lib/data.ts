import { BaseDeDatos } from "../types";

/**
 * Carga la base de datos de heladerías desde el origen especificado por la variable de entorno
 * de Vite (VITE_DATA_SOURCE), adaptándose automáticamente a entornos de desarrollo y producción.
 */
export async function fetchHeladerias(): Promise<BaseDeDatos> {
  const dataSource = import.meta.env.VITE_DATA_SOURCE || "/data/heladerias_test.json";
  
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
