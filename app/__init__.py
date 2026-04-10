import secrets
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
from app.resources import users, savedSchedules, savedWorkouts, schedules, sharedSchedules, sharedWorkouts, follows, reports, CompletedWorkouts

api.add_resource(users.UsersAPI, '/api/users', '/api/users/userID/<string:userID>', '/api/users/username/<string:username>', '/api/users/userID/<string:userID>/username/<string:username>')

api.add_resource(schedules.SchedulesAPI, '/api/schedules', '/api/schedules/<string:scheduleID>', '/api/schedules/name/<string:scheduleName>')

api.add_resource(follows.FollowsAPI, '/api/follow', '/api/followed/<string:followedID>', '/api/follower/<string:followerID>')

api.add_resource(savedWorkouts.SavedWorkoutsAPI, '/api/savedworkouts', '/api/savedworkouts/<string:workoutID>', '/api/savedworkouts/userID/<string:userID>')

api.add_resource(savedSchedules.SavedSchedulesAPI, '/api/savedschedules', '/api/savedschedules/<string:scheduleID>', '/api/savedschedules/userID/<string:userID>')

api.add_resource(sharedWorkouts.SharedWorkoutsAPI, '/api/sharedworkouts', '/api/sharedworkouts/<string:workoutID>', '/api/sharedworkouts/authorUsername/<string:authorUsername>', '/api/sharedworkouts/workoutName/<string:workoutName>', '/api/sharedworkouts/userID/<string:userID>/workoutName/<string:workoutName>', '/api/sharedworkouts/userID/<string:userID>')

api.add_resource(sharedSchedules.SharedSchedulesAPI, '/api/sharedschedules', '/api/sharedschedules/<string:scheduleID>', '/api/sharedschedules/authorUsername/<string:authorUsername>', '/api/sharedschedules/scheduleName/<string:scheduleName>', '/api/sharedschedules/userID/<string:userID>/scheduleName/<string:scheduleName>', '/api/sharedschedules/userID/<string:userID>')

api.add_resource(reports.ReportsAPI, '/api/reports', '/api/reports/schedule/<string:scheduleID>', '/api/reports/user/<string:userID>', '/api/reports/workout/<string:workoutID>')

api.add_resource(CompletedWorkouts.CompletedWorkoutsAPI, '/api/completedworkouts', '/api/completedworkouts/workoutID/<string:workoutID>', '/api/completedworkouts/userID/<string:userID>', '/api/completedworkouts/workoutID/<string:workoutID>/userID/<string:userID>')

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