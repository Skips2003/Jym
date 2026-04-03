from bson import ObjectId
from app import mongo
from flask import jsonify, request
from flask_restful import Resource
from app.resources.auth import validateRequest
from app.models import SavedWorkouts

# Add options for filtering the output e.g. just return the different exercises or just the name and description

class SavedSchedulesAPI(Resource):
    pass