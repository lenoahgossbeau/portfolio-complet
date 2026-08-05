# routes/project.py
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
)
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from datetime import datetime

from database import get_db
from models.project import Project
from models.user import User
from models.profile import Profile
from schemas.project import ProjectCreate, ProjectUpdate, ProjectOut
from auth.dependencies import get_current_user

router = APIRouter()

PROJECT_UPLOAD_DIR = "uploads/projects"
os.makedirs(PROJECT_UPLOAD_DIR, exist_ok=True)

def get_current_profile(
    db: Session,
    current_user: User
) -> Profile:
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profil chercheur introuvable"
        )

    return profile

@router.post("/upload-image")
def upload_project_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Seules les images sont acceptées."
        )

    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)

    if size > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="L'image ne doit pas dépasser 5 MB."
        )

    extension = os.path.splitext(file.filename)[1]

    filename = (
        f"project_{current_user.id}_"
        f"{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        f"{extension}"
    )

    filepath = os.path.join(PROJECT_UPLOAD_DIR, filename)

    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur upload : {str(e)}"
        )

    return {
        "success": True,
        "image_url": f"/uploads/projects/{filename}"
    }

@router.post("/", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Créer un nouveau projet"""
    
    profile = get_current_profile(db, current_user)

    db_project = Project(
        profile_id=profile.id,
        year=project.year,
        title=project.title,
        coauthor=project.coauthor,
        description=project.description,
        budget=project.budget,
        image=project.image,
        link=project.link,
    )

    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    return db_project

@router.get("/", response_model=List[ProjectOut])
def get_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer tous les projets du chercheur connecté"""
    profile = get_current_profile(db, current_user)
    
    projects = (
        db.query(Project)
        .filter(Project.profile_id == profile.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    return projects

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer un projet par ID (uniquement si appartient au chercheur)"""
    profile = get_current_profile(db, current_user)
    
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.profile_id == profile.id
        )
        .first()
    )
    
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")
    
    return project

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour un projet (uniquement si appartient au chercheur)"""
    profile = get_current_profile(db, current_user)
    
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.profile_id == profile.id
        )
        .first()
    )
    
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")

    update_data = project_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprimer un projet (uniquement si appartient au chercheur)"""
    profile = get_current_profile(db, current_user)
    
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.profile_id == profile.id
        )
        .first()
    )
    
    if not project:
        raise HTTPException(status_code=404, detail="Projet non trouvé")

    db.delete(project)
    db.commit()
    return None