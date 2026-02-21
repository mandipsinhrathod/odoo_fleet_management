from app.db.session import SessionLocal, engine, Base
from app.models import models
from app.core.security import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if admin already exists
    admin = db.query(models.User).filter(models.User.email == "admin@fleetnova.com").first()
    if not admin:
        new_admin = models.User(
            email="admin@fleetnova.com",
            hashed_password=get_password_hash("admin123"),
            role=models.UserRole.ADMIN
        )
        db.add(new_admin)
        db.commit()
        print("Admin user created: admin@fleetnova.com / admin123")
    else:
        print("Admin user already exists.")
    
    db.close()

if __name__ == "__main__":
    init_db()
