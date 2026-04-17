import hashlib
import secrets
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "my_super_secret_key"
ALGORITHM = "HS256"

def hash_password(password: str):
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"{salt}${pwd_hash.hex()}"

def verify_password(plain_password, hashed_password):
    try:
        salt, pwd_hash = hashed_password.split('$')
        check_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), salt.encode(), 100000)
        return check_hash.hex() == pwd_hash
    except:
        return False

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)