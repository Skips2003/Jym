import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres.fmaardssmnspsgitsgsm:Gdog5tkopFTvivW@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require'
    MONGO_URI = 'mongodb+srv://Jonny:migratioNdb1907@cluster0.ddpf9wk.mongodb.net/StrengthTrackerSchedules?appName=Cluster0'