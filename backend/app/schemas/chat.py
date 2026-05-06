from datetime import datetime
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    created_at: datetime


class ChatHistoryOut(BaseModel):
    id: int
    user_id: int
    message: str
    response: str
    created_at: datetime

    model_config = {"from_attributes": True}
