from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_pymongo import PyMongo
from flask_restful import Api
from flask_wtf import CSRFProtect

db = SQLAlchemy()
bcrypt = Bcrypt()
loginManager = LoginManager()
mongo = PyMongo()
api = Api()
csrf = CSRFProtect()

# adding API resources
from app.resources.users import UsersAPI
from app.resources.schedules import SchedulesAPI
from app.resources.workouts import WorkoutsAPI

api.add_resource(UsersAPI, '/api/users', '/api/users/<string:userID>', '/api/users/username/<string:username>')
api.add_resource(SchedulesAPI, '/api/schedules', '/api/schedules/<string:scheduleID>', '/api/schedules/name/<string:scheduleName>')
api.add_resource(WorkoutsAPI, '/api/workouts', '/api/workouts/<string:workoutID>', '/api/workouts/name/<string:workoutName>')

def createApp(configClass = Config):
    app = Flask(__name__)
    app.config.from_object(configClass)
    db.init_app(app)
    bcrypt.init_app(app)
    mongo.init_app(app)
    api.init_app(app)
    csrf.init_app(app)


    loginManager.init_app(app)
    loginManager.login_view = "main.signIn"

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    return app

from app import models