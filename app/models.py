from typing import Optional
from flask_login import UserMixin
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import db
from typing import TypedDict
from bson import ObjectId

# Postgres Database Models (using SQLAlchemy, not MongoDB)
# Database rules if you are adding code that uses them!
# Users - all self explanitory, schedule default is a empty schedule which should not be edited!
# Follows - followedID is the person who is being followed followerID is the person who is following! isFollowing allows you to check if a user is following another and returns True/False bool
# APIKey - standard i think i got it from the lab sheets
# Exercises - self explanitory, searchID is the ID returned from the externalAPI so we can easily access what was searched again! undecided on weight catagory so far but will figure it out
# Workouts - array of exercises will have a cap of eight soon but not yet!
# Schedules - this only contains users current schedules! the idea is to prevent redundant schedules which cannot be accessed (not shared or saved). Format of days is an object with fields "Monday" - "Sunday" which contain embeded Workouts
# SharedSchedules/Workouts - same as non shared versions but they contain the authorusername (person who shared it) and private (private means it is saved on the users accouant for just them and not shared) 
# SavedSchedules/Workouts - each contain the userID of the person who saved it and the objectId of the object they are saving!

class Users(db.Model, UserMixin):
    
    __tablename__ = 'Users'

    id: so.Mapped[int] = so.mapped_column(sa.Integer,primary_key=True, unique=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), unique=True)
    password: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256))
    firstName: so.Mapped[str] = so.mapped_column(sa.String(64))
    lastName: so.Mapped[str] = so.mapped_column(sa.String(64))
    username: so.Mapped[str] = so.mapped_column(sa.String(64), unique=True)
    private: so.Mapped[bool] = so.mapped_column(sa.Integer, default=False)
    bio: so.Mapped[str] = so.mapped_column(sa.String(300), default='Default-Bio')
    followers: so.Mapped[int] = so.mapped_column(sa.Integer, default=0)
    following: so.Mapped[int] = so.mapped_column(sa.Integer, default=0)
    currentScheduleID: so.Mapped[str] = so.mapped_column(sa.String, default="69c44bc4735131196e47244d")
    sessionsInRow: so.Mapped[int] = so.mapped_column(sa.Integer, default=0)
    benchPress: so.Mapped[int] = so.mapped_column(sa.Integer, default=0)
    deadLift: so.Mapped[int] = so.mapped_column(sa.Integer, default=0)
    squat: so.Mapped[int] = so.mapped_column(sa.Integer, default=0)
    admin: so.Mapped[bool] = so.mapped_column(sa.Integer, default=False)
    reports: so.Mapped[int] = so.mapped_column(sa.Integer, default=0)

class Follows(db.Model, UserMixin):
    
    __tablename__ = 'follows'

    followedID: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey("Users.id"),primary_key=True)
    followerID: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey("Users.id"),primary_key=True)

    def is_following(follower_id, followed_id):
        # Create the existence criteria
        stmt = sa.select(sa.exists().where(
            Follows.followerID == follower_id,
            Follows.followedID == followed_id
        ))
        
        # Execute and get the scalar boolean result
        return db.session.scalar(stmt)

class APIKey(db.Model):

    __tablename__ = 'apiKeys'

    id: so.Mapped[int] = so.mapped_column(sa.Integer, primary_key=True, unique=True)
    key: so.Mapped[str] = so.mapped_column(sa.String(64), unique=True, nullable=False)
    owner: so.Mapped[str] = so.mapped_column(sa.String(50), nullable=False)
    request_count: so.Mapped[int] = so.mapped_column(sa.Integer, default=0)
    rate_limit: so.Mapped[int] = so.mapped_column(sa.Integer, default=100)

# MongoDB Models (using PyMongo, not SQLAlchemy)

class Exercise(TypedDict):
    name: str
    reps: int
    sets: int
    weight: int
    searchID: str


class Workouts(TypedDict):
    name: str
    description: str
    exercises: list[Exercise]


class Days(TypedDict):
    Monday: Workouts
    Tuesday: Workouts
    Wednesday: Workouts
    Thursday: Workouts
    Friday: Workouts
    Saturday: Workouts
    Sunday: Workouts

class Schedules(TypedDict):
    _id: ObjectId
    name: str
    description: str
    days: Days

class SavedWorkouts(TypedDict):
    userID: str
    workoutID: ObjectId

class SharedWorkouts(TypedDict):
    _id: ObjectId
    authorUsername: str
    private: bool
    name: str
    description: str
    exercises: list[Exercise]

class SavedSchedules(TypedDict):
    userID: str
    scheduleID: ObjectId

class SharedSchedules(TypedDict):
    _id: ObjectId
    authorUsername: str
    private: bool
    name: str
    description: str
    days: Days