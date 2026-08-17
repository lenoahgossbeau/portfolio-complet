from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.user import User
from models.profile import Profile
from models.publication import Publication
from models.project import Project
from models.cours import Cours
from models.distinction import Distinction
from models.media_artefact import MediaArtefact

from models.cv import (
    TechnicalSkill,
    SoftSkill,
    Language,
    Degree,
    Experience,
)


router = APIRouter(
    prefix="/researcher/public",
    tags=["Public Researcher"]
)


# ============================================================
# LISTE DES CHERCHEURS POUR LA PAGE D'ACCUEIL
# ============================================================

@router.get("/list")
def get_all_public_researchers(
    db: Session = Depends(get_db)
):
    """Récupère tous les chercheurs actifs et publiés."""

    researchers = db.query(User).filter(
        User.role == "researcher",
        User.status == "active",
        User.is_published == True
    ).all()

    result = []

    for r in researchers:

        profile = db.query(Profile).filter(
            Profile.user_id == r.id
        ).first()

        name = r.email.split("@")[0]

        if profile:
            if profile.first_name or profile.last_name:
                name = (
                    f"{profile.first_name or ''} "
                    f"{profile.last_name or ''}"
                ).strip()

        result.append({
            "id": r.id,
            "name": name if name else "Chercheur",
            "slug": r.slug,
            "bio": profile.bio if profile and profile.bio else "",
            "photo_url": (
                profile.profile_picture
                if profile
                else None
            ),
            "profession": (
                profile.grade
                if profile and profile.grade
                else "Chercheur"
            )
        })

    return result


# ============================================================
# ROUTE PUBLIQUE PAR SLUG
# ============================================================

@router.get("/slug/{slug}")
def get_public_researcher_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """Récupère un chercheur publié par son slug."""

    user = db.query(User).filter(
        User.slug == slug,
        User.role == "researcher",
        User.status == "active",
        User.is_published == True
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Chercheur non trouvé"
        )

    profile = db.query(Profile).filter(
        Profile.user_id == user.id
    ).first()

    # ========================================================
    # DONNÉES DU CHERCHEUR
    # ========================================================

    publications = (
        db.query(Publication)
        .filter(Publication.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    projects = (
        db.query(Project)
        .filter(Project.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    cours = (
        db.query(Cours)
        .filter(Cours.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    distinctions = (
        db.query(Distinction)
        .filter(Distinction.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    media_artefacts = (
        db.query(MediaArtefact)
        .filter(MediaArtefact.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    # ========================================================
    # DONNÉES DU CV
    # ========================================================

    skills_tech = (
        db.query(TechnicalSkill)
        .filter(TechnicalSkill.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    skills_soft = (
        db.query(SoftSkill)
        .filter(SoftSkill.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    languages = (
        db.query(Language)
        .filter(Language.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    degrees = (
        db.query(Degree)
        .filter(Degree.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    experiences = (
        db.query(Experience)
        .filter(Experience.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    # ========================================================
    # NOM
    # ========================================================

    name = user.email.split("@")[0]

    if profile:
        if profile.first_name or profile.last_name:
            name = (
                f"{profile.first_name or ''} "
                f"{profile.last_name or ''}"
            ).strip()

    # ========================================================
    # RÉPONSE
    # ========================================================

    return {

        "id": user.id,
        "email": user.email,
        "slug": user.slug,

        "name": name,

        "firstName": (
            profile.first_name
            if profile
            else ""
        ),

        "lastName": (
            profile.last_name
            if profile
            else ""
        ),

        "profession": (
            profile.grade
            if profile
            else ""
        ),

        "bio": (
            profile.bio
            if profile
            else ""
        ),

        "description": (
            profile.description
            if profile
            else ""
        ),

        "specialite": (
            profile.specialite
            if profile
            else ""
        ),

        "diplome": (
            profile.diplome
            if profile
            else ""
        ),

        "linkedin": (
            profile.linkedin
            if profile
            else ""
        ),

        "github": (
            profile.github
            if profile
            else ""
        ),

        "twitter": (
            profile.twitter
            if profile
            else ""
        ),

        "whatsapp": (
            profile.whatsapp
            if profile
            else ""
        ),

        "cvUrl": (
            profile.cv_url
            if profile
            else ""
        ),

        "avatar": (
            profile.profile_picture
            if profile
            else ""
        ),

        # ====================================================
        # PUBLICATIONS
        # ====================================================

        "publications": [
            {
                "id": pub.id,
                "title": pub.title,
                "year": pub.year,
                "description": getattr(
                    pub,
                    "description",
                    ""
                ),
                "link": getattr(
                    pub,
                    "link",
                    ""
                )
            }
            for pub in publications
        ],

        # ====================================================
        # PROJETS
        # ====================================================

        "projects": [
            {
                "id": proj.id,
                "title": proj.title,
                "year": proj.year,
                "description": (
                    proj.description
                    if proj.description
                    else ""
                ),
                "link": getattr(
                    proj,
                    "link",
                    ""
                )
            }
            for proj in projects
        ],

        # ====================================================
        # COURS
        # ====================================================

        "cours": [
            {
                "id": course.id,
                "title": course.title,
                "description": (
                    course.description
                    if course.description
                    else ""
                ),
                "curricula": (
                    course.curricula
                    if course.curricula
                    else ""
                )
            }
            for course in cours
        ],

        # ====================================================
        # DISTINCTIONS
        # ====================================================

        "distinctions": [
            {
                "id": distinction.id,
                "year": distinction.year,
                "title": distinction.title,
                "description": (
                    distinction.description
                    if distinction.description
                    else ""
                )
            }
            for distinction in distinctions
        ],

        # ====================================================
        # MEDIA ARTEFACTS
        # ====================================================

        "media_artefacts": [
            {
                "id": media.id,
                "name": media.name,
                "url": media.url,
                "description": (
                    media.description
                    if media.description
                    else ""
                )
            }
            for media in media_artefacts
        ],

        # ====================================================
        # COMPÉTENCES TECHNIQUES
        # ====================================================

        "technical_skills": [
            {
                "id": s.id,
                "name": s.skill_name,
                "level": s.level
            }
            for s in skills_tech
        ],

        # ====================================================
        # COMPÉTENCES SOFT
        # ====================================================

        "soft_skills": [
            {
                "id": s.id,
                "name": s.skill_name,
                "level": 100
            }
            for s in skills_soft
        ],

        # ====================================================
        # LANGUES
        # ====================================================

        "languages": [
            {
                "id": l.id,
                "name": l.language,
                "level": l.level,
                "percent": 100
            }
            for l in languages
        ],

        # ====================================================
        # DIPLÔMES
        # ====================================================

        "degrees": [
            {
                "id": d.id,
                "title": d.title,
                "institution": d.institution,
                "year": d.year,
                "description": d.description
            }
            for d in degrees
        ],

        # ====================================================
        # EXPÉRIENCES
        # ====================================================

        "experiences": [
            {
                "id": e.id,
                "title": e.title,
                "company": e.company,
                "start_date": (
                    e.start_date.isoformat()
                    if e.start_date
                    else None
                ),
                "end_date": (
                    e.end_date.isoformat()
                    if e.end_date
                    else None
                ),
                "description": e.description
            }
            for e in experiences
        ]
    }


# ============================================================
# ROUTE PUBLIQUE PAR ID
# ============================================================

@router.get("/id/{user_id}")
def get_public_researcher_by_id(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Récupère un chercheur publié par son ID."""

    user = db.query(User).filter(
        User.id == user_id,
        User.role == "researcher",
        User.status == "active",
        User.is_published == True
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Chercheur non trouvé"
        )

    profile = db.query(Profile).filter(
        Profile.user_id == user.id
    ).first()

    # ========================================================
    # DONNÉES
    # ========================================================

    publications = (
        db.query(Publication)
        .filter(Publication.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    projects = (
        db.query(Project)
        .filter(Project.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    cours = (
        db.query(Cours)
        .filter(Cours.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    distinctions = (
        db.query(Distinction)
        .filter(Distinction.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    media_artefacts = (
        db.query(MediaArtefact)
        .filter(MediaArtefact.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    # ========================================================
    # CV
    # ========================================================

    skills_tech = (
        db.query(TechnicalSkill)
        .filter(TechnicalSkill.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    skills_soft = (
        db.query(SoftSkill)
        .filter(SoftSkill.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    languages = (
        db.query(Language)
        .filter(Language.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    degrees = (
        db.query(Degree)
        .filter(Degree.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    experiences = (
        db.query(Experience)
        .filter(Experience.profile_id == profile.id)
        .all()
        if profile
        else []
    )

    # ========================================================
    # NOM
    # ========================================================

    name = user.email.split("@")[0]

    if profile:
        if profile.first_name or profile.last_name:
            name = (
                f"{profile.first_name or ''} "
                f"{profile.last_name or ''}"
            ).strip()

    # ========================================================
    # RÉPONSE
    # ========================================================

    return {

        "id": user.id,
        "email": user.email,
        "slug": user.slug,

        "name": name,

        "firstName": (
            profile.first_name
            if profile
            else ""
        ),

        "lastName": (
            profile.last_name
            if profile
            else ""
        ),

        "profession": (
            profile.grade
            if profile
            else ""
        ),

        "bio": (
            profile.bio
            if profile
            else ""
        ),

        "description": (
            profile.description
            if profile
            else ""
        ),

        "specialite": (
            profile.specialite
            if profile
            else ""
        ),

        "diplome": (
            profile.diplome
            if profile
            else ""
        ),

        "linkedin": (
            profile.linkedin
            if profile
            else ""
        ),

        "github": (
            profile.github
            if profile
            else ""
        ),

        "twitter": (
            profile.twitter
            if profile
            else ""
        ),

        "whatsapp": (
            profile.whatsapp
            if profile
            else ""
        ),

        "cvUrl": (
            profile.cv_url
            if profile
            else ""
        ),

        "avatar": (
            profile.profile_picture
            if profile
            else ""
        ),

        # ====================================================
        # PUBLICATIONS
        # ====================================================

        "publications": [
            {
                "id": pub.id,
                "title": pub.title,
                "year": pub.year,
                "description": getattr(
                    pub,
                    "description",
                    ""
                ),
                "link": getattr(
                    pub,
                    "link",
                    ""
                )
            }
            for pub in publications
        ],

        # ====================================================
        # PROJETS
        # ====================================================

        "projects": [
            {
                "id": proj.id,
                "title": proj.title,
                "year": proj.year,
                "description": (
                    proj.description
                    if proj.description
                    else ""
                ),
                "link": getattr(
                    proj,
                    "link",
                    ""
                )
            }
            for proj in projects
        ],

        # ====================================================
        # COURS
        # ====================================================

        "cours": [
            {
                "id": course.id,
                "title": course.title,
                "description": (
                    course.description
                    if course.description
                    else ""
                ),
                "curricula": (
                    course.curricula
                    if course.curricula
                    else ""
                )
            }
            for course in cours
        ],

        # ====================================================
        # DISTINCTIONS
        # ====================================================

        "distinctions": [
            {
                "id": distinction.id,
                "year": distinction.year,
                "title": distinction.title,
                "description": (
                    distinction.description
                    if distinction.description
                    else ""
                )
            }
            for distinction in distinctions
        ],

        # ====================================================
        # MEDIA ARTEFACTS
        # ====================================================

        "media_artefacts": [
            {
                "id": media.id,
                "name": media.name,
                "url": media.url,
                "description": (
                    media.description
                    if media.description
                    else ""
                )
            }
            for media in media_artefacts
        ],

        # ====================================================
        # COMPÉTENCES TECHNIQUES
        # ====================================================

        "technical_skills": [
            {
                "id": s.id,
                "name": s.skill_name,
                "level": s.level
            }
            for s in skills_tech
        ],

        # ====================================================
        # COMPÉTENCES SOFT
        # ====================================================

        "soft_skills": [
            {
                "id": s.id,
                "name": s.skill_name,
                "level": 100
            }
            for s in skills_soft
        ],

        # ====================================================
        # LANGUES
        # ====================================================

        "languages": [
            {
                "id": l.id,
                "name": l.language,
                "level": l.level,
                "percent": 100
            }
            for l in languages
        ],

        # ====================================================
        # DIPLÔMES
        # ====================================================

        "degrees": [
            {
                "id": d.id,
                "title": d.title,
                "institution": d.institution,
                "year": d.year,
                "description": d.description
            }
            for d in degrees
        ],

        # ====================================================
        # EXPÉRIENCES
        # ====================================================

        "experiences": [
            {
                "id": e.id,
                "title": e.title,
                "company": e.company,
                "start_date": (
                    e.start_date.isoformat()
                    if e.start_date
                    else None
                ),
                "end_date": (
                    e.end_date.isoformat()
                    if e.end_date
                    else None
                ),
                "description": e.description
            }
            for e in experiences
        ]
    }