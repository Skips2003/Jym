from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_meld import Meld

db = SQLAlchemy()
bcrypt = Bcrypt()
loginManager = LoginManager()
meld = Meld()

def createApp(configClass = Config):
    app = Flask(__name__)
    app.config.from_object(configClass)
    meld.init_app(app)
    db.init_app(app)
    bcrypt.init_app(app)

    loginManager.init_app(app)
    loginManager.login_view = "main.signIn"

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    return app

from app import models