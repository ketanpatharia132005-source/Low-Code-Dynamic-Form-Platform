# C:\Projects\Infosys\Low-Code-Form-Platform\backend\seed_user.py
import sys
import os

# Force the parent directory into Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.user import User
# Explicitly import relationships so SQLAlchemy maps them correctly
from app.models.form import Form
from app.models.rule import ConditionalRule
from passlib.context import CryptContext
from sqlalchemy.orm import configure_mappers

# Force compile mappers before doing anything
try:
    configure_mappers()
    print("SQLAlchemy registry verified and compiled successfully!")
except Exception as e:
    print("Mapper initialization failed, looking into issues:")
    print(e)
    sys.exit(1)

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
db = SessionLocal()

try:
    # Delete previous attempts
    db.query(User).filter(User.username == 'ketan@gmail.com').delete()
    db.commit()

    # Hash the password
    hashed_password = pwd_context.hash('123456')
    test_user = User(
        username='ketan@gmail.com',
        email='ketan@gmail.com',
        password=hashed_password,
        
    )
    db.add(test_user)
    db.commit()
    print("\nSUCCESS: User 'ketan@gmail.com' with password '123456' has been registered in PostgreSQL!")
except Exception as e:
    db.rollback()
    print("FAILED to seed user:", e)
finally:
    db.close()