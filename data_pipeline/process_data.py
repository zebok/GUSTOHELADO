import os
import sys
import json
import argparse
import random
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

def generate_mock_occurrences(heladerias_df, categorias_df, num_occurrences=400):
    """
    Generates a realistic set of mock visits (occurrences) with logical ratings.
    """
    print(f"Generando {num_occurrences} visitas de prueba...")
    random.seed(42)
    np.random.seed(42)
    
    # Heladerías: define weights to simulate favorites
    heladeria_ids = heladerias_df['id'].tolist()
    # Weights for each heladeria: some are very popular (e.g. Scannapieco, Antiche, Pistacchio)
    # 11 heladerias
    heladeria_weights = [0.18, 0.05, 0.15, 0.07, 0.12, 0.14, 0.04, 0.06, 0.05, 0.09, 0.05]
    # Normalize weights just in case
    total_w = sum(heladeria_weights)
    heladeria_weights = [w / total_w for w in heladeria_weights]
    
    # Categories: define typical ice cream choices weights
    # 1: Chocolate Simple, 2: Chocolate Sprinkles, 3: DDL Simple, 4: DDL Sprinkles,
    # 5: Crema Simple, 6: Crema Sprinkles, 7: Fruta Crema, 8: Fruta Agua, 9: Autor, 10: Misc
    categoria_ids = categorias_df['id'].tolist()
    categoria_weights = [0.12, 0.08, 0.15, 0.10, 0.10, 0.12, 0.08, 0.07, 0.13, 0.05]
    total_cw = sum(categoria_weights)
    categoria_weights = [cw / total_cw for cw in categoria_weights]

    # Predefine a 'quality factor' for each heladeria to make ratings consistent
    # Antiche (1): high quality (9.0 avg)
    # La Flor de Almagro (2): decent traditional (7.5 avg)
    # Scannapieco (3): outstanding traditional (9.2 avg)
    # LadobuenO (4): standard chain (7.0 avg)
    # Finde (5): hipster artisan (8.2 avg)
    # Pistacchio (6): top tier auteur (9.5 avg)
    # Vibean (7): boutique (8.0 avg)
    # Capricci (8): neighborhood typical (7.2 avg)
    # Las Malvinas (9): classical (7.8 avg)
    # Kuono (10): premium (8.5 avg)
    # Vellezo (11): hidden gem (8.6 avg)
    heladeria_quality = {
        1: 8.8, 2: 7.6, 3: 9.3, 4: 7.1, 5: 8.4,
        6: 9.6, 7: 8.1, 8: 7.3, 9: 7.8, 10: 8.6, 11: 8.7
    }
    
    occurrences = []
    start_date = datetime.now() - timedelta(days=180)
    
    for i in range(1, num_occurrences + 1):
        hel_id = np.random.choice(heladeria_ids, p=heladeria_weights)
        cat_id = np.random.choice(categoria_ids, p=categoria_weights)
        
        # Base quality
        base_rating = heladeria_quality[hel_id]
        
        # Add some random variance (-1.5 to +1.0) and clip to 1.0 - 10.0 range
        rating_taste = round(min(10.0, max(1.0, base_rating + np.random.normal(0, 0.7))), 1)
        rating_general = round(min(10.0, max(1.0, base_rating - 0.2 + np.random.normal(0, 0.8))), 1)
        
        # Ensure they are floats
        rating_taste = float(rating_taste)
        rating_general = float(rating_general)
        
        # Date distribution in the last 6 months
        days_offset = random.randint(0, 180)
        visit_date = (start_date + timedelta(days=days_offset)).strftime("%Y-%m-%d")
        
        occurrences.append({
            "id": i,
            "fecha": visit_date,
            "heladeria_id": int(hel_id),
            "categoria_id": int(cat_id),
            "puntaje_gusto": rating_taste,
            "puntaje_general": rating_general
        })
        
    ocurrencias_df = pd.DataFrame(occurrences)
    return ocurrencias_df

def process_data(heladerias_df, categorias_df, ocurrencias_df, output_path):
    """
    Performs joins, groupings, and exports a unified static JSON database.
    """
    print("Procesando datos (joins y agrupaciones)...")
    
    # Cast column types
    heladerias_df['id'] = heladerias_df['id'].astype(int)
    categorias_df['id'] = categorias_df['id'].astype(int)
    ocurrencias_df['heladeria_id'] = ocurrencias_df['heladeria_id'].astype(int)
    ocurrencias_df['categoria_id'] = ocurrencias_df['categoria_id'].astype(int)
    
    # 1. Calculate overall visit count per heladeria
    visit_counts = ocurrencias_df.groupby('heladeria_id').size().to_dict()
    
    # 2. Join occurrences with categories to obtain MacroCategoria
    merged_df = ocurrencias_df.merge(categorias_df, left_on='categoria_id', right_on='id')
    
    # 3. Calculate mean score per macroCategoria for each heladeria
    # We use puntaje_general as the main metric for scores
    grouped = merged_df.groupby(['heladeria_id', 'macroCategoria'])['puntaje_general'].mean().reset_index()
    grouped['puntaje_general'] = grouped['puntaje_general'].round(1)
    
    # Pivot to get a dictionary of category -> score for each heladeria
    scores_dict = {}
    for _, row in grouped.iterrows():
        hel_id = int(row['heladeria_id'])
        category = str(row['macroCategoria'])
        score = float(row['puntaje_general'])
        
        if hel_id not in scores_dict:
            scores_dict[hel_id] = {}
        scores_dict[hel_id][category] = score
        
    # 4. Construct final list of heladerias
    heladerias_list = []
    for _, row in heladerias_df.iterrows():
        hel_id = int(row['id'])
        
        # Parse optional fields
        id_cadena = None
        if 'idCadena' in row and pd.notna(row['idCadena']) and str(row['idCadena']).strip() != '':
            try:
                id_cadena = int(float(row['idCadena']))
            except ValueError:
                pass
                
        # Parse active flag
        activa = True
        if 'activa' in row and pd.notna(row['activa']):
            activa = str(row['activa']).lower() in ['true', '1', 'yes', 't']
            
        visitas = visit_counts.get(hel_id, 0)
        score_by_cat = scores_dict.get(hel_id, {})
        
        heladerias_list.append({
            "id": hel_id,
            "idCadena": id_cadena,
            "nombre": str(row['nombre']),
            "direccion": str(row['direccion']),
            "lat": float(row['lat']),
            "lng": float(row['lng']),
            "barrio": str(row['barrio']) if 'barrio' in row and pd.notna(row['barrio']) else "CABA",
            "activa": activa,
            "visitas": visitas,
            "scorePorCategoria": score_by_cat
        })
        
    # Create final JSON structure
    output_data = {
        "generadoEl": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "heladerias": heladerias_list
    }
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print(f"Base de datos exportada con éxito en {output_path} ({len(heladerias_list)} heladerías)")

def main():
    parser = argparse.ArgumentParser(description="ETL Pipeline para Helado Finder CABA.")
    parser.add_argument("--mode", choices=["test", "prod"], default="test", help="Modo de ejecución: 'test' para mock local, 'prod' para Google Sheets real.")
    args = parser.parse_args()
    
    # Paths relative to project root
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    mock_dir = os.path.join(base_dir, "data_pipeline", "mock_sheets")
    
    if args.mode == "test":
        print("--- CORRIENDO PIPELINE EN MODO TEST ---")
        heladerias_path = os.path.join(mock_dir, "heladerias.csv")
        categorias_path = os.path.join(mock_dir, "categorias.csv")
        ocurrencias_path = os.path.join(mock_dir, "ocurrencias.csv")
        output_path = os.path.join(base_dir, "public", "data", "heladerias_test.json")
        
        # Load bases
        if not os.path.exists(heladerias_path) or not os.path.exists(categorias_path):
            print(f"Error: No se encuentran archivos CSV en {mock_dir}")
            sys.exit(1)
            
        heladerias_df = pd.read_csv(heladerias_path)
        categorias_df = pd.read_csv(categorias_path)
        
        # Generate mock occurrences and save CSV for completeness
        ocurrencias_df = generate_mock_occurrences(heladerias_df, categorias_df, num_occurrences=400)
        ocurrencias_df.to_csv(ocurrencias_path, index=False)
        print(f"Visitas de prueba guardadas en {ocurrencias_path}")
        
        process_data(heladerias_df, categorias_df, ocurrencias_df, output_path)
        
    elif args.mode == "prod":
        print("--- CORRIENDO PIPELINE EN MODO PRODUCCIÓN ---")
        output_path = os.path.join(base_dir, "public", "data", "heladerias_prod.json")
        
        spreadsheet_id = os.environ.get("SPREADSHEET_ID")
        credentials_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
        
        if not spreadsheet_id or not credentials_json:
            print("Error: Se requieren las variables de entorno SPREADSHEET_ID y GOOGLE_SERVICE_ACCOUNT_JSON en modo producción.")
            sys.exit(1)
            
        try:
            import gspread
            from google.oauth2.service_account import Credentials
            
            scopes = [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ]
            
            creds_dict = json.loads(credentials_json)
            creds = Credentials.from_service_account_info(creds_dict, scopes=scopes)
            gc = gspread.authorize(creds)
            
            print(f"Conectando a Google Sheets con ID: {spreadsheet_id}...")
            sh = gc.open_by_key(spreadsheet_id)
            
            # Fetch worksheets
            print("Cargando pestañas HELADERIAS, CATEGORIAS y OCURRENCIAS...")
            heladerias_ws = sh.worksheet("HELADERIAS")
            categorias_ws = sh.worksheet("CATEGORIAS")
            ocurrencias_ws = sh.worksheet("OCURRENCIAS")
            
            # Convert to DataFrames
            heladerias_df = pd.DataFrame(heladerias_ws.get_all_records())
            categorias_df = pd.DataFrame(categorias_ws.get_all_records())
            ocurrencias_df = pd.DataFrame(ocurrencias_ws.get_all_records())
            
            # Standardize column naming if necessary, e.g. mapping snake_case/camelCase
            # Ensure required columns are present in lowercase/matching format
            # e.g., mapping "ID" -> "id", "NOMBRE" -> "nombre", etc.
            heladerias_df.columns = [c.lower() for c in heladerias_df.columns]
            categorias_df.columns = [c.lower() for c in categorias_df.columns]
            ocurrencias_df.columns = [c.lower() for c in ocurrencias_df.columns]
            
            # Standardize names
            # Map idcadena -> idCadena for compatibility with front-end
            if 'id_cadena' in heladerias_df.columns:
                heladerias_df.rename(columns={'id_cadena': 'idCadena'}, inplace=True)
            elif 'idcadena' in heladerias_df.columns:
                heladerias_df.rename(columns={'idcadena': 'idCadena'}, inplace=True)
                
            # Map macro_categoria -> macroCategoria
            if 'macro_categoria' in categorias_df.columns:
                categorias_df.rename(columns={'macro_categoria': 'macroCategoria'}, inplace=True)
            elif 'macrocategoria' in categorias_df.columns:
                categorias_df.rename(columns={'macrocategoria': 'macroCategoria'}, inplace=True)
                
            process_data(heladerias_df, categorias_df, ocurrencias_df, output_path)
            
        except Exception as e:
            print(f"Error crítico en el pipeline de producción: {str(e)}")
            sys.exit(1)

if __name__ == "__main__":
    main()
