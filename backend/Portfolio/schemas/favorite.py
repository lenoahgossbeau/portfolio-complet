# schemas/favorite.py

from pydantic import BaseModel
from datetime import datetime


class FavoriteBase(BaseModel):
    publication_id: int


class FavoriteCreate(FavoriteBase):
    pass


class FavoriteOut(FavoriteBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class FavoriteStats(BaseModel):
    publication_id: int
    favorites_count: int
    user_has_favorited: bool


class FavoriteActionResponse(BaseModel):
    publication_id: int
    favorites_count: int
    user_has_favorited: bool