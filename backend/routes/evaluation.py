from flask import Blueprint, request, jsonify
from models import Attempt
from app import db

evaluation_bp = Blueprint("evaluation", __name__)

@evaluation_bp.route("/finalize/<id>", methods=["PUT"])
def finalize(id):
    data = request.json
    attempt = Attempt.query.get(id)

    attempt.evaluator_score = data["evaluatorScore"]
    attempt.final_score = data["finalScore"]
    attempt.pass_status = data["pass"]
    attempt.status = "FINALIZED"
    attempt.remarks = data.get("remarks")

    db.session.commit()
    return jsonify({"message": "Evaluation completed"})
