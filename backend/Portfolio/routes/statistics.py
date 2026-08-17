from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.publication import Publication
from models.like import Like
from models.favorite import Favorite
from models.comment import Comment
from models.profile import Profile
from models.project import Project
from models.subscription import Subscription
from auth.dependencies import get_current_user
from typing import Optional
from pydantic import BaseModel
from sqlalchemy import func

# --- AJOUT POUR ÉVITER LES ERREURS DE MODULE (CHEMIN) ---
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# ----------------------------------------------------------

router = APIRouter(
    prefix="/publications",
    tags=["Statistics"]
)

class PublicationStats(BaseModel):
    publication_id: int
    likes_count: int
    favorites_count: int
    comments_count: int
    views_count: int

# ✅ NOUVELLE CLASSE DE STATISTIQUES GLOBALES
class ResearcherStatistics(BaseModel):
    publications: int
    projects: int
    likes: int
    favorites: int
    comments: int
    publication_views: int
    premium: bool
    premium_plan: str | None = None
    premium_end_date: str | None = None

@router.get("/{publication_id}/stats", response_model=PublicationStats)
def get_publication_stats(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Récupérer les statistiques d'une publication"""
    
    # Vérifier que la publication existe
    publication = db.query(Publication).filter(Publication.id == publication_id).first()
    if not publication:
        raise HTTPException(status_code=404, detail="Publication non trouvée")
    
    # Compter les likes
    likes_count = db.query(Like).filter(Like.publication_id == publication_id).count()
    
    # Compter les favoris
    favorites_count = db.query(Favorite).filter(Favorite.publication_id == publication_id).count()
    
    # Compter les commentaires
    comments_count = db.query(Comment).filter(Comment.publication_id == publication_id).count()
    
    # ✅ Nombre réel de vues (au lieu de simuler)
    views_count = publication.views
    
    return PublicationStats(
        publication_id=publication_id,
        likes_count=likes_count,
        favorites_count=favorites_count,
        comments_count=comments_count,
        views_count=views_count
    )

# ✅ NOUVELLE ROUTE POUR INCRÉMENTER LES VUES
@router.post("/{publication_id}/view")
def add_view(
    publication_id: int,
    db: Session = Depends(get_db)
):
    """Incrémente le nombre de vues d'une publication"""

    publication = db.query(Publication).filter(
        Publication.id == publication_id
    ).first()

    if not publication:
        raise HTTPException(
            status_code=404,
            detail="Publication non trouvée"
        )

    publication.views += 1

    db.commit()
    db.refresh(publication)

    return {
        "publication_id": publication.id,
        "views_count": publication.views
    }


# ==============================================================================
# ✅ STATISTIQUES DU CHERCHEUR CONNECTÉ (URL RENOMMÉE)
# ==============================================================================
@router.get("/researcher/statistics", response_model=ResearcherStatistics)
def get_my_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Récupération du profil
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

    # ===========================
    # Publications
    # ===========================
    publications = (
        db.query(Publication)
        .filter(Publication.profile_id == profile.id)
        .all()
    )

    publication_count = len(publications)

    publication_ids = [p.id for p in publications]

    # ===========================
    # Projets
    # ===========================
    project_count = (
        db.query(Project)
        .filter(Project.profile_id == profile.id)
        .count()
    )

    # ===========================
    # Likes
    # ===========================
    likes_count = (
        db.query(Like)
        .filter(Like.publication_id.in_(publication_ids))
        .count()
        if publication_ids else 0
    )

    # ===========================
    # Favoris
    # ===========================
    favorites_count = (
        db.query(Favorite)
        .filter(Favorite.publication_id.in_(publication_ids))
        .count()
        if publication_ids else 0
    )

    # ===========================
    # Commentaires
    # ===========================
    comments_count = (
        db.query(Comment)
        .filter(Comment.publication_id.in_(publication_ids))
        .count()
        if publication_ids else 0
    )

    # ===========================
    # Vues des publications
    # ===========================
    publication_views = sum(
        publication.views
        for publication in publications
    )

    # ===========================
    # Premium
    # ===========================
    subscription = (
        db.query(Subscription)
        .filter(Subscription.profile_id == profile.id)
        .first()
    )

    premium = False
    premium_plan = None
    premium_end_date = None

    if subscription:
        premium = True
        premium_plan = subscription.type
        premium_end_date = subscription.end_date

    return ResearcherStatistics(
        publications=publication_count,
        projects=project_count,
        likes=likes_count,
        favorites=favorites_count,
        comments=comments_count,
        publication_views=publication_views,
        premium=premium,
        premium_plan=premium_plan,
        premium_end_date=premium_end_date
    )