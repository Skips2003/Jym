import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:Gdog5tkopFTvivW@db.fmaardssmnspsgitsgsm.supabase.co:5432/postgres'
    MONGO_URI = 'mongodb+srv://Jonny:<passwordhere>@cluster0.ddpf9wk.mongodb.net/StrengthTrackerSchedules?appName=Cluster0'