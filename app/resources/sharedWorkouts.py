from bson import ObjectId, json_util
from app import mongo
from flask import request
from flask_restful import Resource
from flask_login import current_user
from app.resources.auth import validateRequest
from app.models import SharedWorkouts, Users, Follows
import json

class SharedWorkoutsAPI(Resource):
    @validateRequest
    def get(self, workoutID=None, workoutName=None, authorUsername=None, userID=None):
        # Private workouts only accessed if userID is provided or search is done using scheduleID
        if userID:

            print(workoutName, userID)

            user = Users.query.filter_by(id=userID).first()

            if user.admin:

                if workoutName:
                    workouts = list(mongo.db.SharedWorkouts.find({"name": {"$regex": workoutName, "$options": "i"}}))
                else:
                    workouts = list(mongo.db.SharedWorkouts.find())

                return json.loads(json_util.dumps(workouts)), 200

        # Return specific workout by ID
        if workoutID:

            workout = mongo.db.SharedWorkouts.find_one({"_id": ObjectId(workoutID)})

            if not workout:
                return {"error": "workout not found"}, 404
            
            return json.loads(json_util.dumps(workout)), 200
 
        # Return all Workouts by authorUsername only
        if authorUsername and not workoutName:

            workouts = list(mongo.db.SharedWorkouts.find({"authorUsername": authorUsername}))

            for workout in workouts:

                if workout["private"]:

                    workouts.remove(workout)

                elif userID:

                    author = Users.query.filter_by(username=workout["authorUsername"]).first()

                    if author.private and not Follows.is_following(userID, author.id):
                        workouts.remove(workout)

                else:
                    workouts.remove(workout)

            if not workouts:
                return {"error": "No workouts found for this author"}, 404
            
            return json.loads(json_util.dumps(workouts)), 200
 
        # Fuzzy search by workoutName only
        if workoutName and not authorUsername:

            workouts = list(mongo.db.SharedWorkouts.find({
                "name": {"$regex": workoutName, "$options": "i"}
            }))

            for workout in workouts:

                if workout["private"]:

                    workouts.remove(workout)

                elif userID:

                    author = Users.query.filter_by(username=workout["authorUsername"]).first()

                    if author.private and not Follows.is_following(userID, author.id):
                        workouts.remove(workout)

                else:
                    workouts.remove(workout)

            if not workouts:
                return {"error": "No workouts found matching that name"}, 404
            
            return json.loads(json_util.dumps(workouts)), 200
 
        # Fuzzy search by workoutName, filtered by authorUsername
        if authorUsername and workoutName:

            workouts = list(mongo.db.SharedWorkouts.find({
                "authorUsername": authorUsername,
                "name": {"$regex": workoutName, "$options": "i"}
            }))

            for workout in workouts:

                if workout["private"]:

                    workouts.remove(workout)

                elif userID:

                    author = Users.query.filter_by(username=workout["authorUsername"]).first()

                    if author.private and not Follows.is_following(userID, author.id):
                        workouts.remove(workout)

                else:
                    workouts.remove(workout)

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
 
        newWorkout = SharedWorkouts(
                name=data.get("name", "Default-Workout"),
                description=data.get("description", "Default-Workout"),
                authorUsername=data.get("authorUsername"),
                private=data.get("private", Users.query.filter_by(username=data.get("authorUsername")).first().private),
                exercises=data.get("exercises", [])
            )
        
        checkIfDuplicate = mongo.db.SharedWorkouts.find_one(newWorkout)

        if checkIfDuplicate:
            return {"error": "Workout with those details already exists!"}, 404
 
        result = mongo.db.SharedWorkouts.insert_one(newWorkout)
 
        print("Adding workout:" + data.get("name") + " description: " + data.get("description"))
 
        return {"message": "workout added successfully!", "_id": str(result.inserted_id)}, 201
 
    @validateRequest
    def put(self, workoutID=None):
        data = request.json
        data = data["workout"]
 
        if not workoutID:
            workoutID = data.get("_id")
 
        workout = mongo.db.SharedWorkouts.find_one({"_id": ObjectId(workoutID)})
 
        if not workout:
            return {"error": "workout not found."}, 404
 
        # ownership check — only the author can update their workout
        if workout.get("authorUsername") != current_user.username and not current_user.admin:
            return {"error": "Unauthorised."}, 403
 
        data.pop("_id", None)
 
        # single update call instead of one per field
        mongo.db.SharedWorkouts.update_one(
            {"_id": ObjectId(workoutID)},
            {"$set": data}
        )
 
        print("Updated workoutID: " + workoutID + " with data: " + data)
 
        return {"message": "workout updated successfully!"}, 200
 
    @validateRequest
    def delete(self, workoutID=None):

        if not workoutID:
            return {"error": "workoutID not found."}, 404

        workout = mongo.db.SharedWorkouts.find_one({"_id": ObjectId(workoutID)})

        if not workout:
            return {"error": "workout not found."}, 404

        if workout.get("authorUsername") != current_user.username and not current_user.admin:
            return {"error": "Unauthorised."}, 403

        print(f"Deleting workout ID: {workoutID} name: {workout.get('name')}")

        mongo.db.SharedWorkouts.delete_one({"_id": ObjectId(workoutID)})
        mongo.db.SavedWorkouts.delete_many({"workoutID": ObjectId(workoutID)})
        mongo.db.Reports.delete_many({"workoutID": ObjectId(workoutID)})

        return {"message": "workout deleted successfully!"}, 200