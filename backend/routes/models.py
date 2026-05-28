from sqlalchemy import Column, String, Boolean, DateTime
# Importa los tipos de columna básicos de SQLAlchemy.

from sqlalchemy.dialects.postgresql import UUID
# Importa el tipo UUID específico de PostgreSQL.

from database.connection import Base
# Importa la clase base declarativa usada para definir modelos ORM.

from datetime import datetime
# Importa datetime para establecer valores por defecto de fecha y hora.

import uuid
# Importa el módulo uuid para generar identificadores únicos.

class User(Base):
    __tablename__ = "users"
    # Define el nombre de la tabla en la base de datos.

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Columna UUID primaria con valor por defecto generado automáticamente.

    username   = Column(String(255), unique=True, nullable=False)
    # Columna para el nombre de usuario, único y obligatorio.

    password   = Column(String(255), nullable=False)
    # Columna para la contraseña del usuario, obligatoria.

    is_active  = Column(Boolean, default=True)
    # Columna booleana que indica si el usuario está activo (por defecto True).

    created_at = Column(DateTime, default=datetime.utcnow)
    # Columna de fecha de creación, con valor por defecto la hora UTC actual.