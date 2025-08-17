from pydantic import BaseModel, EmailStr, Field, validator
import re
class Login(BaseModel):
    email : EmailStr
    password : str = Field(min_length=8, )
    
    @validator("password")
    def validate_password(cls, value):
        if not re.search(r"[0-9]", value):
            raise ValueError("Password must contain at least one number.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain at least one special character.")
        return value
    
class Signup(BaseModel):
    firstName : str
    lastName : str
    email : EmailStr
    password : str = Field(min_length=8)
    confirmed_password : str = Field(min_length=8)
    
    @validator("confirmed_password")
    def validate_password(cls, value):
        if not re.search(r"[0-9]", value):
            raise ValueError("Password must contain at least one number.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain at least one special character.")
        return value
    
    @validator("password")
    def validate_password(cls, value):
        if not re.search(r"[0-9]", value):
            raise ValueError("Password must contain at least one number.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain at least one special character.")
        return value