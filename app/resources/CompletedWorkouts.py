from datetime import datetime, timezone
from bson import ObjectId, json_util
from app import mongo
from flask import request
from flask_restful import Resource
from flask_login import current_user
from app.resources.auth import validateRequest
from app.models import SharedWorkouts, Users, Follows, CompletedWorkouts
import json

class CompletedWorkoutsAPI(Resource):
    @validateRequest
    def get(self, workoutID=None, userID=None):
        searchQuery = {}
        
        if userID:
            searchQuery["userID"] = userID
        elif not current_user.admin:
            searchQuery["userID"] = current_user.id

        if workoutID:
            searchQuery["_id"] = ObjectId(workoutID)
            workout = mongo.db.CompletedWorkouts.find_one(searchQuery)
            if not workout:
                return {"error": "Workout not found"}, 404
            return json.loads(json_util.dumps(workout)), 200

        workouts = list(mongo.db.CompletedWorkouts.find(searchQuery).sort("dateCompleted", -1))
        return json.loads(json_util.dumps(workouts)), 200

    @validateRequest
    def post(self, userID=None):
        data = request.json

        if not userID:
            userID = data.get("userID")

        newCompletedWorkout = {
            "userID": userID,
            "name": data.get("name", "Unnamed Workout"),
            "description": data.get("description", ""),
            "exercises": data.get("exercises", []),
            "dateCompleted": datetime.now()
        }

        exists = mongo.db.CompletedWorkouts.find_one({
            "userID": newCompletedWorkout["userID"],
            "name": newCompletedWorkout["name"],
            "exercises": newCompletedWorkout["exercises"]
        })

        if exists:
            time_diff = datetime.now() - exists["dateCompleted"]
            if time_diff.total_seconds() < 60:
                return {"error": "This workout was just logged recently."}, 400

        result = mongo.db.CompletedWorkouts.insert_one(newCompletedWorkout)
        
        return {
            "message": "Workout completion logged!", 
            "_id": str(result.inserted_id),
            "dateCompleted": newCompletedWorkout["dateCompleted"].isoformat()
        }, 201

    @validateRequest
    def delete(self, workoutID=None):
        if not workoutID:
            return {"error": "workoutID required for deletion."}, 400

        query = {"_id": ObjectId(workoutID)}
        if not current_user.admin:
            query["userID"] = str(current_user.id)

        result = mongo.db.CompletedWorkouts.delete_one(query)

        if result.deleted_count == 0:
            return {"error": "Record not found or unauthorised."}, 404

        return {"message": "Completed workout record deleted."}, 200