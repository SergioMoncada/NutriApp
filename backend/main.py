from fastapi import FastAPI
from routes.analyze import router

app = FastAPI(title="NutriApp API")
app.include_router(router)

@app.get("/")
def inicio():
    return {"mensaje": "NutriApp backend funcionando"}