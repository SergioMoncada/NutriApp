from fastapi import FastAPI
from routes.analyze import router
from routes.models import User
from database.connection import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NutriApp API")
app.include_router(router)

@app.get("/")
def inicio():
    return {"mensaje": "NutriApp backend funcionando"}