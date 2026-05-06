from datetime import datetime
from pydantic import BaseModel


class UniversityCreate(BaseModel):
    name: str
    address: str | None = None
    website: str | None = None
    description: str | None = None
    logo_url: str | None = None


class UniversityUpdate(BaseModel):
    name: str | None = None
    address: str | None = None
    website: str | None = None
    description: str | None = None
    logo_url: str | None = None


class UniversityOut(BaseModel):
    id: int
    name: str
    address: str | None
    website: str | None
    description: str | None
    logo_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
