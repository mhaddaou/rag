from pydantic import BaseModel


class JwtRequest(BaseModel):
    jwt: str
