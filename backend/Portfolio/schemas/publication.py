# schemas/publication.py
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class PublicationBase(BaseModel):
    year: int = Field(..., ge=1900, le=2100, description="Année de publication")
    title: str = Field(..., min_length=1, max_length=500, description="Titre de la publication")
    coauthor: List[str] = Field(default_factory=list, description="Liste des coauteurs")
    
    # Optionnels
    journal: Optional[str] = Field(None, max_length=300, description="Journal/conférence")
    doi: Optional[str] = Field(None, max_length=100, description="DOI de la publication")
    description: Optional[str] = Field(None, description="Description de la publication")
    
    image: Optional[str] = Field(None, description="Image de la publication")
    link: Optional[str] = Field(None, description="Lien de la publication")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "year": 2024,
                "title": "Machine Learning for Scientific Discovery",
                "coauthor": ["Alice Smith", "Bob Johnson"],
                "journal": "Nature",
                "doi": "10.1038/s41586-024-07501-3",
                "description": "Une étude sur l'application du machine learning dans les découvertes scientifiques.",
                "image": "https://example.com/image.jpg",
                "link": "https://example.com/publication"
            }
        }
    )

class PublicationCreate(PublicationBase):
    """Schéma utilisé pour créer une publication."""
    
    profile_id: int  # ✅ Ajout du champ requis pour lier au chercheur

class PublicationUpdate(BaseModel):
    year: Optional[int] = Field(None, ge=1900, le=2100)
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    coauthor: Optional[List[str]] = None
    journal: Optional[str] = None
    doi: Optional[str] = None
    description: Optional[str] = None
    
    image: Optional[str] = None
    link: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class PublicationOut(PublicationBase):
    id: int
    profile_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)