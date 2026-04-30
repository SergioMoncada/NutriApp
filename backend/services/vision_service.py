import httpx, os, base64
from dotenv import load_dotenv
load_dotenv()

CLARIFAI_USER_ID = "mje155424peu"
CLARIFAI_APP_ID = "nutriapp2"

async def identificar_alimento(imagen_bytes: bytes) -> str:
    imagen_b64 = base64.b64encode(imagen_bytes).decode("utf-8")
    
    headers = {
        "Authorization": f"Key {os.getenv('CLARIFAI_PAT')}",
        "Content-Type": "application/json"
    }
    body = {
        "user_app_id": {
            "user_id": CLARIFAI_USER_ID,
            "app_id": CLARIFAI_APP_ID
        },
        "inputs": [{"data": {"image": {"base64": imagen_b64}}}]
    }
    url = "https://api.clarifai.com/v2/users/clarifai/apps/main/models/food-item-recognition/outputs"
    
    async with httpx.AsyncClient() as client:
        r = await client.post(url, headers=headers, json=body)
    
    datos = r.json()
    print("=== RESPUESTA CLARIFAI ===")
    print(datos)
    print("=========================")
    
    if "status" in datos and datos["status"]["code"] != 10000:
        raise Exception(f"Error Clarifai: {datos['status']['description']}")
    
    conceptos = datos["outputs"][0]["data"].get("concepts", [])
    if not conceptos:
        return "alimento no identificado"
    
    return conceptos[0]["name"]