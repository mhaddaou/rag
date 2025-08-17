import io
from fastapi import Response, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from .jwt_service import jwt_decrypt
from ..database.database import db
from .rag import storing_embedding
import os
from dotenv import load_dotenv
import uuid
from .chat_service import create_session_handler


load_dotenv()

path = os.getenv("PATH_UPLOADS")

async def upload_file_handler(file: UploadFile, jwt: str, session_id: str):
    try:
        print(session_id)
        user_info = await jwt_decrypt(jwt)
        
        if not user_info:
            raise HTTPException(status_code=401, detail="Invalid JWT token")
        user = await db.user.find_unique(where={"email": user_info.get("email")})
        if not user:
            raise HTTPException(status_code=404, detail="Invalid JWT token")
        session_folder = os.path.join(path, user.id, session_id)
        os.makedirs(session_folder, exist_ok=True)
        stored_name = f"{uuid.uuid4()}.pdf"
        file_path = os.path.join(session_folder, stored_name)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        await storing_embedding(file_path, session_id)
        await db.doc.create(data={
            "sessionId": session_id,
            "name": file.filename,
            "file_path": file_path
        })
        
        return {"path" : file_path, "name" : stored_name, "file_name": file.filename}


    except Exception as e:
        print(f"Error: {e}")  # Add logging to see the actual error

        raise HTTPException(status_code=500, detail=str(e))
    
async def getDoc_handler():
    doc = await db.doc.find_first()
    if not doc:
        raise HTTPException(status_code=404, detail="No document found")
    
    # content is already bytes, no need to decode
    print(doc)
    return doc.file_path

async def first_upload_handler(file : UploadFile, jwt : str):
    try:
        user_info = await jwt_decrypt(jwt)
        if not user_info:
            raise HTTPException(status_code=401, detail="Invalid JWT token")
        user = await db.user.find_unique(where={"email": user_info.get("email")})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid JWT token")
        session = await create_session_handler(jwt)
        if not session:
            raise HTTPException(status_code=500, detail="Failed to create session")
        
        session_folder = os.path.join(path, user.id, session.get("session_id"))
        os.makedirs(session_folder, exist_ok=True)
        stored_name = f"{uuid.uuid4()}.pdf"
        path_file = os.path.join(session_folder, stored_name)
        with open(path_file, "wb") as f:
            f.write(await file.read())
        await storing_embedding(path_file, session.get("session_id"))
        await db.doc.create(data={
            "sessionId": session.get("session_id"),
            "name": file.filename,
            "file_path": path_file
        })

        return {"sessionId": session.get("session_id")}
    except Exception as err:
        raise HTTPException(status_code=err.status_code, detail=err.detail)