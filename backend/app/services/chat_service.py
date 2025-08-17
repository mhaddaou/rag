from fastapi import HTTPException
from .jwt_service import jwt_decrypt
from ..database.database import db
from .rag import retriever
from ..models.chat_model import GetMessage


async def create_session_handler(jwt: str):
    try:
        user_info = await jwt_decrypt(jwt)
        if not user_info:
            raise HTTPException(status_code=401, detail="Invalid JWT token")
        user = await db.user.find_unique({"email": user_info.get("email")})
        if not user:
            raise HTTPException(status_code=404, detail="Invalid Jwt token")
        session = await db.session.create(data={
            "userId": user.id,
        })
        if not session:
            raise HTTPException(
                status_code=500, detail="Failed to create session")
        return {"message": "Session created successfully", "session_id": session.id}

    except Exception as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


async def chat_handler(jwt: str, sessionId: str, query: str):
    try:
        user_info = await jwt_decrypt(jwt)
        if not user_info:
            raise HTTPException(status_code=401, detail="Invalid JWT token")
        user = await db.user.find_unique(where={"email": user_info.get("email")})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid JWT token")
        session = await db.session.find_unique(where={"id": sessionId, "userId": user.id})
        if not session:
            raise HTTPException(status_code=401, detail="session not found")
        
        # Save the human message
        await db.message.create(data={
            "content": query,
            "type": "human",
            "sessionId": sessionId
        })
        
        # Stream the response while accumulating it for database storage
        full_response = ""
        async for chunk in retriever(sessionId=sessionId, query=query):
            if chunk:
                full_response += chunk
                yield chunk
        
        # Save the complete AI response to database after streaming is complete
        await db.message.create(data={
            "content": full_response,
            "type": "ai",
            "sessionId": sessionId
        })
        
    except Exception as err:
        raise HTTPException(status_code=err.status_code, detail=err.detail)


async def get_sessions_handler(jwt: str):
    try:
        user_info = await jwt_decrypt(jwt)
        if not user_info:
            raise HTTPException(status_code=401, detail="Invalid JWT token")
        user = await db.user.find_unique(where={"email": user_info.get("email")})
        if not user:
            raise HTTPException(status_code=404, detail="Invalid Jwt token")
        sessions = await db.session.find_many(where={"userId": user.id}, order={"created_at": "desc"})
        return sessions
    except Exception as err:
        raise HTTPException(status_code=err.status_code, detail=err.detail)


async def get_messages_handler(data: GetMessage):
    try:
        user_info = await jwt_decrypt(data.jwt)
        if not user_info:
            raise HTTPException(status_code=401, detail="Invalid JWT token")
        user = await db.user.find_unique(where={"email": user_info.get("email")})
        if not user:
            raise HTTPException(status_code=404, detail="Invalid Jwt token")
        messages = await db.message.find_many(where={"sessionId": data.sessionId})
        return messages
    except Exception as err:
        raise HTTPException(status_code=err.status_code, detail=err.detail)
