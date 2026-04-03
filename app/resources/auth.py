from functools import wraps
from flask import request, jsonify
from app import db
from app.models import APIKey
from flask_login import current_user

# Middleware to check API key
def validateRequest(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):

        if current_user.is_authenticated:
            return f(*args, **kwargs)
        
        apiKey = request.headers.get('X-API-KEY')

        keyEntry = APIKey.query.filter_by(key=apiKey).first()

        # If API key is invalid or not provided
        if not keyEntry:
            return {"error": "Invalid or missing API key."}, 403

        # Optional: Update request_count here for future rate-limiting
        keyEntry.request_count += 1
        db.session.commit()

        setattr(request, 'csrf_exempt', True)
        return f(*args, **kwargs)

    return decorated_function

def webOnly(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):

        if current_user.is_authenticated:
            return f(*args, **kwargs)
        
        return {"error": "Can only be accessed via website"}, 403

    return decorated_function