from fastapi import APIRouter, UploadFile, File
from services.vision_service import identificar_alimento
from services.nutrition_service import obtener_nutricion

router = APIRouter()

@router.post("/analyze")
async def analizar(imagen: UploadFile = File(...)):
    bytes_imagen = await imagen.read()
    nombre = await identificar_alimento(bytes_imagen)
    nutricion = await obtener_nutricion(nombre)
    return {"alimento_detectado": nombre, "nutricion": nutricion}