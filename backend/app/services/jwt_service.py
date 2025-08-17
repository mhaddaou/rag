import jwt
import os
from dotenv import load_dotenv
from ..models.jwt_model import JwtModel


load_dotenv()


jwt_key = os.getenv("JWT_KEY")


async def jwt_encrypt(jwt_data: JwtModel):
    payload = {
        "email": jwt_data.email,
        "firstName": jwt_data.firstName
    }
    encoded = jwt.encode(payload, jwt_key, algorithm="HS256")
    return encoded


async def jwt_decrypt(encoded: str):
    decrypt = jwt.decode(encoded, jwt_key, algorithms="HS256")
    return decrypt
