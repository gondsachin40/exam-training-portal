from app import create_app
from extensions import db
from models import User
import bcrypt

app = create_app()

with app.app_context():
    users = [
        {
            "name": "Admin",
            "email": "admin@corp.local",
            "password": "123456",
            "role": "ADMIN"
        },
        {
            "name": "Learner User",
            "email": "learner@corp.local",
            "password": "123456",
            "role": "LEARNER"
        },
        {
            "name": "Evaluator User",
            "email": "evaluator@corp.local",
            "password": "123456",
            "role": "EVALUATOR"
        }
    ]

    for u in users:
        existing = User.query.filter_by(email=u["email"]).first()
        if existing:
            print(f"⚠️ {u['email']} already exists, skipping")
            continue

        hashed = bcrypt.hashpw(u["password"].encode(), bcrypt.gensalt()).decode()

        user = User(
            name=u["name"],
            email=u["email"],
            password=hashed,
            role=u["role"]
        )

        db.session.add(user)

    db.session.commit()
    print("✅ Admin, Learner & Evaluator users created")
