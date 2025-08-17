import os
from fastapi import FastAPI
from app.controllers.auth import authRouter
from app.controllers.chat import chatRouter
from contextlib import asynccontextmanager
from .database.database import db, connect_db, disconnect_db
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.upload import uploadRouter
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await disconnect_db()
    

path= os.getenv("PATH_UPLOADS")
os.makedirs(path, exist_ok=True)
app = FastAPI(lifespan=lifespan)
app.include_router(authRouter, prefix="/auth", tags=["auth"])
app.include_router(uploadRouter, prefix="/docs", tags=["docs"])
app.include_router(chatRouter, prefix="/chat", tags=["chat"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def get():
    return {"message" : "first messsssage abro"}