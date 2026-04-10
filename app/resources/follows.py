from app.models import Users, Follows
from app import db
from flask import request
from flask_restful import Resource
from app.resources.auth import validateRequest

class FollowsAPI(Resource):
    @validateRequest  # Apply middleware to GET requests
    def get(self, followedID=None, followerID=None):
        
        print(followedID)
        print(followerID)

        if not followerID and not followedID:   
            return {"error": "Follow not found."}, 404
        
        if followedID and not followerID:
            followers = Follows.query.filter_by(followedID=followedID).all()
            output = []
            for f in followers:
                output.append({
                    "id": f.followerID,
                    "username": Users.query.filter_by(id=f.followerID).first().username
                })

            return output, 200
        
        if followerID and not followedID:
            following = Follows.query.filter_by(followerID=followerID).all()
            output = []
            for f in following:
                output.append({
                    "id": f.followedID,
                    "username": Users.query.filter_by(id=f.followedID).first().username
                })

            return output, 200
        
        
        follow = Follows.query.filter_by(followerID=followerID, followedID=followedID)

        if follow:
            return {"Success": "Follow found.", "followedID": followedID, "followerID": followerID}, 200

    @validateRequest  # Apply middleware to POST requests
    def post(self, followedID=None, followerID=None):
        data = request.json

        print(data)

        if not followedID:
            followedID = data.get("followedID")

        if not followerID:
            followerID = data.get("followerID")

        newFollow = Follows(
            followedID=followedID,
            followerID=followerID
        )
        db.session.add(newFollow)

        Users.query.filter_by(id=followedID).first().followers =+ 1

        Users.query.filter_by(id=followerID).first().following =+ 1

        db.session.commit()
        return {"message": "newFollow added successfully!"}, 201

    @validateRequest  # Apply middleware to DELETE requests
    def delete(self, followedID=None, followerID=None):
        data = request.json

        print(data)

        if not followedID:
            followedID = data.get("followedID")

        if not followerID:
            followerID = data.get("followerID")

        follow = Follows.query.filter_by(followerID=followerID, followedID=followedID).first()

        Users.query.filter_by(id=followedID).first().followers =- 1

        Users.query.filter_by(id=followerID).first().following =- 1

        if not follow:
            return {"error": "Follow not found."}, 404

        db.session.delete(follow)
        db.session.commit()
        return {"message": "Follow deleted successfully!"}, 200