from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from services.vision_service import identificar_alimento
from services.nutrition_service import obtener_nutricion
from database.connection import get_db
from routes.models import User
from pydantic import BaseModel

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    password: str

@router.post("/analyze")
async def analizar(imagen: UploadFile = File(...)):
    bytes_imagen = await imagen.read()
    nombre = await identificar_alimento(bytes_imagen)
    nutricion = await obtener_nutricion(nombre)
    return {"alimento_detectado": nombre, "nutricion": nutricion}

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Este email ya está registrado")
    new_user = User(username=user.username, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Usuario guardado"}

@router.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.username == user.username).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if usuario.password != user.password:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    return {"message": "Login exitoso", "username": usuario.username}