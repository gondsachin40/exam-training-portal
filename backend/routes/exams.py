from flask import Blueprint, request, jsonify
from models import Exam
from extensions import db

exams_bp = Blueprint("exams", __name__)

@exams_bp.route("/", methods=["POST"])
def create_exam():
    data = request.json
    exam = Exam(
        title=data.get("title"),
        description=data.get("description"),
        pass_pct=data.get("pass_pct"),
        max_attempts=data.get("max_attempts"),
    )
    db.session.add(exam)
    db.session.commit()
    return jsonify({"id": exam.id})

@exams_bp.route("/", methods=["GET"])
def get_exams():
    exams = Exam.query.all()
    return jsonify([
        {
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "pass_pct": e.pass_pct,
            "max_attempts": e.max_attempts
        } for e in exams
    ])
