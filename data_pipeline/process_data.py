import os
import sys
import json
from datetime import datetime, timezone
import pandas as pd


def normalizar_columnas_ocurrencias(ocurrencias_df):
    """
    Normaliza las columnas de ocurrencias para que sean compatibles con el pipeline.
    Soporta tanto datos del Apps Script (prod) como datos históricos del Sheets.
    """
    ocurrencias_df.columns = [c.lower() for c in ocurrencias_df.columns]

    rename_map = {}
    if "id_heladeria" in ocurrencias_df.columns:
        rename_map["id_heladeria"] = "heladeria_id"
    if "id_categoria" in ocurrencias_df.columns:
        rename_map["id_categoria"] = "categoria_id"
    if rename_map:
        ocurrencias_df = ocurrencias_df.rename(columns=rename_map)

    if "fidelidad_gusto" in ocurrencias_df.columns and "puntaje_gusto" not in ocurrencias_df.columns:
        ocurrencias_df = ocurrencias_df.rename(columns={"fidelidad_gusto": "puntaje_gusto"})

    if "puntaje_general" not in ocurrencias_df.columns:
        metricas = [c for c in ["puntaje_gusto", "puntaje_grupo", "disfrutabilidad"] if c in ocurrencias_df.columns]
        if not metricas:
            raise ValueError(
                "No se encontró ninguna columna de métricas en OCURRENCIAS. "
                "Verificar que el Apps Script esté escribiendo correctamente."
            )
        ocurrencias_df["puntaje_general"] = ocurrencias_df[metricas].mean(axis=1).round(1)

    ocurrencias_df["puntaje_general"] = pd.to_numeric(ocurrencias_df["puntaje_general"], errors="coerce")
    ocurrencias_df = ocurrencias_df.dropna(subset=["puntaje_general"])

    return ocurrencias_df


def process_data(heladerias_df, categorias_df, ocurrencias_df, output_path):
    """
    Realiza los joins y agrupaciones y exporta la base consolidada como JSON estático.
    Incluye tanto el catálogo de heladerías (con scores por categoría) como el
    listado completo de ocurrencias individuales enriquecidas con nombres.
    """
    print("Procesando datos (joins y agrupaciones)...")

    ocurrencias_df = normalizar_columnas_ocurrencias(ocurrencias_df)

    heladerias_df["id"] = heladerias_df["id"].astype(int)
    categorias_df["id"] = categorias_df["id"].astype(int)
    ocurrencias_df["heladeria_id"] = pd.to_numeric(ocurrencias_df["heladeria_id"], errors="coerce")
    ocurrencias_df["categoria_id"] = pd.to_numeric(ocurrencias_df["categoria_id"], errors="coerce")
    ocurrencias_df = ocurrencias_df.dropna(subset=["heladeria_id", "categoria_id"])
    ocurrencias_df["heladeria_id"] = ocurrencias_df["heladeria_id"].astype(int)
    ocurrencias_df["categoria_id"] = ocurrencias_df["categoria_id"].astype(int)

    # --- Lookup maps ---
    heladeria_nombre_map = dict(zip(heladerias_df["id"], heladerias_df["nombre"]))
    categoria_macro_map = dict(zip(categorias_df["id"], categorias_df["macrocategoria"]))

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

    # 4. Construir lista final de heladerías (sin campo barrio)
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
            "activa": activa,
            "visitas": visit_counts.get(hel_id, 0),
            "scorePorCategoria": scores_dict.get(hel_id, {}),
        })

    # 5. Construir lista de ocurrencias enriquecidas con nombres
    ocurrencias_list = []
    for _, row in ocurrencias_df.iterrows():
        hel_id = int(row["heladeria_id"])
        cat_id = int(row["categoria_id"])

        # Normalizar fecha
        fecha_raw = str(row.get("fecha", "")).strip()
        fecha_iso = ""
        for fmt in ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y"]:
            try:
                fecha_iso = datetime.strptime(fecha_raw, fmt).strftime("%Y-%m-%d")
                break
            except ValueError:
                continue
        if not fecha_iso:
            fecha_iso = fecha_raw

        # Volvería a pedir: normalizar a bool
        volveria_raw = str(row.get("volveria_a_pedir", "")).lower().strip()
        volveria = volveria_raw in ["true", "si", "sí", "1", "yes"]

        puntaje_gusto = None
        if "puntaje_gusto" in row.index:
            val = pd.to_numeric(row["puntaje_gusto"], errors="coerce")
            puntaje_gusto = float(val) if pd.notna(val) else None

        puntaje_grupo = None
        if "puntaje_grupo" in row.index:
            val = pd.to_numeric(row["puntaje_grupo"], errors="coerce")
            puntaje_grupo = float(val) if pd.notna(val) else None

        disfrutabilidad = None
        if "disfrutabilidad" in row.index:
            val = pd.to_numeric(row["disfrutabilidad"], errors="coerce")
            disfrutabilidad = float(val) if pd.notna(val) else None

        ocurrencias_list.append({
            "id": int(row["id"]) if "id" in row.index and pd.notna(row.get("id")) else len(ocurrencias_list) + 1,
            "fecha": fecha_iso,
            "heladeria_id": hel_id,
            "heladeria_nombre": heladeria_nombre_map.get(hel_id, f"ID {hel_id}"),
            "gusto": str(row.get("gusto", "")).strip(),
            "macrocategoria": str(categoria_macro_map.get(cat_id, "MISC")).upper(),
            "fidelidad_gusto": puntaje_gusto,
            "puntaje_grupo": puntaje_grupo,
            "disfrutabilidad": disfrutabilidad,
            "volveria_a_pedir": volveria,
            "puntaje_general": float(row["puntaje_general"]),
        })

    # Ordenar ocurrencias por fecha descendente
    ocurrencias_list.sort(key=lambda x: x["fecha"], reverse=True)

    output_data = {
        "generadoEl": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "heladerias": heladerias_list,
        "ocurrencias": ocurrencias_list,
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Base de datos exportada: {output_path}")
    print(f"   → {len(heladerias_list)} heladerías | {len(ocurrencias_list)} ocurrencias")


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

        heladerias_df.columns = [c.lower() for c in heladerias_df.columns]
        categorias_df.columns = [c.lower() for c in categorias_df.columns]

        if "macro_categoria" in categorias_df.columns:
            categorias_df.rename(columns={"macro_categoria": "macrocategoria"}, inplace=True)
        elif "macrocategoria" not in categorias_df.columns:
            # Try to find the right column
            for col in categorias_df.columns:
                if "macro" in col.lower() or "categ" in col.lower():
                    categorias_df.rename(columns={col: "macrocategoria"}, inplace=True)
                    break

        print(f"Registros → HELADERIAS: {len(heladerias_df)} | CATEGORIAS: {len(categorias_df)} | OCURRENCIAS: {len(ocurrencias_df)}")

        process_data(heladerias_df, categorias_df, ocurrencias_df, output_path)

    except Exception as e:
        print(f"Error crítico en el pipeline: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
