from sqlalchemy import create_engine
# Importa la función create_engine de SQLAlchemy, que crea la conexión a la base de datos.

from sqlalchemy.orm import sessionmaker, declarative_base
# Importa sessionmaker para generar sesiones de base de datos y declarative_base para definir modelos ORM.

from dotenv import load_dotenv
# Importa load_dotenv para cargar variables de entorno desde un archivo .env.

import os
# Importa el módulo os para acceder a variables de entorno y otras funciones del sistema.

load_dotenv()
# Carga las variables definidas en el archivo .env al entorno de la aplicación.

engine = create_engine(os.getenv("DATABASE_URL"))
# Crea el motor de base de datos usando la URL almacenada en la variable de entorno DATABASE_URL.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Crea una clase de sesión configurada para la base de datos:
# - autocommit=False: no hace commit automático
# - autoflush=False: no sincroniza automáticamente cambios pendientes
# - bind=engine: usa el motor creado arriba.

Base = declarative_base()
# Crea una clase base para los modelos ORM; los modelos heredarán de esta clase.

def get_db():
    db = SessionLocal()
    # Crea una nueva sesión de base de datos a partir de SessionLocal.
    try:
        yield db
        # Devuelve la sesión al caller como generador/contexto.
    finally:
        db.close()
        # Cierra la sesión cuando termina el uso, liberando recursos.