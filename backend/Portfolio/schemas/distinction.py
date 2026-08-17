# schemas/distinction.py

from pydantic import BaseModel, ConfigDict
from typing import Optional


class DistinctionBase(BaseModel):
    profile_id: int
    year: int
    title: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class DistinctionCreate(DistinctionBase):
    pass


class DistinctionUpdate(BaseModel):
    profile_id: Optional[int] = None
    year: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class DistinctionRead(DistinctionBase):
    id: int
