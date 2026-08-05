# schemas/like.py
from pydantic import BaseModel
from datetime import datetime

class LikeBase(BaseModel):
    publication_id: int

class LikeCreate(LikeBase):
    pass

class LikeOut(LikeBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class LikeStats(BaseModel):
    publication_id: int
    likes_count: int
    user_has_liked: bool

    # ✅ AJOUT RECOMMANDÉ : Pour permettre l'instanciation directe depuis un objet SQLAlchemy
    class Config:
        from_attributes = True

# ==============================================================================
# NOUVEAU SCHÉMA AJOUTÉ À LA FIN (SANS RIEN SUPPRIMER)
# ==============================================================================
class LikeActionResponse(BaseModel):
    publication_id: int
    likes_count: int
    user_has_liked: bool