from app.models import Users
from app import db, bcrypt
from flask import jsonify, request
from flask_restful import Resource
from app.resources.auth import requireApiKey

# Add options for filtering the output e.g. just return the different stats or just the username and bio

class UsersAPI(Resource):
    @requireApiKey  # Apply middleware to GET requests
    def get(self, userID=None, username=None):
        if userID:
            user = Users.query.filter_by(id=userID).first()
            if user.public == True:
                return jsonify({
                    "username": user.username,
                    "bio": user.bio,
                    "followers": user.followers,
                    "following": user.following,
                    "sessions_in_row": user.sessionsInRow,
                    "big_three_total": user.bigThreeTotal,
                    "quick_stat_three": user.quickStatThree,
                    "bench_press": user.benchPress,
                    "dead_lift": user.deadLift,
                    "squat": user.squat,
                })
        elif username:
            user = Users.query.filter_by(username=username).first()
            if user.public == True:
                return jsonify({
                    "username": user.username,
                    "bio": user.bio,
                    "followers": user.followers,
                    "following": user.following,
                    "sessions_in_row": user.sessionsInRow,
                    "big_three_total": user.bigThreeTotal,
                    "quick_stat_three": user.quickStatThree,
                    "bench_press": user.benchPress,
                    "dead_lift": user.deadLift,
                    "squat": user.squat,
                })
        else:
            users = Users.query.all()
            output = []
            for u in users:
                if u.public == True:
                    output.append({
                        "username": u.username,
                        "bio": u.bio,
                        "followers": u.followers,
                        "following": u.following,
                        "sessions_in_row": u.sessionsInRow,
                        "big_three_total": u.bigThreeTotal,
                        "quick_stat_three": u.quickStatThree,
                        "bench_press": u.benchPress,
                        "dead_lift": u.deadLift,
                        "squat": u.squat,
                    })
            return jsonify(output)

    @requireApiKey  # Apply middleware to POST requests
    def post(self):
        data = request.json
        newUser = Users(
            email=data["email"],
            password=bcrypt.generate_password_hash(data["password"]).decode('utf-8'),
            firstName=data["firstName"],
            lastName=data["lastName"],
            username=data["username"],
            public=data.get("public", True),  # Default to True if not provided
            bio=data.get("bio", "Default-Bio"),  # Default bio if not provided
            followers=data.get("followers", 0),  # Default to 0 if not provided
            following=data.get("following", 0),  # Default to 0 if not provided
            currentScheduleID=data.get("currentScheduleID", "69c44bc4735131196e47244d"),  # Default schedule ID if not provided
            sessionsInRow=data.get("sessionsInRow", 0),  # Default to 0 if not provided
            bigThreeTotal=data.get("bigThreeTotal", 0),  # Default to 0 if not provided
            quickStatThree=data.get("quickStatThree", 0),  # Default to 0 if not provided
            benchPress=data.get("benchPress", 0),  # Default to 0 if not provided
            deadLift=data.get("deadLift", 0),  # Default to 0 if not provided
            squat=data.get("squat", 0)  # Default to 0 if not provided
        )
        db.session.add(newUser)
        db.session.commit()
        return {"message": "User added successfully!"}

    @requireApiKey  # Apply middleware to PUT requests
    def put(self, userID=None, username=None):
        data = request.json

        if not userID and not username:
            userID = data["id"]
        
        if username and not userID:
            user = Users.query.filter_by(username=username).first()
        else:
            user = Users.query.get(userID)

        if not user:
            return {"error": "User not found."}

        if "firstName" in data: user.firstName=data["firstName"]
        if "lastName" in data: user.lastName=data["lastName"]
        if "username" in data: user.username=data["username"]
        if "public" in data: user.public=data["public"]
        if "bio" in data: user.bio=data["bio"]
        if "currentScheduleID" in data: user.currentScheduleID=data["currentScheduleID"]
        if "benchPress" in data: user.benchPress=data["benchPress"]
        if "deadLift" in data: user.deadLift=data["deadLift"]
        if "squat" in data: user.squat=data["squat"]

        db.session.commit()
        return {"message": "User updated successfully!"}

    @requireApiKey  # Apply middleware to DELETE requests
    def delete(self, userID=None):
        data = request.json

        if not userID:
            userID = data.get("id")

        user = Users.query.get(userID)

        if not user:
            return {"error": "User not found."}

        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted successfully!"}