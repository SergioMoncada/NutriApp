import httpx, os
# Importa httpx para hacer peticiones HTTP asíncronas y os para leer variables de entorno.

from dotenv import load_dotenv
# Importa load_dotenv para cargar variables de entorno desde el archivo .env.

load_dotenv()
# Carga el archivo .env para que las variables estén disponibles en os.getenv.

async def obtener_nutricion(nombre: str) -> dict:
    # Define una función asíncrona que recibe el nombre de un alimento y devuelve un diccionario.
    params = {
        "query": nombre,
        "api_key": os.getenv("USDA_API_KEY"),
        "pageSize": 1
    }
    # Prepara los parámetros para la consulta a la API:
    # - query: nombre del alimento
    # - api_key: clave de la API tomada de la variable de entorno
    # - pageSize: número de resultados a devolver

    async with httpx.AsyncClient() as client:
        r = await client.get("https://api.nal.usda.gov/fdc/v1/foods/search", params=params)
    # Abre un cliente HTTP asíncrono, hace la petición GET a la API de búsqueda de alimentos
    # y guarda la respuesta en r.

    datos = r.json()
    # Convierte la respuesta JSON en un diccionario de Python.

    if not datos["foods"]:
        return {"error": "No encontrado"}
    # Si la API no devuelve alimentos, retorna un diccionario con un error.

    a = datos["foods"][0]
    # Toma el primer alimento de la lista de resultados.

    n = {x["nutrientName"]: x["value"] for x in a.get("foodNutrients", [])}
    # Construye un diccionario donde la clave es el nombre del nutriente y el valor es su cantidad.

    return {
        "nombre": a["description"],
        "calorias": n.get("Energy", 0),
        "proteinas": n.get("Protein", 0),
        "carbohidratos": n.get("Carbohydrate, by difference", 0),
        "grasas": n.get("Total lipid (fat)", 0)
    }
    # Devuelve un diccionario con la descripción del alimento y los valores nutricionales principales.