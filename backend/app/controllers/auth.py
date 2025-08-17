from fastapi import APIRouter
from ..models.auth_model import Login, Signup
from ..services.auth_service import handl_signup, handl_login
authRouter = APIRouter()


@authRouter.post("/login")
async def login(data: Login):
    return await handl_login(data=data)


@authRouter.post("/signup")
async def signup(data: Signup):
    print("this is the data, ", data)
    return await handl_signup(data=data)




