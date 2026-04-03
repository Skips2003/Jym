from bson import ObjectId
from app import mongo
from flask import jsonify, request
from flask_restful import Resource
from app.resources.auth import validateRequest
from app.models import Workouts

# Add options for filtering the output e.g. just return the different exercises or just the name and description

class WorkoutsAPI(Resource):
    @validateRequest  # Apply middleware to GET requests
    def get(self, workoutID=None, workoutName=None):
        if workoutID:
            workout = mongo.db.Workouts.find_one({"_id": ObjectId(workoutID)})
            if not workout:
                return {"message": "Not found"}, 404
            return jsonify({
                # Workout _id returned because request already specifies the workoutID, so it is not a security risk and can be useful for the client to have
                "_id": str(workout['_id']),
                "name": workout['name'],
                "description": workout['description'],
                "exercises": workout['exercises']
            })
        elif workoutName:
            workout = mongo.db.Workouts.find_one({"name": workoutName})
            if not workout:
                return {"message": "Not found"}, 404
            return jsonify({
                # Workout _id not returned because request specifies the workoutName, so it could be a security risk to return the workoutID and is not necessary for the client to have
                "name": workout['name'],
                "description": workout['description'],
                "exercises": workout['exercises']
            })
        else:
            Workouts = mongo.db.Workouts.find()
            output = []
            for w in Workouts:
                output.append({
                    "name": w['name'],
                    "description": w['description'],
                    "exercises": w['exercises']
                })
            return jsonify(output)
    # curl command to test: curl -X GET -H "x-api-key: your_api_key_here" http://localhost:5000/api/Workouts

    @validateRequest  # Apply middleware to POST requests
    def post(self):
        data = request.json

        # Add Validating required fields

        result = mongo.db.Workouts.insert_one(Workouts(name=data["name"], description=data["description"], exercises=data.get("exercises", [])))

        newID = str(result.inserted_id)

        # curl command to test: curl -X POST -H "Content-Type: application/json" -H "x-api-key: your_api_key_here" -d '{"name": "Test workout", "description": "This is a test workout."}' http://localhost:5000/api/Workouts

        return {"message": "Workout added successfully!", "_id": newID}, 201

    @validateRequest  # Apply middleware to PUT requests
    def put(self, workoutID=None):
        data = request.json

        print(workoutID)

        if not workoutID:
            workoutID = data.get("_id")

        if workoutID == "69c44e2b735131196e472458":
            return {"error": "Cannot edit default workout, creating new workout instead."}, 400

        workout = mongo.db.Workouts.find_one({"_id": ObjectId(workoutID)})
        
        if not workout:
            return {"error": "Workout not found."}, 404

        if data["_id"]:
            data.pop("_id", None)  # Remove the ID from the data to avoid trying to update it
        
        # Update the workout in MongoDB with the new data
        for item in data:
            mongo.db.Workouts.update_one({"_id": ObjectId(workoutID)}, {"$set": {item: data[item]}})
            print("Updating workoutID: ", workoutID, " with item: ", item, " and value: ", data[item] )
        
        return {"message": "Workout updated successfully!"}, 200

    @validateRequest  # Apply middleware to DELETE requests
    def delete(self, workoutID=None):
        data = request.json

        if not workoutID:
            workoutID = data.get("_id")
        
        workout = mongo.db.Workouts.find_one({"_id": ObjectId(workoutID)})

        if workoutID == "69c44e2b735131196e472458":
            return {"error": "Cannot delete default workout."}, 400

        if not workout:
            return {"error": "Workout not found."}, 404

        print("Deleting workout with ID: ", workoutID, " and name: ", workout['name'] )
        mongo.db.Workouts.delete_one({"_id": ObjectId(workoutID)}) # Delete the Workout from MongoDB
        
        return {"message": "Workout deleted successfully!"}, 200