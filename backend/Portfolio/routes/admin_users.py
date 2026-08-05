from fastapi import APIRouter, Depends, HTTPException, Query, Request, UploadFile, File, Form
from fastapi.responses import StreamingResponse, HTMLResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from io import StringIO
import csv
import json
import os
import shutil
import bcrypt
from datetime import datetime, timezone

from database import get_db
from models.user import User
from models.audit import Audit
from models.profile import Profile
from services.researcher_import import ResearcherImporter
from models.cv import (
    TechnicalSkill,
    SoftSkill,
    Degree,
    Experience,
    Language
)
from models.publication import Publication
from models.project import Project
from auth.jwt import get_current_user
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

admin_users_router = APIRouter(
    prefix="/admin/users",
    tags=["Admin Users"]
)

templates = Jinja2Templates(directory="templates")

class RoleChangeRequest(BaseModel):
    role: str

class UserCreateRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    role: str = "researcher"

# ======================
# LISTE DES UTILISATEURS
# ======================
@admin_users_router.get("/")
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: str = Query(None),
    status: str = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(100, ge=1, le=200)
):
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")

    query = db.query(User)

    if role:
        query = query.filter(User.role == role)
    if status:
        query = query.filter(User.status == status)

    total = query.count()
    users = query.offset((page - 1) * per_page).limit(per_page).all()

    audit_log = Audit(
        user_id=current_user.id,
        user_role=current_user.role,
        action_description=f"Consultation utilisateurs (role={role}, status={status}, page={page})",
        date=datetime.now(timezone.utc)
    )
    db.add(audit_log)
    db.commit()

    return {
        "total": total,
        "page": page,
        "per_page": per_page,
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "role": u.role,
                "status": u.status,
                "profile": {
                    "id": u.profile.id,
                    "first_name": u.profile.first_name if u.profile else None,
                    "last_name": u.profile.last_name if u.profile else None,
                    "grade": u.profile.grade if u.profile else None,
                    "specialite": u.profile.specialite if hasattr(u.profile, 'specialite') else None,
                } if u.profile else None
            }
            for u in users
        ]
    }

# ======================
# CRÉATION D'UN UTILISATEUR
# ======================
@admin_users_router.post("/", status_code=201)
def create_user(
    payload: UserCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    hashed = bcrypt.hashpw(payload.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    is_admin_role = payload.role in ["admin", "super_admin"]
    
    new_user = User(
        email=payload.email,
        password=hashed,
        role=payload.role,
        status="active" if is_admin_role else "inactive",
        is_active=is_admin_role
    )
    db.add(new_user)
    db.flush()

    profile = Profile(
        user_id=new_user.id,
        first_name=payload.first_name,
        last_name=payload.last_name
    )
    db.add(profile)
    db.commit()

    if not is_admin_role:
        from auth.jwt import create_activation_token
        token = create_activation_token(new_user.email)
        activation_link = f"http://localhost:3000/auth/activate?token={token}"
        print(f"\n🔗 LIEN D'ACTIVATION POUR {new_user.email} :\n{activation_link}\n")
        return {"message": "Chercheur créé avec succès.", "user_id": new_user.id}
    else:
        return {"message": f"Admin {payload.role} créé avec succès", "user_id": new_user.id}

# ======================
# EXPORT CSV
# ======================
@admin_users_router.get("/export")
def export_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    role: str = Query(None),
    status: str = Query(None)
):
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")

    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if status:
        query = query.filter(User.status == status)

    users = query.all()

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Email", "Role", "Status", "Prénom", "Nom"])
    for u in users:
        writer.writerow([
            u.id, u.email, u.role, u.status,
            u.profile.first_name if u.profile else "",
            u.profile.last_name if u.profile else ""
        ])

    output.seek(0)

    audit_log = Audit(
        user_id=current_user.id,
        user_role=current_user.role,
        action_description=f"Export CSV utilisateurs",
        date=datetime.now(timezone.utc)
    )
    db.add(audit_log)
    db.commit()

    return StreamingResponse(output, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=users_export.csv"
    })

# ======================
# PAGE HTML
# ======================
@admin_users_router.get("/page", response_class=HTMLResponse)
def users_page(request: Request, current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    return templates.TemplateResponse(request, "users.html")

# ======================
# CHANGER LE RÔLE
# ======================
@admin_users_router.put("/{user_id}/role")
def change_user_role(
    user_id: int,
    payload: RoleChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Seul un super_admin peut changer les rôles")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    new_role = payload.role
    if new_role not in ["researcher", "admin", "super_admin"]:
        raise HTTPException(status_code=400, detail="Rôle invalide")
    
    old_role = user.role
    user.role = new_role
    db.commit()
    
    audit_log = Audit(
        user_id=current_user.id,
        user_role=current_user.role,
        action_description=f"Changement de rôle de {user.email} : {old_role} → {new_role}",
        date=datetime.now(timezone.utc)
    )
    db.add(audit_log)
    db.commit()
    
    return {
        "message": f"Rôle de {user.email} changé avec succès",
        "user_id": user.id,
        "old_role": old_role,
        "new_role": new_role
    }

# ======================
# DETAIL D'UN UTILISATEUR
# ======================
@admin_users_router.get("/{user_id}")
def get_user_details(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=403,
            detail="Accès réservé aux administrateurs"
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Utilisateur non trouvé"
        )

    profile_id = user.profile.id if user.profile else None

    technical_skills = []
    soft_skills = []
    languages = []
    degrees = []
    experiences = []

    if profile_id:
        # Technical skills
        tech_result = db.execute(
            text("SELECT id, skill_name, level FROM technical_skills WHERE profile_id = :pid"),
            {"pid": profile_id}
        )

        technical_skills = [
            {
                "id": row[0],
                "name": row[1],
                "level": row[2]
            }
            for row in tech_result
        ]

        # Soft skills
        soft_result = db.execute(
            text("SELECT id, skill_name FROM soft_skills WHERE profile_id = :pid"),
            {"pid": profile_id}
        )

        soft_skills = [
            {
                "id": row[0],
                "name": row[1],
                "level": 50
            }
            for row in soft_result
        ]

        # Langues
        lang_result = db.execute(
            text("SELECT id, language, level FROM languages WHERE profile_id = :pid"),
            {"pid": profile_id}
        )

        languages = [
            {
                "id": row[0],
                "name": row[1],
                "level": row[2],
                "percent": 50
            }
            for row in lang_result
        ]

        # Diplômes
        degree_result = db.execute(
            text("SELECT id, title, institution, year, description FROM degrees WHERE profile_id = :pid"),
            {"pid": profile_id}
        )

        degrees = [
            {
                "id": row[0],
                "title": row[1],
                "institution": row[2],
                "year": row[3],
                "description": row[4] or ""
            }
            for row in degree_result
        ]

        # Expériences
        exp_result = db.execute(
            text("SELECT id, title, company, start_date, end_date, description FROM experiences WHERE profile_id = :pid"),
            {"pid": profile_id}
        )

        experiences = [
            {
                "id": row[0],
                "title": row[1],
                "company": row[2],
                "start_date": str(row[3]),
                "end_date": str(row[4]) if row[4] else None,
                "description": row[5] or ""
            }
            for row in exp_result
        ]

    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "status": user.status,
        "profile": {
            "first_name": user.profile.first_name if user.profile else None,
            "last_name": user.profile.last_name if user.profile else None,
            "grade": user.profile.grade if user.profile else None,
            "specialite": getattr(user.profile, "specialite", None) if user.profile else None,
            "diplome": getattr(user.profile, "diplome", None) if user.profile else None,
            "bio": getattr(user.profile, "bio", None) if user.profile else None,
            "description": getattr(user.profile, "description", None) if user.profile else None,
            "avatar": user.profile.profile_picture if user.profile else None,
            "profile_picture": user.profile.profile_picture if user.profile else None,
            "linkedin": getattr(user.profile, "linkedin", None) if user.profile else None,
            "whatsapp": getattr(user.profile, "whatsapp", None) if user.profile else None,
            "twitter": getattr(user.profile, "twitter", None) if user.profile else None,
            "github": getattr(user.profile, "github", None) if user.profile else None,
        } if user.profile else None,
        "project_count": len(user.profile.projects) if user.profile else 0,
        "publication_count": len(user.profile.publications) if user.profile else 0,
        "cv_url": user.profile.cv_url if user.profile else None,
        "projects": [
            {
                "id": project.id,
                "title": project.title,
                "year": project.year,
                "description": project.description,
                "budget": float(project.budget) if project.budget else None,
                "coauthor": project.coauthor,
            }
            for project in (user.profile.projects if user.profile else [])
        ],
        "publications": [
            {
                "id": publication.id,
                "title": publication.title,
                "year": publication.year,
                "journal": publication.journal,
                "doi": publication.doi,
                "coauthor": publication.coauthor,
            }
            for publication in (user.profile.publications if user.profile else [])
        ],
        "academic_careers": [
            {
                "id": career.id,
                "year": career.year,
                "title_formation": career.title_formation,
                "diplome": career.diplome,
                "description": career.description,
            }
            for career in (user.profile.academic_careers if user.profile else [])
        ],
        "technical_skills": technical_skills,
        "soft_skills": soft_skills,
        "languages": languages,
        "degrees": degrees,
        "experiences": experiences,
    }

# ======================
# SUPPRIMER UN UTILISATEUR
# ======================
@admin_users_router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Vous ne pouvez pas supprimer votre propre compte")
    
    audit_log = Audit(
        user_id=current_user.id,
        user_role=current_user.role,
        action_description=f"Suppression de l'utilisateur {user.email} (ID: {user.id})",
        date=datetime.now(timezone.utc)
    )
    db.add(audit_log)
    db.delete(user)
    db.commit()
    
    return None

# ======================
# IMPORT CONTENU INITIAL
# ======================
@admin_users_router.post("/{user_id}/import-content")
def import_content(
    user_id: int,

    # Informations personnelles
    first_name: str = Form(None),
    last_name: str = Form(None),
    gender: str = Form(None),
    grade: str = Form(None),
    specialite: str = Form(None),
    diplome: str = Form(None),

    # Présentation
    description: str = Form(None),
    bio: str = Form(None),

    # Contacts
    email: str = Form(None),
    linkedin: str = Form(None),
    whatsapp: str = Form(None),
    twitter: str = Form(None),
    github: str = Form(None),

    # Fichiers
    cv: UploadFile = File(None),
    photo: UploadFile = File(None),
    publications: UploadFile = File(None),
    projects: UploadFile = File(None),
    technical_skills: UploadFile = File(None),
    soft_skills: UploadFile = File(None),
    languages: UploadFile = File(None),
    degrees: UploadFile = File(None),
    experiences: UploadFile = File(None),

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    if user.role != "researcher":
        raise HTTPException(status_code=400, detail="Seul un chercheur peut recevoir du contenu initial")
    
    profile = user.profile
    if not profile:
        profile = Profile(user_id=user.id)
        db.add(profile)
        db.flush()

    importer = ResearcherImporter(db)
    
    # ==================== PROFIL ====================
    profile_data = {
        "first_name": first_name,
        "last_name": last_name,
        "gender": gender,
        "grade": grade,
        "specialite": specialite,
        "diplome": diplome,
        "description": description,
        "bio": bio,
        "email": email,
        "linkedin": linkedin,
        "whatsapp": whatsapp,
        "twitter": twitter,
        "github": github,
    }

    # On enlève les champs non renseignés
    profile_data = {
        key: value
        for key, value in profile_data.items()
        if value not in (None, "")
    }

    if profile_data:
        importer.update_profile(profile, profile_data)
    
    # ==================== CV ====================
    if cv:
        cv_dir = "uploads/cv"
        os.makedirs(cv_dir, exist_ok=True)
        cv_filename = f"{user.id}_{cv.filename}"
        cv_path = os.path.join(cv_dir, cv_filename)
        with open(cv_path, "wb") as buffer:
            shutil.copyfileobj(cv.file, buffer)
        importer.update_profile(
            profile,
            {},
            cv_url=f"/{cv_path}"
        )
    
    # ==================== PHOTO ====================
    if photo:
        photo_dir = "uploads/photos"
        os.makedirs(photo_dir, exist_ok=True)
        photo_filename = f"{user.id}_{photo.filename}"
        photo_path = os.path.join(photo_dir, photo_filename)
        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
        importer.update_profile(
            profile,
            {},
            profile_picture=f"/{photo_path}"
        )
    
    # ==================== PUBLICATIONS ====================
    if publications:
        try:
            data = json.load(publications.file)
            importer.clear_publications(profile.id)
            importer.import_publications(profile.id, data)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Erreur import publications: {str(e)}"
            )
    
    # ==================== PROJETS ====================
    if projects:
        try:
            data = json.load(projects.file)
            importer.clear_projects(profile.id)
            importer.import_projects(profile.id, data)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Erreur import projets: {str(e)}"
            )
    
    # ==================== TECHNICAL SKILLS ====================
    if technical_skills:
        try:
            data = json.load(technical_skills.file)
            importer.clear_technical_skills(profile.id)
            importer.import_technical_skills(profile.id, data)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Erreur import compétences techniques: {str(e)}"
            )
    
    # ==================== SOFT SKILLS ====================
    if soft_skills:
        try:
            data = json.load(soft_skills.file)
            importer.clear_soft_skills(profile.id)
            importer.import_soft_skills(profile.id, data)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Erreur import soft skills: {str(e)}"
            )
    
    # ==================== LANGUES ====================
    if languages:
        try:
            data = json.load(languages.file)
            importer.clear_languages(profile.id)
            importer.import_languages(profile.id, data)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Erreur import langues: {str(e)}"
            )
    
    # ==================== DEGRES ====================
    if degrees:
        try:
            data = json.load(degrees.file)
            importer.clear_degrees(profile.id)
            importer.import_degrees(profile.id, data)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Erreur import diplômes: {str(e)}"
            )
    
    # ==================== EXPERIENCES ====================
    if experiences:
        try:
            data = json.load(experiences.file)
            importer.clear_experiences(profile.id)
            importer.import_experiences(profile.id, data)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Erreur import expériences: {str(e)}"
            )
    
    importer.save()
    
    return {
        "message": "Contenu importé avec succès",
        "user_id": user.id,
        "bio_updated": bool(bio),
        "cv_uploaded": cv is not None,
        "photo_uploaded": photo is not None,
        "technical_skills_imported": technical_skills is not None,
        "soft_skills_imported": soft_skills is not None,
        "languages_imported": languages is not None,
        "degrees_imported": degrees is not None,
        "experiences_imported": experiences is not None,
        "publications_imported": publications is not None,
        "projects_imported": projects is not None
    }

# ======================
# ACTIVER / DÉSACTIVER
# ======================
@admin_users_router.put("/{user_id}/status")
def change_user_status(
    user_id: int,
    active: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=403,
            detail="Accès réservé aux administrateurs"
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Utilisateur non trouvé"
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Vous ne pouvez pas modifier votre propre statut"
        )

    user.is_active = active
    user.status = "active" if active else "inactive"

    audit_log = Audit(
        user_id=current_user.id,
        user_role=current_user.role,
        action_description=(
            f"{'Activation' if active else 'Désactivation'} "
            f"de l'utilisateur {user.email} (ID: {user.id})"
        ),
        date=datetime.now(timezone.utc)
    )

    db.add(audit_log)
    db.commit()
    db.refresh(user)

    return {
        "message": (
            "Utilisateur activé avec succès"
            if active
            else "Utilisateur désactivé avec succès"
        ),
        "user_id": user.id,
        "status": user.status,
        "is_active": user.is_active
    }