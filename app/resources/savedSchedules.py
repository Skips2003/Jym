from bson import ObjectId, json_util
from app import mongo
from flask import request
from flask_restful import Resource
from app.resources.auth import validateRequest
from app.models import SavedSchedules
import json

# Add options for filtering the output e.g. just return the different exercises or just the name and description

class SavedSchedulesAPI(Resource): 
    @validateRequest
    def get(self, scheduleID=None, userID=None):
 
        # Return users that have saved the schedule
        if scheduleID:
            users = list(mongo.db.SavedSchedules.find({"scheduleID": scheduleID}))
            if not users:
                return {"error": "users not found"}, 404
            return json.loads(json_util.dumps(users)), 200
        
        # Return all schedules saved by a user
        if userID:
            schedules = list(mongo.db.SavedSchedules.find({"userID": userID}))
            if not schedules:
                return {"error": "schedules not found"}, 404
            return json.loads(json_util.dumps(schedules)), 200
        
        # Return specific schedule saved by user
        if userID and scheduleID:
            schedule = mongo.db.SavedSchedules.find_one({"userID": userID, "scheduleID": scheduleID})
            if not schedule:
                return {"error": "schedules not found"}, 404
            return json.loads(json_util.dumps(schedule)), 200
 
        return {"error": "No valid query parameters provided"}, 400

    @validateRequest
    def post(self, scheduleID=None, userID=None):
        data = request.json

        if not scheduleID:
            scheduleID = data.get("scheduleID")
        if not userID:
            userID = data.get("userID")
 
        if not userID:
            return {"error": "No userID provided."}, 400
        
        if not scheduleID:
            return {"error": "No scheduleID provided."}, 400

 
        # add validation that keys in data.get("days") are valid day names and that exercise IDs exist in the Workouts collection
 
        result = mongo.db.SavedSchedules.insert_one(
            SavedSchedules(
                userID=userID,
                scheduleID=ObjectId(scheduleID)
            )
        )
 
        return {"message": "Schedule added successfully!", "_id": str(result.inserted_id)}, 201
 
    @validateRequest
    def delete(self, scheduleID=None, userID=None):
        data = request.json
 
        if not scheduleID:
            scheduleID = data.get("scheduleID")

        if not userID:
            userID = data.get("userID")
 
        if not userID:
            return {"error": "No userID provided."}, 400
        
        if not scheduleID:
            return {"error": "No scheduleID provided."}, 400
 
        schedule = mongo.db.SavedSchedules.find_one({"scheduleID": ObjectId(scheduleID), "userID": userID})
 
        if not schedule:
            return {"error": "Schedule not found."}, 404
 
        print("Deleting schedule ID: %s, name: %s", scheduleID, schedule.get("name"))
 
        mongo.db.SavedSchedules.delete_one({"scheduleID": ObjectId(scheduleID), "userID": userID})
 
        return {"message": "Schedule deleted successfully!"}, 200