from typing import Optional
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import db

class Users(db.Model):

    UID: so.Mapped[int] = so.mapped_column(primary_key=True, unique=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True)
    password: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256))
    firstName: so.Mapped[str]
    lastName: so.Mapped[str]
    username: so.Mapped[str] = so.mapped_column(sa.String(64), unique=True)