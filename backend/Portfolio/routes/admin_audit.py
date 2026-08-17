from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models.audit import Audit
from models.user import User
from auth.jwt import get_current_user


router = APIRouter(
    prefix="/admin/audit",
    tags=["Admin Audit"]
)


@router.get("/logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """
    Récupère les journaux d'audit avec pagination.

    Accessible uniquement aux administrateurs.
    """

    # ==========================================================
    # VÉRIFICATION DES DROITS
    # ==========================================================
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=403,
            detail="Accès réservé aux administrateurs"
        )

    # ==========================================================
    # TOTAL DES LOGS
    # ==========================================================
    total = db.query(Audit).count()

    # ==========================================================
    # RÉCUPÉRATION DES LOGS
    # joinedload évite de faire une requête supplémentaire
    # pour chaque utilisateur.
    # ==========================================================
    logs = (
        db.query(Audit)
        .options(joinedload(Audit.user))
        .order_by(Audit.date.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    # ==========================================================
    # FORMATAGE DE LA RÉPONSE
    # ==========================================================
    formatted_logs = []

    for log in logs:
        user = log.user

        formatted_logs.append({
            "id": log.id,

            "user_id": log.user_id,

            "user_email": (
                user.email
                if user
                else None
            ),

            "user_role": (
                user.role
                if user
                else log.user_role
            ),

            "action_description": log.action_description,

            "date": (
                log.date.isoformat()
                if log.date
                else None
            ),
        })

    # ==========================================================
    # RÉPONSE
    # ==========================================================
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "logs": formatted_logs,
    }