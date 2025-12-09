from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, jwt, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    from routes.auth import auth_bp
    from routes.exams import exams_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(exams_bp, url_prefix="/api/exams")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
