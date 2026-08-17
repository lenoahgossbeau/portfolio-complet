# routes/media.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.media_artefact import MediaArtefact
from schemas.media import (
    MediaArtefactCreate,
    MediaArtefactRead,
    MediaArtefactUpdate,
)

router = APIRouter(
    prefix="/media",
    tags=["Media"],
)


# CREATE
@router.post("/", response_model=MediaArtefactRead)
def create_media(
    media: MediaArtefactCreate,
    db: Session = Depends(get_db),
):
    new_media = MediaArtefact(
        **media.model_dump()
    )

    db.add(new_media)
    db.commit()
    db.refresh(new_media)

    return new_media


# READ ALL
@router.get("/", response_model=List[MediaArtefactRead])
def read_all_media(
    db: Session = Depends(get_db),
):
    return db.query(MediaArtefact).all()


# READ SINGLE
@router.get("/{id}", response_model=MediaArtefactRead)
def read_media(
    id: int,
    db: Session = Depends(get_db),
):
    db_media = (
        db.query(MediaArtefact)
        .filter(MediaArtefact.id == id)
        .first()
    )

    if not db_media:
        raise HTTPException(
            status_code=404,
            detail="Média non trouvé",
        )

    return db_media


# UPDATE
@router.put("/{id}", response_model=MediaArtefactRead)
def update_media(
    id: int,
    media: MediaArtefactUpdate,
    db: Session = Depends(get_db),
):
    db_media = (
        db.query(MediaArtefact)
        .filter(MediaArtefact.id == id)
        .first()
    )

    if not db_media:
        raise HTTPException(
            status_code=404,
            detail="Média non trouvé",
        )

    update_data = media.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_media, key, value)

    db.commit()
    db.refresh(db_media)

    return db_media


# DELETE
@router.delete("/{id}")
def delete_media(
    id: int,
    db: Session = Depends(get_db),
):
    db_media = (
        db.query(MediaArtefact)
        .filter(MediaArtefact.id == id)
        .first()
    )

    if not db_media:
        raise HTTPException(
            status_code=404,
            detail="Média non trouvé",
        )

    db.delete(db_media)
    db.commit()

    return {
        "message": "Média supprimé"
    }