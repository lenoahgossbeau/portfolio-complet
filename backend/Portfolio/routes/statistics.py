from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.publication import Publication
from models.like import Like
from models.favorite import Favorite
from models.comment import Comment  # <--- AJOUT IMPORTANT
from auth.dependencies import get_current_user
from typing import Optional
from pydantic import BaseModel

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