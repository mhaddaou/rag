from fastapi import APIRouter, UploadFile, Form, File
from ..services.docs import upload_file_handler, getDoc_handler
from ..models.chat_model import UploadModel
from ..services.docs import first_upload_handler

uploadRouter = APIRouter()


@uploadRouter.post("/upload")
async def upload_file(data : UploadModel):
    return  await upload_file_handler(file=data.file, jwt=data.jwt, session_id=data.session_id)

@uploadRouter.post("/first_upload")
async def first_upload(file: UploadFile = File(...),
    jwt: str = Form(...)):
    return await first_upload_handler(file=file, jwt=jwt)

@uploadRouter.get("/getDoc")
async def get_doc():
    return await getDoc_handler()