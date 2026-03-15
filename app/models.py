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
    public: so.Mapped[bool]
    bio: so.Mapped[str] = so.mapped_column(sa.String(300))
    dateJoined: so.Mapped[str] = so.mapped_column(sa.String(300))
    followers: so.Mapped[int]
    following: so.Mapped[int]
    currentScheduleID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Schedules.id"))
    sessionsInRow: so.Mapped[int]
    bigThreeTotal: so.Mapped[int]
    quickStatThree: so.Mapped[int]
    benchPress: so.Mapped[int]
    deadLift: so.Mapped[int]
    squat: so.Mapped[int]

class Schedules(db.Model):

    __tablename__ = 'Schedules'

    id: so.Mapped[int] = so.mapped_column(primary_key=True, unique=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True)
    description: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256))
    public: so.Mapped[bool]

    days = db.relationship('ScheduleDays')

class Workouts(db.Model):

    __tablename__ = 'Workouts'

    id: so.Mapped[int] = so.mapped_column(primary_key=True, unique=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True)
    description: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True)
    public: so.Mapped[bool]

    days = db.relationship('ScheduleDays')

class Exercises(db.Model):

    __tablename__ = 'Exercises'

    id: so.Mapped[int] = so.mapped_column(primary_key=True, unique=True)
    exerciseName: so.Mapped[str]
    reps: so.Mapped[int]
    sets: so.Mapped[int]
    weight: so.Mapped[int]
    primaryMuscles: so.Mapped[str]
    secondaryMuscles: so.Mapped[str]

class ScheduleDays(db.Model):

    __tablename__ = 'ScheduleDays'

    scheduleID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Schedules.id"), primary_key=True)
    workoutID: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Workouts.id"), primary_key=True)
    day: so.Mapped[int]

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