from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ..services.chat_service import create_session_handler, chat_handler, get_sessions_handler, get_messages_handler
from ..models.jwt_request import JwtRequest
from ..models.chat_model import GetMessage, ChatModel
chatRouter = APIRouter()


@chatRouter.post('/create_session')
async def create_session(jwt: str):
    return await create_session_handler(jwt=jwt)

@chatRouter.post('/chat')
async def chat(data: ChatModel):
    import json
    async def stream_generator():
        try:
            async for chunk in chat_handler(data.jwt, data.sessionId, data.query):
                if chunk:
                    # Send each token as JSON data in SSE format
                    chunk_data = json.dumps({"token": chunk, "type": "token"})
                    yield f"data: {chunk_data}\n\n"
            
            # Send completion signal
            completion_data = json.dumps({"type": "complete"})
            yield f"data: {completion_data}\n\n"
            
        except Exception as e:
            # Send error message
            error_data = json.dumps({"type": "error", "message": str(e)})
            yield f"data: {error_data}\n\n"
    
    return StreamingResponse(
        stream_generator(), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Cache-Control"
        }
    )
# async def chat(data : ChatModel):
#     return await chat_handler(jwt=data.jwt, sessionId=data.sessionId, query=data.query)

@chatRouter.post('/get_sessions')
async def get_sessions(req : JwtRequest):
    return await get_sessions_handler(jwt=req.jwt)

@chatRouter.post('/get_messages')
async def get_messages(req : GetMessage):
    return await get_messages_handler(req)