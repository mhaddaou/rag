from ..database.database import db
from fastapi import HTTPException
from ..models.auth_model import Signup, Login
from ..models.jwt_model import JwtModel
from .jwt_service import jwt_encrypt
from .bcrypt_service import incrypt_password, decrypt_password


async def handl_signup(data: Signup):
    try:
        exist = await db.user.find_unique(where={"email": data.email})
        if (exist):
            raise HTTPException(
                status_code=400, detail="user with this email already exist")

        if (data.password != data.confirmed_password):
            raise HTTPException(
                status_code=400, detail="password and confirm password is not match")
        hashed_password = await incrypt_password(password=data.password)
        user = await db.user.create(data={
            "email": data.email,
            "firstName": data.firstName,
            "lastName": data.lastName,
            "password": hashed_password
        })
        if not user:
            raise HTTPException(
                status_code=400, detail="user does not created")
        jwt_data = JwtModel(firstName=data.firstName,
                            email=data.email, id=user.id)
        jwt = await jwt_encrypt(jwt_data)
        return {
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "jwt": jwt
        }

    except Exception as err:
        raise HTTPException(status_code=err.status_code, detail=err.detail)


async def handl_login(data: Login):
    try:
        user = await db.user.find_unique({"email": data.email})
        if not user:
            raise HTTPException(
                status_code=400, detail="email or password is incorrect")
        compare = decrypt_password(
            encrypted_pass=user.password, userPassword=data.password)
        if not compare:
            raise HTTPException(
                status_code=400, detail="email or password is incorrect")
        jwt_data = JwtModel(firstName=user.firstName,
                            email=data.email, id=user.id)
        jwt = await jwt_encrypt(jwt_data)
        return {
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "jwt": jwt
        }

    except Exception as err:
        raise HTTPException(status_code=err.status_code, detail=err.detail)
