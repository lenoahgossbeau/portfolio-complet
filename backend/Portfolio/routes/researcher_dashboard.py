from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from auth.jwt import get_current_user

from models.user import User
from models.profile import Profile
from models.publication import Publication
from models.like import Like
from models.favorite import Favorite
from models.comment import Comment

router = APIRouter(
    prefix="/researcher/dashboard",
    tags=["Researcher Dashboard"]
)


@router.get("/stats")
def researcher_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Statistiques du chercheur connecté
    """

    # Recherche du profil du chercheur
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profil introuvable"
        )

    # Publications du chercheur
    publications = (
        db.query(Publication)
        .filter(Publication.profile_id == profile.id)
        .all()
    )

    publication_ids = [p.id for p in publications]

    total_publications = len(publications)

    total_views = sum(p.views or 0 for p in publications)

    if publication_ids:

        total_likes = (
            db.query(func.count(Like.id))
            .filter(Like.publication_id.in_(publication_ids))
            .scalar()
        )

        total_favorites = (
            db.query(func.count(Favorite.id))
            .filter(Favorite.publication_id.in_(publication_ids))
            .scalar()
        )

        total_comments = (
            db.query(func.count(Comment.id))
            .filter(Comment.publication_id.in_(publication_ids))
            .scalar()
        )

    else:
        total_likes = 0
        total_favorites = 0
        total_comments = 0

    return {
        "total_publications": total_publications,
        "total_views": total_views,
        "total_likes": total_likes,
        "total_favorites": total_favorites,
        "total_comments": total_comments,
    }