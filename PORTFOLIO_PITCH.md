# 🍦 Helado Finder CABA — Data Engineering & Analysis Portfolio

> *"Estando en un punto cualquiera de CABA, cansado después de trabajar... ¿a qué heladería voy minimizando la caminata pero maximizando la calidad de mi antojo?"*

Soy **Sebi**, y este es mi proyecto personal para resolver uno de los grandes problemas de la vida porteña utilizando **Datos, Ingeniería y Matemáticas**.

Bienvenido a la presentación de mi proyecto de portfolio. En lugar de utilizar datasets genéricos o de juguete (como Titanic o Iris), decidí construir un **flujo de datos (Data Pipeline) End-to-End 100% funcional y pragmático** para resolver un problema de la vida real con mis propios datos generados en vivo.

---

## 1. El Enfoque Científico: La Hipótesis
Como consumidor asiduo de helado, mantengo una bitácora de mis degustaciones. La hipótesis del proyecto es que la **satisfacción óptima** de una salida a tomar helado no depende solo de la calidad del lugar, sino de una relación de compromiso entre **Calidad** y **Fricción (Distancia)**.

### El Modelo Matemático (Scoring Ponderado)
Para recomendar la mejor opción en tiempo real (según mi antojo y ubicación GPS), diseñé un *Blend Score* que normaliza ambas variables al rango `[0, 1]` y las pondera:

```text
Score Final = (W_calidad * NormScore) + (W_distancia * NormProximidad)
```
* **`W_calidad` (70%)**: El promedio histórico de mis puntuaciones personales para el antojo seleccionado.
* **`W_distancia` (30%)**: Calculada mediante la fórmula de *Haversine* desde mi GPS actual hasta la heladería, penalizando lugares que exceden mi tolerancia máxima de caminata.

---

## 2. La Arquitectura (Simplicidad y Pragmática)

Como analista, entiendo que el mejor stack de datos no es el más complejo, sino **el más eficiente para resolver el problema**. Por eso, diseñé una arquitectura ágil, de latencia cero y con **costos de infraestructura de $0**:

1. **Ingesta de Datos (Móvil)**: Cada vez que voy a una heladería, abro un **Google Form** en mi celular y evalúo mi consumo.
2. **Almacenamiento y DW**: Los datos aterrizan inmediatamente en un **Google Sheet**, estructurado en un esquema de estrella simplificado (Heladerías, Categorías, Ocurrencias).
3. **ETL (Data Pipeline)**: Un script en **Python (con Pandas)** extrae la sábana de datos, limpia, hace los cruces (*joins*) y calcula las agregaciones históricas por categoría y por heladería.
4. **Dashboard y Consumo**: El pipeline genera un archivo JSON estático que es consumido por un Dashboard interactivo en **React (TypeScript + Vite)**. El Dashboard vive en el celular del usuario, lee las agregaciones y calcula la cercanía y el *Scoring Ponderado* en tiempo real utilizando el GPS del dispositivo.

---

## 3. ¿Por qué este proyecto me representa?

* **Data Collection Real**: No descargué un CSV de Kaggle. Yo estructuré la ingesta, defino las variables y genero la data iterativamente.
* **Foco en el Valor**: Evité montar un Apache Airflow o una base de datos relacional pesada porque el volumen y la frecuencia no lo justifican. Usar *Google Forms + Sheets + Python + React* demuestra capacidad de abstracción y pragmatismo ingenieril.
* **Data Storytelling**: El frontend no es solo una tabla; es mi *Bitácora Personal de Catador*, un Dashboard interactivo que me brinda insights reales sobre mis hábitos de consumo.

Te invito a explorar el repositorio, leer el código del pipeline de datos en Python (`data_pipeline/process_data.py`) y revisar cómo está estructurado el estado de la aplicación en React para entregar resultados matemáticos instantáneos.

*— Sebi, Data Analyst.*
