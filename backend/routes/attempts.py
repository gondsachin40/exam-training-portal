from flask import Blueprint, request, jsonify
from models import Attempt
from app import db

attempts_bp = Blueprint("attempts", __name__)

@attempts_bp.route("/", methods=["POST"])
def create_attempt():
    attempt = Attempt(**request.json)
    db.session.add(attempt)
    db.session.commit()
    return jsonify({"id": attempt.id})

@attempts_bp.route("/submit/<id>", methods=["PUT"])
def submit_attempt(id):
    data = request.json
    attempt = Attempt.query.get(id)
    attempt.objective_score = data["objectiveScore"]
    attempt.status = "PENDING_EVAL"
    db.session.commit()

    return jsonify({"message": "Submitted for evaluation"})
