from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
)
from sqlalchemy.orm import Session
from database import get_db
from models.publication import Publication
from models.comment import Comment
from models.audit import Audit
from models.user import User
from models.profile import Profile
from schemas.publication import PublicationCreate, PublicationOut, PublicationUpdate
from schemas.comment import CommentCreate, CommentOut
from auth.dependencies import get_current_user
import os
import shutil
from datetime import datetime

router = APIRouter(
    tags=["Publications"]
)

PUBLICATION_UPLOAD_DIR = "uploads/publications"
os.makedirs(PUBLICATION_UPLOAD_DIR, exist_ok=True)

# ================== UTILITAIRES ==================
def log_audit(db: Session, user: User, description: str):
    audit_log = Audit(
        user_id=user.id,
        user_role=user.role,
        action_description=description
    )
    db.add(audit_log)
    db.commit()

def get_current_profile(db: Session, current_user: User) -> Profile:
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profil chercheur introuvable")
    return profile

def get_user_publication(db: Session, profile: Profile, pub_id: int) -> Publication:
    publication = (
        db.query(Publication)
        .filter(Publication.id == pub_id, Publication.profile_id == profile.id)
        .first()
    )
    if not publication:
        raise HTTPException(status_code=404, detail="Publication non trouvée")
    return publication

# ================== UPLOAD IMAGE ==================
@router.post("/upload-image")
def upload_publication_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Seules les images sont acceptées.")

    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)

    if size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image trop volumineuse.")

    extension = os.path.splitext(file.filename)[1]
    filename = f"publication_{current_user.id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}{extension}"
    filepath = os.path.join(PUBLICATION_UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"success": True, "image_url": f"/uploads/publications/{filename}"}

# ================== CRÉER UNE PUBLICATION ==================
@router.post("/", response_model=PublicationOut)
def create_publication(pub: PublicationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = get_current_profile(db, current_user)
    new_pub = Publication(**pub.dict(exclude={"profile_id"}), profile_id=profile.id)
    db.add(new_pub)
    db.commit()
    db.refresh(new_pub)

    log_audit(db, current_user, f"Publication créée: {new_pub.title}")
    return new_pub

# ================== LISTER LES PUBLICATIONS ==================
@router.get("/", response_model=list[PublicationOut])
def get_publications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = get_current_profile(db, current_user)
    return (
        db.query(Publication)
        .filter(Publication.profile_id == profile.id)
        .order_by(Publication.created_at.desc())
        .all()
    )

# ================== LIRE UNE PUBLICATION ==================
@router.get("/{pub_id}", response_model=PublicationOut)
def get_publication(pub_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = get_current_profile(db, current_user)
    pub = get_user_publication(db, profile, pub_id)

    # ✅ Incrémenter les vues
    pub.views = (pub.views or 0) + 1
    db.commit()
    db.refresh(pub)

    return pub

# ================== METTRE À JOUR UNE PUBLICATION ==================
@router.put("/{pub_id}", response_model=PublicationOut)
def update_publication(pub_id: int, data: PublicationUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = get_current_profile(db, current_user)
    pub = get_user_publication(db, profile, pub_id)

    for key, value in data.dict(exclude_unset=True).items():
        setattr(pub, key, value)
    db.commit()
    db.refresh(pub)

    log_audit(db, current_user, f"Publication mise à jour: {pub.title}")
    return pub

# ================== SUPPRIMER UNE PUBLICATION ==================
@router.delete("/{pub_id}")
def delete_publication(pub_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = get_current_profile(db, current_user)
    pub = get_user_publication(db, profile, pub_id)

    db.delete(pub)
    db.commit()

    log_audit(db, current_user, f"Publication supprimée: {pub.title}")
    return {"status": "success", "message": "Publication supprimée ✅"}

# ================== AJOUTER UN COMMENTAIRE ==================
@router.post("/{pub_id}/comments", response_model=CommentOut)
def add_comment(pub_id: int, comment: CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = get_current_profile(db, current_user)
    pub = get_user_publication(db, profile, pub_id)

    new_comment = Comment(content=comment.content, publication_id=pub_id, user_id=current_user.id)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    log_audit(db, current_user, f"Commentaire ajouté sur publication {pub_id}")
    return new_comment

# ================== LISTER LES COMMENTAIRES ==================
@router.get("/{pub_id}/comments", response_model=list[CommentOut])
def get_comments(pub_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = get_current_profile(db, current_user)
    get_user_publication(db, profile, pub_id)
    return db.query(Comment).filter(Comment.publication_id == pub_id).all()

# ================== SUPPRIMER UN COMMENTAIRE ==================
@router.delete("/comments/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    comment = db.query(Comment).filter(Comment.id == comment_id, Comment.user_id == current_user.id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Commentaire introuvable ou non autorisé ❌")

    db.delete(comment)
    db.commit()

    log_audit(db, current_user, f"Commentaire supprimé (id={comment_id})")
    return {"status": "success", "message": "Commentaire supprimé ✅"}
