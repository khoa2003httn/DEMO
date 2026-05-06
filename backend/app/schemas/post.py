from datetime import datetime
from typing import Literal
from pydantic import BaseModel


class PostCreate(BaseModel):
    title: str
    content: str
    type: Literal["news", "notice"] = "news"


class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    type: Literal["news", "notice"] | None = None


class PostOut(BaseModel):
    id: int
    title: str
    content: str
    type: str
    author_id: int
    published_at: datetime
    created_at: datetime

    model_config = {"from_attributes": True}
