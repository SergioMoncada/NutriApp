import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def obtener_recetas(nombre_alimento: str) -> list:
    """
    Retorna 3 recetas con nombre, ingredientes y pasos de preparación.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """Eres un chef experto en cocina saludable. 
                    Cuando te den un alimento, responde ÚNICAMENTE en este formato JSON exacto, 
                    sin texto adicional, sin explicaciones, sin markdown:
                    [
                      {
                        "nombre": "Nombre de la receta",
                        "ingredientes": ["ingrediente 1", "ingrediente 2", "ingrediente 3"],
                        "pasos": ["Paso 1: instrucción", "Paso 2: instrucción", "Paso 3: instrucción"]
                      }
                    ]
                    Devuelve exactamente 3 recetas en español."""
                },
                {
                    "role": "user",
                    "content": f"Dame 3 recetas saludables con: {nombre_alimento}"
                }
            ],
            max_tokens=800,
            temperature=0.7
        )

        texto = response.choices[0].message.content.strip()
        
        # Limpiar posibles backticks de markdown si ChatGPT los agrega
        texto = texto.replace("```json", "").replace("```", "").strip()
        
        import json
        recetas = json.loads(texto)
        return recetas

    except Exception as e:
        print(f"Error OpenAI: {e}")
        # Retornar recetas genéricas si falla
        return [
            {
                "nombre": f"Ensalada con {nombre_alimento}",
                "ingredientes": [nombre_alimento, "lechuga", "tomate", "aceite de oliva"],
                "pasos": ["Lavar los ingredientes", "Cortar en trozos", "Mezclar y aliñar"]
            }
        ]