from bson import ObjectId, json_util
from app import mongo
from flask import request
from flask_restful import Resource
from app.resources.auth import validateRequest
from app.models import Users, Reports
import json

# Add options for filtering the output e.g. just return the different exercises or just the name and description

class ReportsAPI(Resource):
    @validateRequest
    def get(self, scheduleID=None, userID=None, workoutID=None):
 
        # Return users that have saved the schedule
        if scheduleID:

            reports = list(mongo.db.Reports.find({"scheduleID": scheduleID}))
            if not reports:
                return {"error": "Reports not found"}, 404
            return json.loads(json_util.dumps(reports)), 200
        
        # Return all schedules saved by a user
        if userID:

            reports = list(mongo.db.Reports.find({"userID": userID}))
            if not reports:
                return {"error": "Reports not found"}, 404
            return json.loads(json_util.dumps(reports)), 200
        
        # Return specific schedule saved by user
        if workoutID:
            
            reports = list(mongo.db.Reports.find({"workoutID": workoutID}))
            if not reports:
                return {"error": "Reports not found"}, 404
            return json.loads(json_util.dumps(reports)), 200
 
        return {"error": "No valid query parameters provided"}, 400

    @validateRequest
    def post(self, scheduleID=None, userID=None, workoutID=None):
        data = request.json

        checkReporterID = Users.query.filter_by(id=data.get("reporterID")).first()

        if not checkReporterID:
            return {"error": "Invalid Reporter"}, 404
        
        checkReporterUsername = Users.query.filter_by(username=data.get("reporterUsername")).first()

        if not checkReporterUsername:
            return {"error": "Invalid Reporter"}, 404
        
        newReport = Reports(reporterID=data.get("reporterID"), reporterUsername=data.get("reporterUsername"), reason=data.get("reason"))

        # Return users that have saved the schedule
        if scheduleID:

            if not mongo.db.SharedSchedules.find_one({"_id": ObjectId(scheduleID)}):
                return {"error": "Schedule not found"}, 404

            newReport.update(scheduleID=scheduleID)

        # Return specific schedule saved by user
        if userID:

            if not Users.query.filter_by(id=userID).first():
                return {"error": "User not found"}, 404

            newReport.update(userID=userID)
        
        # Return specific Report saved by user
        if workoutID:

            if not mongo.db.SharedWorkouts.find_one({"_id": ObjectId(workoutID)}):
                return {"error": "Workout not found"}, 404

            newReport.update(workoutID=workoutID)

        result = mongo.db.Reports.insert_one(newReport)

        if result:
            return {"message": "Report added successfully!", "_id": str(result.inserted_id)}, 201
 
        return {"error": "No valid query parameters provided"}, 400


 
    @validateRequest
    def delete(self, reportID=None):

        if not reportID:

            return {"error": "Report not found."}, 404
 
        report = mongo.db.Reports.find_one({"_id": ObjectId(reportID)})
 
        if not report:
            return {"error": "Report not found."}, 404
 
        print("Deleting report: " + report.get("reason"))
 
        mongo.db.Reports.delete_one({"_id": ObjectId(reportID)})
 
        return {"message": "Report deleted successfully!"}, 200