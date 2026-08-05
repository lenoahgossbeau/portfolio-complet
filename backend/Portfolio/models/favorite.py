# models/favorite.py

from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)

    publication_id = Column(
        Integer,
        ForeignKey("publications.id", ondelete="CASCADE"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )

    # Un utilisateur ne peut mettre une publication en favori qu'une seule fois
    __table_args__ = (
        UniqueConstraint(
            "publication_id",
            "user_id",
            name="unique_user_publication_favorite",
        ),
    )

    # ======================
    # RELATIONS
    # ======================

    publication = relationship(
        "Publication",
        back_populates="favorites"
    )

    user = relationship(
        "User",
        back_populates="favorites"
    )