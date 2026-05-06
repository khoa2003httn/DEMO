from datetime import datetime
from pydantic import BaseModel


class MajorCreate(BaseModel):
    name: str
    code: str | None = None
    description: str | None = None
    subject_group: str | None = None
    benchmark: float | None = None
    quota: int | None = None
    university_id: int


class MajorUpdate(BaseModel):
    name: str | None = None
    code: str | None = None
    description: str | None = None
    subject_group: str | None = None
    benchmark: float | None = None
    quota: int | None = None
    university_id: int | None = None


class MajorOut(BaseModel):
    id: int
    name: str
    code: str | None
    description: str | None
    subject_group: str | None
    benchmark: float | None
    quota: int | None
    university_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class MajorWithUniversity(MajorOut):
    university_name: str | None = None
