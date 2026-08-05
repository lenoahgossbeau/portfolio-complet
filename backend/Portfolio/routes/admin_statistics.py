from fastapi import APIRouter, Depends
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
    prefix="/admin/statistics",
    tags=["Admin Statistics"]
)


@router.get("/")
def get_platform_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Statistiques globales de la plateforme
    """

    # Nombre de chercheurs (profils)
    researchers = db.query(func.count(Profile.id)).scalar() or 0

    # Nombre de publications
    publications = db.query(func.count(Publication.id)).scalar() or 0

    # Nombre de likes
    likes = db.query(func.count(Like.id)).scalar() or 0

    # Nombre de favoris
    favorites = db.query(func.count(Favorite.id)).scalar() or 0

    # Nombre de commentaires
    comments = db.query(func.count(Comment.id)).scalar() or 0

    # Nombre total de vues
    views = db.query(func.coalesce(func.sum(Publication.views), 0)).scalar() or 0

    return {
        "researchers": researchers,
        "publications": publications,
        "likes": likes,
        "favorites": favorites,
        "comments": comments,
        "views": views,
    }