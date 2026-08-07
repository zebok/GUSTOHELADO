import os
import sys
import json
from datetime import datetime, timezone
import pandas as pd


def normalizar_columnas_ocurrencias(ocurrencias_df):
    """
    Normaliza las columnas de ocurrencias para que sean compatibles con el pipeline.

    El Apps Script escribe en OCURRENCIAS:
      FECHA | ID | ID_HELADERIA | ID_CATEGORIA | GUSTO |
      FIDELIDAD_GUSTO | PUNTAJE_GRUPO | DISFRUTABILIDAD |
      VOLVERIA_A_PEDIR | DELIVERY | COMENTARIOS | PUNTAJE_GENERAL

    Esta función:
      1. Pasa todos los nombres a minúsculas
      2. Renombra id_heladeria → heladeria_id y id_categoria → categoria_id
      3. Renombra fidelidad_gusto → puntaje_gusto (si no existe puntaje_gusto)
      4. Calcula puntaje_general como promedio de las 3 métricas si no viene ya calculado
    """
    # 1. Minúsculas
    ocurrencias_df.columns = [c.lower() for c in ocurrencias_df.columns]

    # 2. Renombrar claves foráneas
    rename_map = {}
    if "id_heladeria" in ocurrencias_df.columns:
        rename_map["id_heladeria"] = "heladeria_id"
    if "id_categoria" in ocurrencias_df.columns:
        rename_map["id_categoria"] = "categoria_id"
    if rename_map:
        ocurrencias_df = ocurrencias_df.rename(columns=rename_map)

    # 3. Renombrar fidelidad_gusto → puntaje_gusto
    if "fidelidad_gusto" in ocurrencias_df.columns and "puntaje_gusto" not in ocurrencias_df.columns:
        ocurrencias_df = ocurrencias_df.rename(columns={"fidelidad_gusto": "puntaje_gusto"})
        print("  → Renombrado 'fidelidad_gusto' a 'puntaje_gusto'")

    # 4. Calcular puntaje_general si no viene
    if "puntaje_general" not in ocurrencias_df.columns:
        metricas = [c for c in ["puntaje_gusto", "puntaje_grupo", "disfrutabilidad"] if c in ocurrencias_df.columns]
        if not metricas:
            raise ValueError(
                "No se encontró ninguna columna de métricas en OCURRENCIAS. "
                "Verificar que el Apps Script esté escribiendo correctamente."
            )
        ocurrencias_df["puntaje_general"] = ocurrencias_df[metricas].mean(axis=1).round(1)
        print(f"  → 'puntaje_general' calculado como promedio de: {metricas}")

    # Asegurar numérico y descartar filas sin puntaje
    ocurrencias_df["puntaje_general"] = pd.to_numeric(ocurrencias_df["puntaje_general"], errors="coerce")
    ocurrencias_df = ocurrencias_df.dropna(subset=["puntaje_general"])

    return ocurrencias_df


def process_data(heladerias_df, categorias_df, ocurrencias_df, output_path):
    """
    Realiza los joins y agrupaciones y exporta la base consolidada como JSON estático.
    """
    print("Procesando datos (joins y agrupaciones)...")

    # Normalizar columnas de ocurrencias
    ocurrencias_df = normalizar_columnas_ocurrencias(ocurrencias_df)

    # Cast de tipos
    heladerias_df["id"] = heladerias_df["id"].astype(int)
    categorias_df["id"] = categorias_df["id"].astype(int)
    ocurrencias_df["heladeria_id"] = pd.to_numeric(ocurrencias_df["heladeria_id"], errors="coerce")
    ocurrencias_df["categoria_id"] = pd.to_numeric(ocurrencias_df["categoria_id"], errors="coerce")
    ocurrencias_df = ocurrencias_df.dropna(subset=["heladeria_id", "categoria_id"])
    ocurrencias_df["heladeria_id"] = ocurrencias_df["heladeria_id"].astype(int)
    ocurrencias_df["categoria_id"] = ocurrencias_df["categoria_id"].astype(int)

    # 1. Conteo de visitas por heladería
    visit_counts = ocurrencias_df.groupby("heladeria_id").size().to_dict()

    # 2. Join ocurrencias ↔ categorías para obtener macroCategoria
    merged_df = ocurrencias_df.merge(categorias_df, left_on="categoria_id", right_on="id")

    # 3. Score promedio por macroCategoria para cada heladería
    grouped = (
        merged_df
        .groupby(["heladeria_id", "macrocategoria"])["puntaje_general"]
        .mean()
        .round(1)
        .reset_index()
    )

    scores_dict = {}
    for _, row in grouped.iterrows():
        hel_id = int(row["heladeria_id"])
        category = str(row["macrocategoria"]).upper()
        score = float(row["puntaje_general"])
        scores_dict.setdefault(hel_id, {})[category] = score

    # 4. Construir lista final de heladerías
    heladerias_list = []
    for _, row in heladerias_df.iterrows():
        hel_id = int(row["id"])

        id_cadena = None
        cadena_col = next((c for c in ["idcadena", "id_cadena"] if c in row.index), None)
        if cadena_col and pd.notna(row[cadena_col]) and str(row[cadena_col]).strip() != "":
            try:
                id_cadena = int(float(row[cadena_col]))
            except ValueError:
                pass

        activa = True
        if "activa" in row.index and pd.notna(row["activa"]):
            activa = str(row["activa"]).lower() in ["true", "1", "yes", "t"]

        heladerias_list.append({
            "id": hel_id,
            "idCadena": id_cadena,
            "nombre": str(row["nombre"]),
            "direccion": str(row["direccion"]),
            "lat": float(row["lat"]),
            "lng": float(row["lng"]),
            "barrio": str(row["barrio"]) if "barrio" in row.index and pd.notna(row["barrio"]) else "CABA",
            "activa": activa,
            "visitas": visit_counts.get(hel_id, 0),
            "scorePorCategoria": scores_dict.get(hel_id, {}),
        })

    output_data = {
        "generadoEl": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "heladerias": heladerias_list,
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Base de datos exportada: {output_path} ({len(heladerias_list)} heladerías)")


def main():
    print("--- CORRIENDO PIPELINE ETL ---")

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_path = os.path.join(base_dir, "public", "data", "heladerias_prod.json")

    spreadsheet_id = os.environ.get("SPREADSHEET_ID")
    credentials_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")

    if not spreadsheet_id or not credentials_json:
        print(
            "Error: se necesitan las variables de entorno SPREADSHEET_ID y "
            "GOOGLE_SERVICE_ACCOUNT_JSON para conectar al Google Sheets."
        )
        sys.exit(1)

    try:
        import gspread
        from google.oauth2.service_account import Credentials

        scopes = [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive",
        ]

        creds_dict = json.loads(credentials_json)
        creds = Credentials.from_service_account_info(creds_dict, scopes=scopes)
        gc = gspread.authorize(creds)

        print(f"Conectando a Google Sheets (ID: {spreadsheet_id})...")
        sh = gc.open_by_key(spreadsheet_id)

        print("Cargando pestañas HELADERIAS, CATEGORIAS y OCURRENCIAS...")
        heladerias_df = pd.DataFrame(sh.worksheet("HELADERIAS").get_all_records())
        categorias_df = pd.DataFrame(sh.worksheet("CATEGORIAS").get_all_records())
        ocurrencias_df = pd.DataFrame(sh.worksheet("OCURRENCIAS").get_all_records())

        # Normalizar nombres de columnas a minúsculas
        heladerias_df.columns = [c.lower() for c in heladerias_df.columns]
        categorias_df.columns = [c.lower() for c in categorias_df.columns]
        # ocurrencias_df se normaliza dentro de process_data → normalizar_columnas_ocurrencias

        # Renombrar macroCategoria en categorías
        if "macro_categoria" in categorias_df.columns:
            categorias_df.rename(columns={"macro_categoria": "macrocategoria"}, inplace=True)

        print(f"Registros cargados → HELADERIAS: {len(heladerias_df)} | CATEGORIAS: {len(categorias_df)} | OCURRENCIAS: {len(ocurrencias_df)}")

        process_data(heladerias_df, categorias_df, ocurrencias_df, output_path)

    except Exception as e:
        print(f"Error crítico en el pipeline: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
