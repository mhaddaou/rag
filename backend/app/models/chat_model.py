from pydantic import BaseModel
from fastapi import UploadFile

class GetMessage(BaseModel):
    jwt: str
    sessionId: str
    
class ChatModel(BaseModel):
    jwt : str
    sessionId : str
    query : str
    
class UploadModel(BaseModel):
    file: UploadFile
    jwt : str
