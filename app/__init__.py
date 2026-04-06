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
from app.resources.follows import FollowsAPI
from app.resources.savedWorkouts import SavedWorkoutsAPI
from app.resources.sharedWorkouts import SharedWorkoutsAPI
from app.resources.savedSchedules import SavedSchedulesAPI
from app.resources.sharedSchedules import SharedSchedulesAPI

api.add_resource(UsersAPI, '/api/users', '/api/users/<string:userID>', '/api/users/username/<string:username>')

api.add_resource(SchedulesAPI, '/api/schedules', '/api/schedules/<string:scheduleID>', '/api/schedules/name/<string:scheduleName>')

api.add_resource(FollowsAPI, '/api/follow', '/api/followed/<string:followedID>', '/api/follower/<string:followerID>' , '/api/followed/<string:followedID>/follower/<string:followerID>')

api.add_resource(SavedWorkoutsAPI, '/api/savedworkouts', '/api/savedworkouts/<string:workoutID>', '/api/savedworkouts/userID/<string:userID>')

api.add_resource(SavedSchedulesAPI, '/api/savedschedules', '/api/savedschedules/<string:scheduleID>', '/api/savedschedules/userID/<string:userID>')

api.add_resource(SharedWorkoutsAPI, '/api/sharedworkouts', '/api/sharedworkouts/<string:workoutID>', '/api/sharedworkouts/authorUsername/<string:authorUsername>', '/api/sharedworkouts/workoutName/<string:workoutName>', '/api/sharedworkouts/workoutName/<string:workoutName>/userID/<string:userID>')

api.add_resource(SharedSchedulesAPI, '/api/sharedschedules', '/api/sharedschedules/<string:scheduleID>', '/api/sharedschedules/authorUsername/<string:authorUsername>', '/api/sharedschedules/scheduleName/<string:scheduleName>', '/api/sharedschedules/scheduleName/<string:scheduleName>/userID/<string:userID>')

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