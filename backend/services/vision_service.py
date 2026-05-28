import httpx, os, base64
# Importa httpx para peticiones HTTP asíncronas, os para leer variables de entorno,
# y base64 para codificar la imagen en Base64.

from dotenv import load_dotenv
# Importa load_dotenv para cargar variables de entorno desde un archivo .env.

load_dotenv()
# Carga las variables del archivo .env en el entorno de ejecución.

CLARIFAI_USER_ID = "26d003uwatbx"
# Define el ID de usuario de Clarifai que se usa en la solicitud.

CLARIFAI_APP_ID = "nutriapp"
# Define el ID de la aplicación de Clarifai.

async def traducir_alimento(nombre_ingles: str) -> str:
    """
    Traduce el nombre del alimento del inglés al español
    usando un diccionario básico. Si no está en el diccionario
    lo retorna tal cual.
    """
    traducciones = {
        "apple": "manzana",
        "banana": "banano",
        "orange": "naranja",
        "shrimp": "camarón",
        "fish": "pescado",
        "chicken": "pollo",
        "beef": "carne de res",
        "pork": "cerdo",
        "rice": "arroz",
        "bread": "pan",
        "egg": "huevo",
        "milk": "leche",
        "cheese": "queso",
        "tomato": "tomate",
        "lettuce": "lechuga",
        "potato": "papa",
        "carrot": "zanahoria",
        "onion": "cebolla",
        "garlic": "ajo",
        "pizza": "pizza",
        "pasta": "pasta",
        "soup": "sopa",
        "salad": "ensalada",
        "burger": "hamburguesa",
        "sandwich": "sándwich",
        "sushi": "sushi",
        "taco": "taco",
        "chocolate": "chocolate",
        "cake": "torta",
        "cookie": "galleta",
        "coffee": "café",
        "tea": "té",
        "juice": "jugo",
        "strawberry": "fresa",
        "grape": "uva",
        "watermelon": "sandía",
        "pineapple": "piña",
        "mango": "mango",
        "avocado": "aguacate",
        "corn": "maíz",
        "broccoli": "brócoli",
        "spinach": "espinaca",
        "mushroom": "champiñón",
        "seafood": "mariscos",
        "prawn": "langostino",
        "crab": "cangrejo",
        "lobster": "langosta",
        "salmon": "salmón",
        "tuna": "atún",
        "meat": "carne",
        "steak": "bistec",
        "ham": "jamón",
        "bacon": "tocino",
        "sausage": "salchicha",
        "yogurt": "yogur",
        "butter": "mantequilla",
        "cream": "crema",
        "ice cream": "helado",
        "waffle": "waffle",
        "pancake": "panqueque",
        "oatmeal": "avena",
        "cereal": "cereal",
        "lemon": "limón",
        "lime": "lima",
        "peach": "durazno",
        "pear": "pera",
        "cherry": "cereza",
        "coconut": "coco",
        "almond": "almendra",
        "walnut": "nuez",
        "peanut": "maní",
        "bean": "frijol",
        "lentil": "lenteja",
        "chickpea": "garbanzo",
        "tofu": "tofu",
        "noodle": "fideos",
        "dumpling": "empanada",
        "ceviche": "ceviche",
        "chili": "ají",
        "basil": "albahaca",
        "pepper": "pimiento",
        "cucumber": "pepino",
        "zucchini": "calabacín",
        "eggplant": "berenjena",
    }
    
    # Buscar en el diccionario (insensible a mayúsculas)
    return traducciones.get(nombre_ingles.lower(), nombre_ingles)




async def identificar_alimento(imagen_bytes: bytes) -> str:
    imagen_b64 = base64.b64encode(imagen_bytes).decode("utf-8")
    # Convierte los bytes de la imagen a una cadena Base64 para enviarla a la API.

    headers = {
        "Authorization": f"Key {os.getenv('CLARIFAI_PAT')}",
        "Content-Type": "application/json"
    }
    # Prepara los encabezados de la petición HTTP:
    # - Authorization: usa la clave de API de Clarifai desde la variable de entorno
    # - Content-Type: indica que el cuerpo es JSON

    body = {
        "user_app_id": {
            "user_id": CLARIFAI_USER_ID,
            "app_id": CLARIFAI_APP_ID
        },
        "inputs": [{"data": {"image": {"base64": imagen_b64}}}]
    }
    # Construye el cuerpo de la solicitud para Clarifai con el ID de usuario/app
    # y la imagen codificada en Base64.

    url = "https://api.clarifai.com/v2/users/clarifai/apps/main/models/food-item-recognition/outputs"
    # URL de la API de Clarifai para el modelo de reconocimiento de alimentos.

    async with httpx.AsyncClient() as client:
        r = await client.post(url, headers=headers, json=body)
    # Envía la petición POST asíncrona a Clarifai y guarda la respuesta.

    datos = r.json()
    # Convierte la respuesta JSON a un diccionario de Python.

    print("=== RESPUESTA CLARIFAI ===")
    print(datos)
    print("=========================")
    # Imprime la respuesta recibida para depuración.

    if "status" in datos and datos["status"]["code"] != 10000:
        raise Exception(f"Error Clarifai: {datos['status']['description']}")
    # Si Clarifai responde con un código distinto a 10000, lanza una excepción.

    conceptos = datos["outputs"][0]["data"].get("concepts", [])
    # Extrae la lista de conceptos identificados en la respuesta.

    if not conceptos:
        return "alimento no identificado"
    # Si no hay conceptos identificados, retorna un mensaje de no identificación.

    nombre_ingles = conceptos[0]["name"]
    return await traducir_alimento(nombre_ingles)
    # Devuelve el nombre del primer concepto reconocido como el alimento detectado.