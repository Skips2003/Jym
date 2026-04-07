from app.models import Users
from app import db, bcrypt
from flask import jsonify, request
from flask_restful import Resource
from app.resources.auth import validateRequest
from sqlalchemy import func

# This really needs cleaned up it was my first attempt at an API and it's not good but i will fix it when i get around to adding the report system
# Add options for filtering the output e.g. just return the different stats or just the username and bio

class UsersAPI(Resource):
    @validateRequest  # Apply middleware to GET requests
    def get(self, userID=None, username=None):
        if userID:
            user = Users.query.filter_by(id=userID).first()

            if not user:
                return {"error": "User not found."}, 404

            return jsonify({
                "id": user.id, # User ID returned because request already specifies the userID, so it is not a security risk and can be useful for the client to have
                "username": user.username,
                "bio": user.bio,
                "followers": user.followers,
                "following": user.following,
                "sessions_in_row": user.sessionsInRow,
                "bench_press": user.benchPress,
                "dead_lift": user.deadLift,
                "squat": user.squat,
                "overhead_Press": user.overheadPress,
                "snatch": user.snatch,
                "cleanAndJerk": user.cleanAndJerk
            })
        elif username:
            users = Users.query.filter(func.similarity(Users.username, username) > 0.3).all()
            print(users)
            output = []

            if not users:
                return {"error": "User not found."}, 404
            for u in users:
                if u.private == False:
                    output.append({
                        # User ID not returned because request specifies the username, so it could be a security risk to return the userID and is not necessary for the client to have
                        "username": u.username, 
                        "bio": u.bio,
                        "followers": u.followers,
                        "following": u.following,
                        "sessions_in_row": u.sessionsInRow,
                        "bench_press": u.benchPress,
                        "dead_lift": u.deadLift,
                        "squat": u.squat,
                        "overhead_Press": user.overheadPress,
                        "snatch": user.snatch,
                        "cleanAndJerk": user.cleanAndJerk
                    })
            return jsonify(output)
        else:
            users = Users.query.all()
            output = []

            for u in users:
                if u.private == False:
                    output.append({
                        # User ID not returned because request does not specify the userID, so it could be a security risk to return the userID and is not necessary for the client to have
                        "username": u.username,
                        "bio": u.bio,
                        "followers": u.followers,
                        "following": u.following,
                        "sessions_in_row": u.sessionsInRow,
                        "bench_press": u.benchPress,
                        "dead_lift": u.deadLift,
                        "squat": u.squat,
                        "overhead_Press": user.overheadPress,
                        "snatch": user.snatch,
                        "cleanAndJerk": user.cleanAndJerk
                    })
            return jsonify(output)

    @validateRequest  # Apply middleware to POST requests
    def post(self):
        data = request.json
        newUser = Users(
            email=data["email"],
            password=bcrypt.generate_password_hash(data["password"]).decode('utf-8'),
            firstName=data["firstName"],
            lastName=data["lastName"],
            username=data["username"],
            private=data.get("private", False),  # Default to False if not provided
            bio=data.get("bio", "Default-Bio"),  # Default bio if not provided
            followers=data.get("followers", 0),  # Default to 0 if not provided
            following=data.get("following", 0),  # Default to 0 if not provided
            currentScheduleID=data.get("currentScheduleID", "69c44bc4735131196e47244d"),  # Default schedule ID if not provided
            sessionsInRow=data.get("sessionsInRow", 0),  # Default to 0 if not provided
            benchPress=data.get("benchPress", 0),  # Default to 0 if not provided
            deadLift=data.get("deadLift", 0),  # Default to 0 if not provided
            squat=data.get("squat", 0),  # Default to 0 if not provided
            overheadPress=data.get("overheadPress", 0),  # Default to 0 if not provided
            snatch=data.get("snatch", 0),  # Default to 0 if not provided
            cleanAndJerk=data.get("cleanAndJerk", 0)  # Default to 0 if not provided
        )
        db.session.add(newUser)
        db.session.commit()
        return {"message": "User added successfully!"}, 201

    @validateRequest  # Apply middleware to PUT requests
    def put(self, userID=None, username=None):

        data = request.json

        print(data)

        if not userID and not username:
            userID = data["id"]
        
        if username and not userID:
            user = Users.query.filter_by(username=username).first()
        else:
            user = Users.query.filter_by(id=userID).first()

        if not user:
            return {"error": "User not found."}, 404

        if "firstName" in data: user.firstName=data["firstName"]
        if "lastName" in data: user.lastName=data["lastName"]
        if "username" in data: user.username=data["username"]
        if "private" in data: user.public=data["private"]
        if "bio" in data: user.bio=data["bio"]
        if "currentScheduleID" in data: user.currentScheduleID=data["currentScheduleID"]
        if "benchPress" in data: user.benchPress=data["benchPress"]
        if "deadLift" in data: user.deadLift=data["deadLift"]
        if "squat" in data: user.squat=data["squat"]
        if "overheadPress" in data: user.overheadPress=data["overheadPress"]
        if "snatch" in data: user.snatch=data["snatch"]
        if "cleanAndJerk" in data: user.cleanAndJerk=data["cleanAndJerk"]

        db.session.commit()
        print("User: " + userID + " updated!")
        return {"message": "User updated successfully!"}, 200

    @validateRequest  # Apply middleware to DELETE requests
    def delete(self, userID=None):
        data = request.json

        if not userID:
            userID = data.get("id")

        user = Users.query.get(userID).first()

        if not user:
            return {"error": "User not found."}, 404

        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted successfully!"}, 200