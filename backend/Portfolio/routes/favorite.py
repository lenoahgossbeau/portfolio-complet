# routes/favorite.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from auth.dependencies import get_current_user

from models.user import User
from models.publication import Publication
from models.favorite import Favorite

from schemas.favorite import (
    FavoriteOut,
    FavoriteStats,
    FavoriteActionResponse,
)

router = APIRouter(
    prefix="/publications",
    tags=["Favorites"]
)


# ================== AJOUTER UN FAVORI ==================

@router.post(
    "/{publication_id}/favorite",
    response_model=FavoriteActionResponse
)
def add_favorite(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    publication = db.query(Publication).filter(
        Publication.id == publication_id
    ).first()

    if not publication:
        raise HTTPException(
            status_code=404,
            detail="Publication non trouvée"
        )

    existing = db.query(Favorite).filter(
        Favorite.publication_id == publication_id,
        Favorite.user_id == current_user.id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Cette publication est déjà dans vos favoris"
        )

    favorite = Favorite(
        publication_id=publication_id,
        user_id=current_user.id
    )

    db.add(favorite)
    db.commit()

    favorites_count = db.query(Favorite).filter(
        Favorite.publication_id == publication_id
    ).count()

    return FavoriteActionResponse(
        publication_id=publication_id,
        favorites_count=favorites_count,
        user_has_favorited=True
    )


# ================== RETIRER UN FAVORI ==================

@router.delete(
    "/{publication_id}/favorite",
    response_model=FavoriteActionResponse
)
def remove_favorite(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    favorite = db.query(Favorite).filter(
        Favorite.publication_id == publication_id,
        Favorite.user_id == current_user.id
    ).first()

    if not favorite:
        raise HTTPException(
            status_code=404,
            detail="Favori introuvable"
        )

    db.delete(favorite)
    db.commit()

    favorites_count = db.query(Favorite).filter(
        Favorite.publication_id == publication_id
    ).count()

    return FavoriteActionResponse(
        publication_id=publication_id,
        favorites_count=favorites_count,
        user_has_favorited=False
    )


# ================== STATISTIQUES ==================

@router.get(
    "/{publication_id}/favorites/stats",
    response_model=FavoriteStats
)
def get_favorite_stats(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    publication = db.query(Publication).filter(
        Publication.id == publication_id
    ).first()

    if not publication:
        raise HTTPException(
            status_code=404,
            detail="Publication non trouvée"
        )

    favorites_count = db.query(Favorite).filter(
        Favorite.publication_id == publication_id
    ).count()

    user_has_favorited = db.query(Favorite).filter(
        Favorite.publication_id == publication_id,
        Favorite.user_id == current_user.id
    ).first() is not None

    return FavoriteStats(
        publication_id=publication_id,
        favorites_count=favorites_count,
        user_has_favorited=user_has_favorited
    )


# ================== MES FAVORIS ==================

@router.get("/me/favorites")
def get_my_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    favorites = db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).all()

    publication_ids = [
        favorite.publication_id
        for favorite in favorites
    ]

    publications = db.query(Publication).filter(
        Publication.id.in_(publication_ids)
    ).all()

    return publications