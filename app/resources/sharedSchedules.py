from bson import ObjectId, json_util
from app import mongo
from flask import request
from flask_restful import Resource
from flask_login import current_user
from app.resources.auth import validateRequest, webOnly
from app.models import SharedSchedules, Users, Follows
import json

class SharedSchedulesAPI(Resource):
    @validateRequest
    def get(self, scheduleID=None, scheduleName=None, authorUsername=None, userID=None):
        # Private schedules only accessed if userID is provided or search is done using scheduleID
 
        # Return specific schedule by ID
        if scheduleID:

            schedule = mongo.db.SharedSchedules.find_one({"_id": ObjectId(scheduleID)})

            if not schedule:
                return {"error": "Schedule not found"}, 404
            
            return json.loads(json_util.dumps(schedule)), 200
 
        # Return all schedules by authorUsername only
        if authorUsername and not scheduleName:

            schedules = list(mongo.db.SharedSchedules.find({"authorUsername": authorUsername}))

            for schedule in schedules:

                if schedule["private"]:

                    schedules.pop(schedule)

                elif userID:

                    author = Users.query.filter_by(username=schedule["authorUsername"]).first()

                    if author.private and not Follows.is_following(userID, author.id):
                        schedules.pop(schedule)

                else:
                    schedules.pop(schedule)

            if not schedules:
                return {"error": "No schedules found matching that name"}, 404
            
            return json.loads(json_util.dumps(schedules)), 200
 
        # Fuzzy search by scheduleName only
        if scheduleName and not authorUsername:

            schedules = list(mongo.db.SharedSchedules.find({
                "name": {"$regex": scheduleName, "$options": "i"}
            }))

            for schedule in schedules:

                if schedule["private"]:

                    schedules.pop(schedule)

                elif userID:

                    author = Users.query.filter_by(username=schedule["authorUsername"]).first()

                    if author.private and not Follows.is_following(userID, author.id):
                        schedules.pop(schedule)

                else:
                    schedules.pop(schedule)

            if not schedules:
                return {"error": "No schedules found matching that name"}, 404
            
            return json.loads(json_util.dumps(schedules)), 200
 
        # Fuzzy search by scheduleName, filtered by authorUsername
        if authorUsername and scheduleName:

            schedules = list(mongo.db.SharedSchedules.find({
                "authorUsername": authorUsername,
                "name": {"$regex": scheduleName, "$options": "i"}
            }))

            for schedule in schedules:

                if schedule["private"]:

                    schedules.pop(schedule)

                elif userID:

                    author = Users.query.filter_by(username=schedule["authorUsername"]).first()

                    if author.private and not Follows.is_following(userID, author.id):
                        schedules.pop(schedule)

                else:
                    schedules.pop(schedule)

            if not schedules:
                return {"error": "No schedules found matching that name"}, 404
            
            return json.loads(json_util.dumps(schedules)), 200
 
        return {"error": "No valid query parameters provided"}, 400

    @validateRequest
    def post(self):
        data = request.json
 
        if not data.get("authorUsername"):
            return {"error": "No authorUsername provided."}, 400
 
        userCheck = Users.query.filter_by(username=data.get("authorUsername")).first()
        if not userCheck:
            return {"error": "Author not found."}, 404
 
        daysDefault = {
            "Monday":    {"name": "Rest Day", "description": "Day of Rest!", "exercises": []},
            "Tuesday":   {"name": "Rest Day", "description": "Day of Rest!", "exercises": []},
            "Wednesday": {"name": "Rest Day", "description": "Day of Rest!", "exercises": []},
            "Thursday":  {"name": "Rest Day", "description": "Day of Rest!", "exercises": []},
            "Friday":    {"name": "Rest Day", "description": "Day of Rest!", "exercises": []},
            "Saturday":  {"name": "Rest Day", "description": "Day of Rest!", "exercises": []},
            "Sunday":    {"name": "Rest Day", "description": "Day of Rest!", "exercises": []},
        }
 
        # add validation that keys in data.get("days") are valid day names and that exercise IDs exist in the Workouts collection
 
        newSchedule = SharedSchedules(
                name=data.get("name", "Default-Schedule"),
                description=data.get("description", "Default-Schedule"),
                authorUsername=data.get("authorUsername"),
                private=data.get("private", Users.query.filter_by(username=data.get("authorUsername")).first().private),
                days=data.get("days", daysDefault)
            )
        
        checkIfDuplicate = mongo.db.SharedSchedules.find_one(newSchedule)

        if checkIfDuplicate:
            return {"error": "Workout with those details already exists!"}, 404
 
        result = mongo.db.SharedSchedules.insert_one(newSchedule)
 
        print("Adding schedule:" + data.get("name") + " description: " + data.get("description"))
 
        return {"message": "Schedule added successfully!", "_id": str(result.inserted_id)}, 201
 
    @webOnly
    def put(self, scheduleID=None):
        data = request.json
        data = data["schedule"]
 
        if not scheduleID:
            scheduleID = data.get("_id")
 
        schedule = mongo.db.SharedSchedules.find_one({"_id": ObjectId(scheduleID)})
 
        if not schedule:
            return {"error": "Schedule not found."}, 404
 
        # ownership check — only the author can update their schedule
        if schedule.get("authorUsername") != current_user.username:
            return {"error": "Unauthorised."}, 403
 
        data.pop("_id", None)
 
        mongo.db.SharedSchedules.update_one(
            {"_id": ObjectId(scheduleID)},
            {"$set": data}
        )
 
        print("Updated scheduleID: %s with data: %s", scheduleID, data)
 
        return {"message": "Schedule updated successfully!"}, 200
 
    @webOnly
    def delete(self, scheduleID=None):
        data = request.json
 
        if not scheduleID:
            scheduleID = data.get("id")
 
        schedule = mongo.db.SharedSchedules.find_one({"_id": ObjectId(scheduleID)})
 
        if not schedule:
            return {"error": "Schedule not found."}, 404
 
        # ownership check — only the author can delete their schedule
        if schedule.get("authorUsername") != current_user.username:
            return {"error": "Unauthorised."}, 403
 
        print("Deleting schedule ID: %s, name: %s", scheduleID, schedule.get("name"))
 
        mongo.db.SharedSchedules.delete_one({"_id": ObjectId(scheduleID)})
 
        return {"message": "Schedule deleted successfully!"}, 200