from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.utils.security import hash_password

from app.schemas.auth import Token
from fastapi.security import OAuth2PasswordRequestForm
from app.utils.security import verify_password, create_access_token

from app.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post(
    "/register",
    response_model=UserResponse
)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

class ProfileUpdate(BaseModel):
    full_name: str | None = None
    username: str | None = None
    email: str | None = None
    date_of_birth: str | None = None
    phone: str | None = None
    bio: str | None = None

@router.get("/me")
def get_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "date_of_birth": current_user.date_of_birth,
        "phone": current_user.phone,
        "bio": current_user.bio,
    }

@router.patch("/me")
def update_profile(
    profile: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile.username is not None:
        current_user.username = profile.username

    if profile.email is not None:
        existing_user = (
            db.query(User)
            .filter(
                User.email == profile.email,
                User.id != current_user.id
            )
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        current_user.email = profile.email

    if profile.full_name is not None:
        current_user.full_name = profile.full_name

    if profile.date_of_birth is not None:
        current_user.date_of_birth = profile.date_of_birth

    if profile.phone is not None:
        current_user.phone = profile.phone

    if profile.bio is not None:
        current_user.bio = profile.bio

    db.commit()
    db.refresh(current_user)

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "date_of_birth": current_user.date_of_birth,
        "phone": current_user.phone,
        "bio": current_user.bio,
    }