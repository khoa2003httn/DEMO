from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.deps import get_db, require_admin
from app.models.user import User
from app.models.major import Major
from app.models.university import University
from app.schemas.major import MajorCreate, MajorUpdate, MajorOut, MajorWithUniversity

router = APIRouter(prefix="/majors", tags=["Majors"])


@router.get("", response_model=List[MajorWithUniversity])
def list_majors(
    search: str = "",
    university_id: int | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Major)
    if search:
        query = query.filter(Major.name.ilike(f"%{search}%"))
    if university_id:
        query = query.filter(Major.university_id == university_id)
    majors = query.order_by(Major.name).all()

    uni_map = {u.id: u.name for u in db.query(University).all()}
    result = []
    for m in majors:
        data = MajorWithUniversity.model_validate(m)
        data.university_name = uni_map.get(m.university_id)
        result.append(data)
    return result


@router.get("/{major_id}", response_model=MajorWithUniversity)
def get_major(major_id: int, db: Session = Depends(get_db)):
    major = db.query(Major).filter(Major.id == major_id).first()
    if not major:
        raise HTTPException(status_code=404, detail="Không tìm thấy ngành học")
    uni = db.query(University).filter(University.id == major.university_id).first()
    data = MajorWithUniversity.model_validate(major)
    data.university_name = uni.name if uni else None
    return data


@router.post("", response_model=MajorOut, status_code=status.HTTP_201_CREATED)
def create_major(
    payload: MajorCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    if not db.query(University).filter(University.id == payload.university_id).first():
        raise HTTPException(status_code=404, detail="Trường đại học không tồn tại")
    major = Major(**payload.model_dump())
    db.add(major)
    db.commit()
    db.refresh(major)
    return major


@router.put("/{major_id}", response_model=MajorOut)
def update_major(
    major_id: int,
    payload: MajorUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    major = db.query(Major).filter(Major.id == major_id).first()
    if not major:
        raise HTTPException(status_code=404, detail="Không tìm thấy ngành học")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(major, field, value)
    db.commit()
    db.refresh(major)
    return major


@router.delete("/{major_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_major(
    major_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    major = db.query(Major).filter(Major.id == major_id).first()
    if not major:
        raise HTTPException(status_code=404, detail="Không tìm thấy ngành học")
    db.delete(major)
    db.commit()
