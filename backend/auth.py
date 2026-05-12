from jose import jwt
from datetime import datetime, timedelta

# --- AUTH CONFIG ---
SECRET_KEY = "gradeopssecret"
ALGORITHM = "HS256"

# Hardcoded users for Instructor and TA roles
fake_users = {
    "instructor": {
        "username": "instructor",
        "password": "1234",
        "role": "Instructor"
    },
    "ta": {
        "username": "ta",
        "password": "1234",
        "role": "TA"
    }
}

def authenticate_user(username, password):
    """Checks if username exists and password matches."""
    user = fake_users.get(username)
    if not user:
        return None
    if user["password"] != password:
        return None
    return user

def create_access_token(data: dict):
    """Generates a JWT token valid for 10 hours."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=10)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return encoded_jwt