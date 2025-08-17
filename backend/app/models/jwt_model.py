from pydantic import EmailStr, BaseModel

class JwtModel(BaseModel):
    firstName : str
    email : EmailStr
    id : str
    