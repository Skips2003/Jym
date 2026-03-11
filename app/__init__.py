from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def createApp(configClass = Config):
    app = Flask(__name__)
    app.config.from_object(configClass)
    db.init_app(app)

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    return app

from app import models