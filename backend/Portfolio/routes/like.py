# routes/like.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.publication import Publication
from models.like import Like
# ✅ IMPORT MIS À JOUR
from schemas.like import LikeOut, LikeStats, LikeActionResponse
from auth.dependencies import get_current_user

router = APIRouter(
    prefix="/publications",
    tags=["Likes"]
)

# ================== AJOUTER UN LIKE ==================
# ✅ DÉCORATEUR MODIFIÉ
@router.post("/{publication_id}/like", response_model=LikeActionResponse)
def add_like(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ajouter un like sur une publication"""
    
    # Vérifier que la publication existe
    publication = db.query(Publication).filter(Publication.id == publication_id).first()
    if not publication:
        raise HTTPException(status_code=404, detail="Publication non trouvée")
    
    # Vérifier si l'utilisateur a déjà liké
    existing = db.query(Like).filter(
        Like.publication_id == publication_id,
        Like.user_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Vous avez déjà liké cette publication")
    
    # Créer le like
    like = Like(
        publication_id=publication_id,
        user_id=current_user.id
    )
    db.add(like)
    db.commit()
    db.refresh(like)
    
    # ✅ RETOUR MODIFIÉ
    likes_count = db.query(Like).filter(
        Like.publication_id == publication_id
    ).count()

    return LikeActionResponse(
        publication_id=publication_id,
        likes_count=likes_count,
        user_has_liked=True
    )

# ================== RETIRER UN LIKE ==================
# ✅ DÉCORATEUR MODIFIÉ
@router.delete("/{publication_id}/like", response_model=LikeActionResponse)
def remove_like(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retirer un like d'une publication"""
    
    like = db.query(Like).filter(
        Like.publication_id == publication_id,
        Like.user_id == current_user.id
    ).first()
    
    if not like:
        raise HTTPException(status_code=404, detail="Like non trouvé")
    
    db.delete(like)
    db.commit()
    
    # ✅ RETOUR MODIFIÉ
    likes_count = db.query(Like).filter(
        Like.publication_id == publication_id
    ).count()

    return LikeActionResponse(
        publication_id=publication_id,
        likes_count=likes_count,
        user_has_liked=False
    )

# ================== STATISTIQUES DES LIKES ==================
@router.get("/{publication_id}/likes/stats", response_model=LikeStats)
def get_like_stats(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer les statistiques des likes d'une publication"""
    
    publication = db.query(Publication).filter(Publication.id == publication_id).first()
    if not publication:
        raise HTTPException(status_code=404, detail="Publication non trouvée")
    
    likes_count = db.query(Like).filter(Like.publication_id == publication_id).count()
    
    user_has_liked = db.query(Like).filter(
        Like.publication_id == publication_id,
        Like.user_id == current_user.id
    ).first() is not None
    
    return LikeStats(
        publication_id=publication_id,
        likes_count=likes_count,
        user_has_liked=user_has_liked
    )

# ================== LISTER LES PUBLICATIONS LIKÉES ==================
@router.get("/me/likes")
def get_my_likes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer toutes les publications likées par l'utilisateur"""
    
    likes = db.query(Like).filter(Like.user_id == current_user.id).all()
    publication_ids = [like.publication_id for like in likes]
    
    publications = db.query(Publication).filter(Publication.id.in_(publication_ids)).all()
    
    return publications