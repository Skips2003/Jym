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
    currentScheduleID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Schedules.id"), default=None)
    sessionsInRow: so.Mapped[int] = so.mapped_column(default=0)
    bigThreeTotal: so.Mapped[int] = so.mapped_column(default=0)
    quickStatThree: so.Mapped[int] = so.mapped_column(default=0)
    benchPress: so.Mapped[int] = so.mapped_column(default=0)
    deadLift: so.Mapped[int] = so.mapped_column(default=0)
    squat: so.Mapped[int] = so.mapped_column(default=0)

class Schedules(db.Model):

    __tablename__ = 'Schedules'

    id: so.Mapped[int] = so.mapped_column(primary_key=True, unique=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True)
    description: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256))
    public: so.Mapped[bool] = so.mapped_column(default=True)

    days = db.relationship('ScheduleDays')

class Workouts(db.Model):

    __tablename__ = 'Workouts'

    id: so.Mapped[int] = so.mapped_column(primary_key=True, unique=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True)
    description: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True)
    public: so.Mapped[bool] = so.mapped_column(default=True)

    days = db.relationship('ScheduleDays')

class Exercises(db.Model):

    __tablename__ = 'Exercises'

    id: so.Mapped[int] = so.mapped_column(primary_key=True, unique=True)
    exerciseSearchID: so.Mapped[str]
    reps: so.Mapped[int] = so.mapped_column(default=0)
    sets: so.Mapped[int] = so.mapped_column(default=0)
    weight: so.Mapped[int] = so.mapped_column(default=0)

class ScheduleDays(db.Model):

    __tablename__ = 'ScheduleDays'

    scheduleID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Schedules.id"), primary_key=True)
    workoutID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Workouts.id"), primary_key=True)
    day: so.Mapped[int] = so.mapped_column(default=0)

    schedule = db.relationship('Schedules')
    workout = db.relationship('Workouts')

class WorkoutExercises(db.Model):

    __tablename__ = 'WorkoutExercises'

    workoutID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Workouts.id"), primary_key=True)
    exerciseID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Exercises.id"), primary_key=True)

class SavedSchedules(db.Model):

    __tablename__ = 'SavedSchedules'

    userID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Users.id"), primary_key=True)
    scheduleID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Schedules.id"), primary_key=True)

class BookmarkedSchedules(db.Model):

    __tablename__ = 'BookmarkedSchedules'

    userID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Users.id"), primary_key=True)
    scheduleID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Schedules.id"), primary_key=True)

class SavedWorkouts(db.Model):

    __tablename__ = 'SavedWorkouts'

    userID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Users.id"), primary_key=True)
    workoutID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Schedules.id"), primary_key=True)

class BookmarkedWorkouts(db.Model):

    __tablename__ = 'BookmarkedWorkouts'

    userID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Users.id"), primary_key=True)
    workoutID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Schedules.id"), primary_key=True)