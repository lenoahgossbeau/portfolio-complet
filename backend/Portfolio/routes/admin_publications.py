from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from auth.jwt import get_current_user

from models.user import User
from models.publication import Publication
from models.profile import Profile
from models.audit import Audit
from schemas.publication import PublicationCreate, PublicationUpdate

admin_publications_router = APIRouter(
    prefix="/admin/publications",
    tags=["Admin Publications"]
)


# ===============================
# Vérification administrateur
# ===============================
def check_admin(current_user: User):
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=403,
            detail="Accès réservé aux administrateurs"
        )


# ===============================
# Liste de toutes les publications
# ===============================
@admin_publications_router.get("/")
def list_publications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    check_admin(current_user)

    publications = (
        db.query(Publication)
        .join(Profile, Publication.profile_id == Profile.id)
        .join(User, Profile.user_id == User.id)
        .order_by(Publication.created_at.desc())
        .all()
    )

    audit = Audit(
        user_id=current_user.id,
        user_role=current_user.role,
        action_description="Consultation de toutes les publications",
        date=datetime.now(timezone.utc)
    )

    db.add(audit)
    db.commit()

    # ✅ Transformation des objets SQLAlchemy en dictionnaires JSON
    result = []
    for pub in publications:
        result.append({
            "id": pub.id,
            "title": pub.title,
            "year": pub.year,
            "journal": pub.journal,
            "doi": pub.doi,
            "researcher": f"{pub.profile.first_name} {pub.profile.last_name}"
            if pub.profile else "Inconnu"
        })

    return result


# ===============================
# Créer une publication
# ===============================
@admin_publications_router.post("/")
def create_publication(
    publication_data: PublicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_admin(current_user)

    # Vérifier que le profil existe
    profile = (
        db.query(Profile)
        .filter(Profile.id == publication_data.profile_id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profil chercheur introuvable"
        )

    # Créer la publication
    publication = Publication(
        profile_id=publication_data.profile_id,
        year=publication_data.year,
        title=publication_data.title,
        coauthor=publication_data.coauthor,
        journal=publication_data.journal,
        doi=publication_data.doi,
    )

    db.add(publication)
    db.commit()
    db.refresh(publication)

    # Journal d'audit
    audit = Audit(
        user_id=current_user.id,
        user_role=current_user.role,
        action_description=f"Création publication : {publication.title}",
        date=datetime.now(timezone.utc)
    )

    db.add(audit)
    db.commit()

    return {
        "success": True,
        "message": "Publication créée avec succès",
        "publication": {
            "id": publication.id,
            "title": publication.title,
            "year": publication.year,
            "journal": publication.journal,
            "doi": publication.doi,
            "researcher": f"{profile.first_name} {profile.last_name}"
            if profile.first_name or profile.last_name
            else "Inconnu"
        }
    }


# ===============================
# Détail d'une publication
# ===============================
@admin_publications_router.get("/{publication_id}")
def get_publication(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    check_admin(current_user)

    publication = (
        db.query(Publication)
        .filter(Publication.id == publication_id)
        .first()
    )

    if not publication:
        raise HTTPException(
            status_code=404,
            detail="Publication introuvable"
        )

    return publication


# ===============================
# Modifier une publication
# ===============================
@admin_publications_router.put("/{publication_id}")
def update_publication(
    publication_id: int,
    publication_data: PublicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_admin(current_user)

    publication = (
        db.query(Publication)
        .filter(Publication.id == publication_id)
        .first()
    )

    if not publication:
        raise HTTPException(
            status_code=404,
            detail="Publication introuvable"
        )

    if publication_data.year is not None:
        publication.year = publication_data.year

    if publication_data.title is not None:
        publication.title = publication_data.title

    if publication_data.coauthor is not None:
        publication.coauthor = publication_data.coauthor

    if publication_data.journal is not None:
        publication.journal = publication_data.journal

    if publication_data.doi is not None:
        publication.doi = publication_data.doi

    if publication_data.description is not None:
        publication.description = publication_data.description

    if publication_data.image is not None:
        publication.image = publication_data.image

    if publication_data.link is not None:
        publication.link = publication_data.link

    db.commit()
    db.refresh(publication)

    audit = Audit(
        user_id=current_user.id,
        user_role=current_user.role,
        action_description=f"Modification publication : {publication.title}",
        date=datetime.now(timezone.utc)
    )

    db.add(audit)
    db.commit()

    return {
        "success": True,
        "message": "Publication modifiée avec succès",
        "publication": {
            "id": publication.id,
            "title": publication.title,
            "year": publication.year,
            "coauthor": publication.coauthor,
            "journal": publication.journal,
            "doi": publication.doi,
            "description": publication.description,
            "image": publication.image,
            "link": publication.link,
            "researcher": (
                f"{publication.profile.first_name} {publication.profile.last_name}"
                if publication.profile
                else "Inconnu"
            ),
        }
    }


# ===============================
# Suppression d'une publication
# ===============================
@admin_publications_router.delete("/{publication_id}")
def delete_publication(
    publication_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    check_admin(current_user)

    publication = (
        db.query(Publication)
        .filter(Publication.id == publication_id)
        .first()
    )

    if not publication:
        raise HTTPException(
            status_code=404,
            detail="Publication introuvable"
        )

    title = publication.title

    db.delete(publication)

    audit = Audit(
        user_id=current_user.id,
        user_role=current_user.role,
        action_description=f"Suppression publication : {title}",
        date=datetime.now(timezone.utc)
    )

    db.add(audit)
    db.commit()

    return {
        "success": True,
        "message": "Publication supprimée avec succès"
    }