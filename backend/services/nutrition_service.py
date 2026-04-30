import httpx, os
from dotenv import load_dotenv
load_dotenv()

async def obtener_nutricion(nombre: str) -> dict:
    params = {
        "query": nombre,
        "api_key": os.getenv("USDA_API_KEY"),
        "pageSize": 1
    }
    async with httpx.AsyncClient() as client:
        r = await client.get("https://api.nal.usda.gov/fdc/v1/foods/search", params=params)
    datos = r.json()
    if not datos["foods"]:
        return {"error": "No encontrado"}
    a = datos["foods"][0]
    n = {x["nutrientName"]: x["value"] for x in a.get("foodNutrients", [])}
    return {
        "nombre": a["description"],
        "calorias": n.get("Energy", 0),
        "proteinas": n.get("Protein", 0),
        "carbohidratos": n.get("Carbohydrate, by difference", 0),
        "grasas": n.get("Total lipid (fat)", 0)
    }