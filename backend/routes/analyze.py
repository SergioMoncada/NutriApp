from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from services.vision_service import identificar_alimento
from services.nutrition_service import obtener_nutricion
from services.recipe_service import obtener_recetas  # ← NUEVO
from database.connection import get_db
from routes.models import User
from pydantic import BaseModel

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    password: str

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

@router.post("/analyze")
async def analizar(
    imagen: UploadFile = File(...),
    username: str = None,
    db: Session = Depends(get_db)
):
    # 1. Leer bytes de la imagen
    bytes_imagen = await imagen.read()
    
    # 2. Identificar el alimento
    nombre = await identificar_alimento(bytes_imagen)
    
    # 3. Obtener datos nutricionales
    nutricion = await obtener_nutricion(nombre)
    
    # 4. Obtener recetas sugeridas con IA ← NUEVO
    recetas = await obtener_recetas(nombre)
    
    # 5. Guardar en historial si hay usuario logueado
    if username:
        usuario = db.query(User).filter(User.username == username).first()
        if usuario:
            db.execute(
                text("""
                    INSERT INTO historial_alimentos 
                    (usuario_id, nombre_alimento, calorias, proteinas, carbohidratos, grasas)
                    VALUES (:uid, :nombre, :cal, :prot, :carbs, :grasas)
                """),
                {
                    "uid": usuario.id,
                    "nombre": nombre,
                    "cal": nutricion.get("calorias", 0),
                    "prot": nutricion.get("proteinas", 0),
                    "carbs": nutricion.get("carbohidratos", 0),
                    "grasas": nutricion.get("grasas", 0)
                }
            )
            db.commit()
    
    # 6. Retornar todo junto
    return {
        "alimento_detectado": nombre,
        "nutricion": nutricion,
        "recetas": recetas  # ← NUEVO
    }

@router.get("/historial/{username}")
def obtener_historial(username: str, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.username == username).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    registros = db.execute(
        text("""
            SELECT nombre_alimento, calorias, proteinas, 
                   carbohidratos, grasas, analizado_en
            FROM historial_alimentos
            WHERE usuario_id = :uid
            ORDER BY analizado_en DESC
        """),
        {"uid": usuario.id}
    ).fetchall()
    
    return {
        "historial": [
            {
                "nombre": r[0],
                "calorias": r[1],
                "proteinas": r[2],
                "carbohidratos": r[3],
                "grasas": r[4],
                "fecha": str(r[5])
            }
            for r in registros
        ]
    }