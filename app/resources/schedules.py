from bson import ObjectId
from app import db, mongo
from flask import jsonify, request
from flask_restful import Resource
from app.resources.auth import validateRequest
from app.models import Schedules

# Add options for filtering the output e.g. just return the different Days/specific days or just the name and description

class SchedulesAPI(Resource):
    @validateRequest  # Apply middleware to GET requests
    def get(self, scheduleID=None, scheduleName=None):
        if scheduleID:
            schedule = mongo.db.Schedules.find_one({"_id": ObjectId(scheduleID)})
            if not schedule:
                return {"message": "Not found"}, 404
            return jsonify(schedule)
        elif scheduleName:
            schedule = mongo.db.Schedules.find_one({"name": scheduleName})
            schedule.pop('_id', None) # Remove the MongoDB ID as it wasn't requested and could be a security risk to return
            if not schedule:
                return {"message": "Not found"}, 404
            return jsonify(schedule)
        else:
            schedules = mongo.db.Schedules.find()
            
            for schedule in schedules:
                schedule.pop('_id', None) # Remove the MongoDB ID as it wasn't requested and could be a security risk to return
            return jsonify(schedules)
        
    # curl command to test: curl -X GET -H "x-api-key: your_api_key_here" http://localhost:5000/api/schedules

    @validateRequest  # Apply middleware to POST requests
    def post(self):
        data = request.json
        print(data.get("days"))

        daysDefault = {
                            "Monday": {
                                "name": "Rest Day",
                                "description": "Day of Rest!",
                                "exercises": []
                            },
                            "Tuesday": {
                                "name": "Rest Day",
                                "description": "Day of Rest!",
                                "exercises": []
                            },
                            "Wednesday": {
                                "name": "Rest Day",
                                "description": "Day of Rest!",
                                "exercises": []
                            },
                            "Thursday": {
                                "name": "Rest Day",
                                "description": "Day of Rest!",
                                "exercises": []
                            },
                            "Friday": {
                                "name": "Rest Day",
                                "description": "Day of Rest!",
                                "exercises": []
                            },
                            "Saturday": {
                                "name": "Rest Day",
                                "description": "Day of Rest!",
                                "exercises": []
                            },
                            "Sunday": {
                                "name": "Rest Day",
                                "description": "Day of Rest!",
                                "exercises": []
                            }
                        }

        # check if the days provided in the request are valid day keys (e.g., "mondayID", "tuesdayID", etc.) and that the workout IDs provided for each day are valid workout IDs in the Workouts collection

        result = mongo.db.Schedules.insert_one(Schedules(name=data.get("name", "Default-Schedule"), description=data.get("description", "Default-Schedule"), days=data.get("days", daysDefault)))
        print("Adding schedule: ", data.get("name"), " and description: ", data.get("description"), " and days: ", data.get("days") )

        newID = str(result.inserted_id)

        # curl command to test: curl -X POST -H "Content-Type: application/json" -H "x-api-key: your_api_key_here" -d '{"name": "Test Schedule", "description": "This is a test schedule."}' http://localhost:5000/api/schedules

        return {"message": "Schedule added successfully!", "_id": newID}

    @validateRequest  # Apply middleware to PUT requests
    def put(self, scheduleID=None):
        data = request.json

        data = data["schedule"]

        print(data)

        if not scheduleID:
            scheduleID = data.get("_id")
            print (scheduleID)

        if scheduleID == "69c44bc4735131196e47244d":
            return {"error": "Cannot edit default schedule."}, 400

        schedule = mongo.db.Schedules.find_one({"_id": ObjectId(scheduleID)})

        if not schedule:
            return {"error": "Schedule not found."}

        data.pop("_id", None)  # Remove the ID from the data to avoid trying to update it
        
        # Update the schedule in MongoDB with the new data
        for item in data:
            mongo.db.Schedules.update_one({"_id": ObjectId(scheduleID)}, {"$set": {item: data[item]}})
            print("Updating scheduleID: ", scheduleID, " with item: ", item, " and value: ", data[item] )
        
        return {"message": "Schedule updated successfully!"}

    @validateRequest  # Apply middleware to DELETE requests
    def delete(self, scheduleID=None):
        data = request.json

        if not scheduleID:
            scheduleID = data.get("id")

        if scheduleID == "69c44bc4735131196e47244d":
            return {"error": "Cannot delete default schedule."}, 400
        
        schedule = mongo.db.Schedules.find_one({"_id": ObjectId(scheduleID)})

        if not schedule:
            return {"error": "Schedule not found."}, 404
        
        userCheck = []

        for user in db.Users.query.filter_by(currentScheduleID=scheduleID).all():
            userCheck.append(user)
        
        for user in userCheck:
            user.currentScheduleID = "69c44bc4735131196e47244d"
            db.session.commit()

        print("Deleting schedule with ID: ", scheduleID, " and name: ", schedule['name'] )
        mongo.db.Schedules.delete_one({"_id": ObjectId(scheduleID)}) # Delete the schedule from MongoDB
        
        return {"message": "Schedule deleted successfully!"}, 200