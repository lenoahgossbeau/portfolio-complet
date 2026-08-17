# routes/distinctions.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.distinction import Distinction
from schemas.distinction import (
    DistinctionCreate,
    DistinctionRead,
    DistinctionUpdate,
)

router = APIRouter(
    prefix="/distinctions",
    tags=["Distinctions"],
)


@router.post("/", response_model=DistinctionRead)
def create_distinction(
    distinction: DistinctionCreate,
    db: Session = Depends(get_db),
):
    new_distinction = Distinction(
        **distinction.model_dump()
    )

    db.add(new_distinction)
    db.commit()
    db.refresh(new_distinction)

    return new_distinction


@router.get("/", response_model=List[DistinctionRead])
def read_all_distinctions(
    db: Session = Depends(get_db),
):
    return db.query(Distinction).all()


@router.get("/{id}", response_model=DistinctionRead)
def read_distinction(
    id: int,
    db: Session = Depends(get_db),
):
    db_distinction = (
        db.query(Distinction)
        .filter(Distinction.id == id)
        .first()
    )

    if not db_distinction:
        raise HTTPException(
            status_code=404,
            detail="Distinction non trouvée",
        )

    return db_distinction


@router.put("/{id}", response_model=DistinctionRead)
def update_distinction(
    id: int,
    distinction: DistinctionUpdate,
    db: Session = Depends(get_db),
):
    db_distinction = (
        db.query(Distinction)
        .filter(Distinction.id == id)
        .first()
    )

    if not db_distinction:
        raise HTTPException(
            status_code=404,
            detail="Distinction non trouvée",
        )

    update_data = distinction.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_distinction, key, value)

    db.commit()
    db.refresh(db_distinction)

    return db_distinction


@router.delete("/{id}")
def delete_distinction(
    id: int,
    db: Session = Depends(get_db),
):
    db_distinction = (
        db.query(Distinction)
        .filter(Distinction.id == id)
        .first()
    )

    if not db_distinction:
        raise HTTPException(
            status_code=404,
            detail="Distinction non trouvée",
        )

    db.delete(db_distinction)
    db.commit()

    return {
        "message": "Distinction supprimée"
    }
