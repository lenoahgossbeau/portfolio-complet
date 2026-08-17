# schemas/media.py

from pydantic import BaseModel, ConfigDict
from typing import Optional


class MediaArtefactBase(BaseModel):
    profile_id: int
    name: str
    url: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class MediaArtefactCreate(MediaArtefactBase):
    pass


class MediaArtefactUpdate(BaseModel):
    profile_id: Optional[int] = None
    name: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class MediaArtefactRead(MediaArtefactBase):
    id: int