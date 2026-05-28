import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Inicializar el cliente de OpenAI con la API key del .env
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def obtener_recetas(nombre_alimento: str) -> list:
    """
    Recibe el nombre de un alimento y retorna 3 sugerencias
    de recetas usando ChatGPT.
    """
    try:
        # Hacer la petición a ChatGPT
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Modelo básico y económico
            messages=[
                {
                    "role": "system",
                    # Le decimos a la IA cómo debe responder
                    "content": "Eres un chef experto. Cuando te den un alimento, responde SOLO con una lista de 3 recetas simples en español, separadas por punto y coma. Sin explicaciones, solo los nombres. Ejemplo: Ensalada César;Sopa de tomate;Pizza margherita"
                },
                {
                    "role": "user",
                    "content": f"Dame 3 recetas con: {nombre_alimento}"
                }
            ],
            max_tokens=100,  # Límite de tokens para ahorrar créditos
            temperature=0.7  # Creatividad media
        )
        
        # Extraer el texto de la respuesta
        texto = response.choices[0].message.content
        
        # Separar las recetas por punto y coma y limpiar espacios
        recetas = [r.strip() for r in texto.split(";")]
        
        return recetas
        
    except Exception as e:
        # Si hay error retornar recetas genéricas
        print(f"Error OpenAI: {e}")
        return [
            f"Ensalada con {nombre_alimento}",
            f"Sopa de {nombre_alimento}",
            f"{nombre_alimento} al horno"
        ]   