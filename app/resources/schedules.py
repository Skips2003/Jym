from bson import ObjectId
from app import db, mongo
from flask import jsonify, request
from flask_restful import Resource
from app.resources.auth import requireApiKey
from app.models import Schedules

# Add options for filtering the output e.g. just return the different Days/specific days or just the name and description

class SchedulesAPI(Resource):
    @requireApiKey  # Apply middleware to GET requests
    def get(self, scheduleID=None, scheduleName=None):
        if scheduleID:
            schedule = mongo.db.Schedules.find_one({"_id": ObjectId(scheduleID)})
            if not schedule:
                return {"message": "Not found"}, 404
            return jsonify(self.formatSchedule(schedule))
        elif scheduleName:
            schedule = mongo.db.Schedules.find_one({"name": scheduleName})
            if not schedule:
                return {"message": "Not found"}, 404
            return jsonify(self.formatSchedule(schedule))
        else:
            schedules = mongo.db.Schedules.find()
            output = [self.formatSchedule(s) for s in schedules]
            return jsonify(output)
        
    # curl command to test: curl -X GET -H "x-api-key: your_api_key_here" http://localhost:5000/api/schedules

    def formatSchedule(self, schedule):
        # Prepare the base dictionary
        result = {
            "name": schedule['name'],
            "description": schedule['description']
        }
        
        # Map the day IDs to the actual workout data
        for day, workoutID in schedule['days'].items():
            workout = mongo.db.Workouts.find_one({"_id": ObjectId(workoutID)})
            if workout:
                # Remove the MongoDB ID so it doesn't show in the final JSON
                workout.pop('_id', None) 
                # Clean up the key name (e.g., "mondayID" -> "monday")
                cleanDay = day.replace('ID', '')
                result[cleanDay] = workout
                
        return result

    @requireApiKey  # Apply middleware to POST requests
    def post(self):
        data = request.json

        daysDefault = {
            "mondayID": "69c44e2b735131196e472458",
            "tuesdayID": "69c44e2b735131196e472458",
            "wednesdayID": "69c44e2b735131196e472458",
            "thursdayID": "69c44e2b735131196e472458",
            "fridayID": "69c44e2b735131196e472458",
            "saturdayID": "69c44e2b735131196e472458",
            "sundayID": "69c44e2b735131196e472458"
        }

        # check if the days provided in the request are valid day keys (e.g., "mondayID", "tuesdayID", etc.) and that the workout IDs provided for each day are valid workout IDs in the Workouts collection

        for day in data.get("days", {}):
            if day not in daysDefault:
                return {"error": f"Invalid day key: {day}. Valid keys are: {list(daysDefault.keys())}"}, 400
            daycheck = mongo.db.Workouts.find_one({"_id": ObjectId(data["days"][day])})
            if not daycheck:
                return {"error": f"Invalid workout ID for {day}: {data['days'][day]}"}, 400

        mongo.db.Schedules.insert_one(Schedules(name=data["name"], description=data["description"], public=data.get("public", True), days=data.get("days", daysDefault)))
        print("Adding schedule with name: ", data["name"], " and description: ", data["description"], " and days: ", data.get("days", daysDefault) )

        # curl command to test: curl -X POST -H "Content-Type: application/json" -H "x-api-key: your_api_key_here" -d '{"name": "Test Schedule", "description": "This is a test schedule."}' http://localhost:5000/api/schedules

        return {"message": "Schedule added successfully!"}

    @requireApiKey  # Apply middleware to PUT requests
    def put(self, scheduleID=None):
        data = request.json

        if not scheduleID:
            scheduleID = data.get("_id")

        if scheduleID == "69c44bc4735131196e47244d":
            return {"error": "Cannot edit default schedule."}, 400

        schedule = mongo.db.Schedules.find_one({"_id": ObjectId(scheduleID)})

        if not schedule:
            return {"error": "Schedule not found."}

        data.pop("_id", None)  # Remove the ID from the data to avoid trying to update it
        
        # check days are valid if they are being updated
        if "days" in data:
            for day in data["days"]:
                if day not in schedule['days']:
                    return {"error": f"Invalid day key: {day}. Valid keys are: {list(schedule['days'].keys())}"}, 400
                daycheck = mongo.db.Workouts.find_one({"_id": ObjectId(data["days"][day])})
                if not daycheck:
                    return {"error": f"Invalid workout ID for {day}: {data['days'][day]}"}, 400
        
        # Update the schedule in MongoDB with the new data
        for item in data:
            mongo.db.Schedules.update_one({"_id": ObjectId(scheduleID)}, {"$set": {item: data[item]}})
            print("Updating scheduleID: ", scheduleID, " with item: ", item, " and value: ", data[item] )
        
        return {"message": "Schedule updated successfully!"}

    @requireApiKey  # Apply middleware to DELETE requests
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