from fastapi import FastAPI

app = FastAPI(title="NutriApp API")

@app.get("/")
def inicio():
    return {"mensaje": "NutriApp backend funcionando"}