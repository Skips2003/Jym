from bson import ObjectId, json_util
from app import mongo
from flask import request
from flask_restful import Resource
from flask_login import current_user
from app.resources.auth import validateRequest, webOnly
from app.models import SharedWorkouts, Users
import json

class SharedWorkoutsAPI(Resource):
    @validateRequest
    def get(self, workoutID=None, workoutName=None, authorUsername=None):
        print(workoutID)
        print(workoutName)
        print(authorUsername)
        # Return specific workout by ID
        if workoutID:
            workout = mongo.db.SharedWorkouts.find_one({"_id": ObjectId(workoutID)})
            if not workout:
                return {"error": "workout not found"}, 404
            return json.loads(json_util.dumps(workout)), 200
 
        # Return all Workouts by authorUsername only
        if authorUsername and not workoutName:
            workouts = list(mongo.db.SharedWorkouts.find({"authorUsername": authorUsername}))
            if not workouts:
                return {"error": "No workouts found for this author"}, 404
            return json.loads(json_util.dumps(workouts)), 200
 
        # Fuzzy search by workoutName only
        if workoutName and not authorUsername:
            workouts = list(mongo.db.SharedWorkouts.find({
                "name": {"$regex": workoutName, "$options": "i"}
            }))
            if not workouts:
                return {"error": "No workouts found matching that name"}, 404
            return json.loads(json_util.dumps(workouts)), 200
 
        # Fuzzy search by workoutName, filtered by authorUsername
        if authorUsername and workoutName:
            workouts = list(mongo.db.SharedWorkouts.find({
                "authorUsername": authorUsername,
                "name": {"$regex": workoutName, "$options": "i"}
            }))
            if not workouts:
                return {"error": "No workouts found for this author matching that name"}, 404
            return json.loads(json_util.dumps(workouts)), 200
 
        return {"error": "No valid query parameters provided"}, 400
 
    @validateRequest
    def post(self):
        data = request.json
 
        if not data.get("authorUsername"):
            return {"error": "No authorUsername provided."}, 400
 
        userCheck = Users.query.filter_by(username=data.get("authorUsername")).first()
        if not userCheck:
            return {"error": "Author not found."}, 404
        # validate that keys in data.get("days") are valid day names and that exercise IDs exist in the Workouts collection
 
        result = mongo.db.SharedWorkouts.insert_one(
            SharedWorkouts(
                name=data.get("name", "Default-workout"),
                description=data.get("description", "Default-workout"),
                authorUsername=data.get("authorUsername"),
                private=data.get("private", True),
                exercises=data.get("exercises", [])
            )
        )
 
        print("Adding workout:" + data.get("name") + " description: " + data.get("description"))
 
        return {"message": "workout added successfully!", "_id": str(result.inserted_id)}, 201
 
    @webOnly
    def put(self, workoutID=None):
        data = request.json
        data = data["workout"]
 
        if not workoutID:
            workoutID = data.get("_id")
 
        workout = mongo.db.SharedWorkouts.find_one({"_id": ObjectId(workoutID)})
 
        if not workout:
            return {"error": "workout not found."}, 404
 
        # ownership check — only the author can update their workout
        if workout.get("authorUsername") != current_user.username:
            return {"error": "Unauthorised."}, 403
 
        data.pop("_id", None)
 
        # single update call instead of one per field
        mongo.db.SharedWorkouts.update_one(
            {"_id": ObjectId(workoutID)},
            {"$set": data}
        )
 
        print("Updated workoutID: " + workoutID + " with data: " + data)
 
        return {"message": "workout updated successfully!"}, 200
 
    @webOnly
    def delete(self, workoutID=None):
        data = request.json
 
        if not workoutID:
            workoutID = data.get("id")
 
        workout = mongo.db.SharedWorkouts.find_one({"_id": ObjectId(workoutID)})
 
        if not workout:
            return {"error": "workout not found."}, 404
 
        # ownership check — only the author can delete their workout
        if workout.get("authorUsername") != current_user.username:
            return {"error": "Unauthorised."}, 403
 
        print("Deleting workout ID:" + workoutID + " name: " + workout.get("name"))
 
        mongo.db.SharedWorkouts.delete_one({"_id": ObjectId(workoutID)})
 
        return {"message": "workout deleted successfully!"}, 200