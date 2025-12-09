from datetime import datetime
import uuid
from extensions import db

def gen_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    id = db.Column(db.String, primary_key=True, default=gen_uuid)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(200))
    role = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Exam(db.Model):
    id = db.Column(db.String, primary_key=True, default=gen_uuid)
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    pass_pct = db.Column(db.Integer)
    max_attempts = db.Column(db.Integer)
