from typing import Optional
from flask_login import UserMixin
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import db

class Users(db.Model, UserMixin):
    
    __tablename__ = 'Users'

    id: so.Mapped[int] = so.mapped_column(primary_key=True, unique=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True)
    password: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256))
    firstName: so.Mapped[str]
    lastName: so.Mapped[str]
    username: so.Mapped[str] = so.mapped_column(sa.String(64), unique=True)
    public: so.Mapped[bool] = so.mapped_column(default=True)
    bio: so.Mapped[str] = so.mapped_column(sa.String(300), default='Default-Bio')
    followers: so.Mapped[int] = so.mapped_column(default=0)
    following: so.Mapped[int] = so.mapped_column(default=0)
    currentScheduleID: so.Mapped[str] = so.mapped_column(default="69c44bc4735131196e47244d")
    sessionsInRow: so.Mapped[int] = so.mapped_column(default=0)
    bigThreeTotal: so.Mapped[int] = so.mapped_column(default=0)
    quickStatThree: so.Mapped[int] = so.mapped_column(default=0)
    benchPress: so.Mapped[int] = so.mapped_column(default=0)
    deadLift: so.Mapped[int] = so.mapped_column(default=0)
    squat: so.Mapped[int] = so.mapped_column(default=0)