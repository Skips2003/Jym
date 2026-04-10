from bson import ObjectId, json_util
from app import mongo
from flask import request
from flask_restful import Resource
from app.resources.auth import validateRequest
from app.models import SavedWorkouts, Users, SharedWorkouts
import json

# Add options for filtering the output e.g. just return the different exercises or just the name and description

class SavedWorkoutsAPI(Resource):
    @validateRequest
    def get(self, workoutID=None, userID=None):
 
        # Return users that have saved the workout
        if workoutID:
            users = list(mongo.db.SavedWorkouts.find({"workoutID": workoutID}))
            if not users:
                return {"error": "users not found"}, 404
            return json.loads(json_util.dumps(users)), 200
        
        # Return all workouts saved by a user
        if userID:
            workouts = list(mongo.db.SavedWorkouts.find({"userID": userID}))
            if not workouts:
                return {"error": "workouts not found"}, 404
            return json.loads(json_util.dumps(workouts)), 200
        
        # Return specific workout saved by user
        if userID and workoutID:
            workout = mongo.db.SavedWorkouts.find_one({"userID": userID, "workoutID": workoutID})
            if not workout:
                return {"error": "workouts not found"}, 404
            return json.loads(json_util.dumps(workout)), 200
 
        return {"error": "No valid query parameters provided"}, 400

    @validateRequest
    def post(self, workoutID=None, userID=None):
        data = request.json

        if not workoutID:
            workoutID = data.get("WorkoutID")
        if not userID:
            userID = data.get("userID")
 
        if not userID:
            return {"error": "No userID provided."}, 400
        
        if not workoutID:
            return {"error": "No WorkoutID provided."}, 400
        
        print(userID, workoutID)

        if not SharedWorkouts.checkSharedWorkout(workoutID):
                return {"error": "Workout not found"}, 404
        
        if not Users.checkUser(userID):
                return {"error": "User not found"}, 404
 
        result = mongo.db.SavedWorkouts.insert_one(
            SavedWorkouts(
                userID=userID,
                workoutID=ObjectId(workoutID)
            )
        )

        print(result)
 
        return {"message": "Workout added successfully!", "_id": str(result.inserted_id)}, 201
 
    @validateRequest
    def delete(self, workoutID=None, userID=None):
        data = request.json
 
        if not workoutID:
            workoutID = data.get("workoutID")

        if not userID:
            userID = data.get("userID")
 
        if not userID:
            return {"error": "No userID provided."}, 400
        
        if not workoutID:
            return {"error": "No WorkoutID provided."}, 400
 
        workout = mongo.db.SavedWorkouts.find_one({"WorkoutID": ObjectId(workoutID), "userID": userID})
 
        if not workout:
            return {"error": "Workout not found."}, 404
 
        print("Deleting Workout ID: %s, name: %s", workoutID, workout.get("name"))
 
        mongo.db.SavedWorkouts.delete_one({"WorkoutID": ObjectId(workoutID), "userID": userID})
 
        return {"message": "Workout deleted successfully!"}, 200