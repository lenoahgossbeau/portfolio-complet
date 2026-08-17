from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    profile_id = Column(
        Integer,
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False
    )

    operator = Column(String(20), nullable=False)

    phone = Column(String(20), nullable=False)

    amount = Column(Float, nullable=False)

    transaction_id = Column(
        String(100),
        unique=True,
        nullable=False
    )

    status = Column(
        String(20),
        default="SUCCESS"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    profile = relationship(
        "Profile",
        back_populates="payments"
    )

    def __repr__(self):
        return (
            f"<Payment(id={self.id}, amount={self.amount}, status={self.status})>"
        )