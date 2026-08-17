from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from database import get_db
from auth.jwt import get_current_user

from models.user import User
from models.profile import Profile
from models.publication import Publication
from models.project import Project
from models.payment import Payment
from models.subscription import Subscription
from models.like import Like
from models.favorite import Favorite
from models.comment import Comment

from sqlalchemy.exc import SQLAlchemyError


router = APIRouter(
    prefix="/admin/statistics",
    tags=["Admin Statistics"]
)


# ==============================================================
# STATISTIQUES GLOBALES
# ==============================================================

@router.get("/")
def get_platform_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Statistiques globales de la plateforme.
    """

    # ----------------------------------------------------------
    # Chercheurs
    # ----------------------------------------------------------
    researchers = db.query(
        func.count(Profile.id)
    ).scalar() or 0

    # ----------------------------------------------------------
    # Publications
    # ----------------------------------------------------------
    publications = db.query(
        func.count(Publication.id)
    ).scalar() or 0

    # ----------------------------------------------------------
    # Projets
    # ----------------------------------------------------------
    projects = db.query(
        func.count(Project.id)
    ).scalar() or 0

    # ----------------------------------------------------------
    # Likes
    # ----------------------------------------------------------
    likes = db.query(
        func.count(Like.id)
    ).scalar() or 0

    # ----------------------------------------------------------
    # Favoris
    # ----------------------------------------------------------
    favorites = db.query(
        func.count(Favorite.id)
    ).scalar() or 0

    # ----------------------------------------------------------
    # Commentaires
    # ----------------------------------------------------------
    comments = db.query(
        func.count(Comment.id)
    ).scalar() or 0

    # ----------------------------------------------------------
    # Vues
    # ----------------------------------------------------------
    views = db.query(
        func.coalesce(
            func.sum(Publication.views),
            0
        )
    ).scalar() or 0

    # ----------------------------------------------------------
    # Paiements réussis
    # ----------------------------------------------------------
    payments = db.query(
        func.count(Payment.id)
    ).filter(
        Payment.status == "SUCCESS"
    ).scalar() or 0

    # ----------------------------------------------------------
    # REVENU TOTAL RÉEL
    # ----------------------------------------------------------
    total_revenue = db.query(
        func.coalesce(
            func.sum(Payment.amount),
            0
        )
    ).filter(
        Payment.status == "SUCCESS"
    ).scalar() or 0

    # ----------------------------------------------------------
    # NOMBRE D'ABONNEMENTS
    # ----------------------------------------------------------
    subscriptions = db.query(
        func.count(Subscription.id)
    ).scalar() or 0

    # ----------------------------------------------------------
    # TAUX DE RENOUVELLEMENT
    #
    # Un renouvellement = un profil possédant au moins
    # deux abonnements distincts.
    #
    # Le taux est calculé sur les profils ayant au moins
    # un abonnement.
    # ----------------------------------------------------------

    # Profils ayant au moins un abonnement
    subscribed_profiles = (
        db.query(Subscription.profile_id)
        .filter(
            Subscription.profile_id.isnot(None)
        )
        .group_by(
            Subscription.profile_id
        )
        .all()
    )

    total_subscribed_profiles = len(subscribed_profiles)

    # Profils ayant au moins deux abonnements
    renewed_profiles = (
        db.query(Subscription.profile_id)
        .filter(
            Subscription.profile_id.isnot(None)
        )
        .group_by(
            Subscription.profile_id
        )
        .having(
            func.count(Subscription.id) >= 2
        )
        .all()
    )

    total_renewed_profiles = len(renewed_profiles)

    if total_subscribed_profiles > 0:
        renewal_rate = (
            total_renewed_profiles
            / total_subscribed_profiles
        ) * 100
    else:
        renewal_rate = 0

    # ----------------------------------------------------------
    # RÉPONSE
    # ----------------------------------------------------------

    return {
        "researchers": researchers,
        "publications": publications,
        "projects": projects,
        "likes": likes,
        "favorites": favorites,
        "comments": comments,
        "views": views,

        "payments": payments,

        "subscriptions": subscriptions,

        "total_revenue": float(total_revenue),

        "renewal_rate": round(
            float(renewal_rate),
            2
        ),

        "subscribed_profiles": total_subscribed_profiles,

        "renewed_profiles": total_renewed_profiles,
    }


# ==============================================================
# DONNÉES DES GRAPHIQUES
# ==============================================================

@router.get("/charts")
def get_statistics_charts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Données des graphiques du tableau de bord administrateur.
    """

    try:

        # ------------------------------------------------------
        # Fonction générique de comptage mensuel
        # ------------------------------------------------------

        def monthly_count(model):

            rows = (
                db.query(
                    extract(
                        "month",
                        model.created_at
                    ).label("month"),

                    func.count(
                        model.id
                    ).label("value")
                )
                .filter(
                    model.created_at.isnot(None)
                )
                .group_by(
                    extract(
                        "month",
                        model.created_at
                    )
                )
                .order_by(
                    extract(
                        "month",
                        model.created_at
                    )
                )
                .all()
            )

            return [
                {
                    "month": int(row.month),
                    "value": int(row.value),
                }
                for row in rows
                if row.month is not None
            ]

        publications = monthly_count(Publication)
        projects = monthly_count(Project)
        researchers = monthly_count(Profile)
        comments = monthly_count(Comment)
        likes = monthly_count(Like)

        # ------------------------------------------------------
        # REVENUS MENSUELS AVEC ANNÉE
        # Uniquement les paiements réussis
        # ------------------------------------------------------

        payments = (
            db.query(
                extract(
                    "year",
                    Payment.created_at
                ).label("year"),

                extract(
                    "month",
                    Payment.created_at
                ).label("month"),

                func.coalesce(
                    func.sum(Payment.amount),
                    0
                ).label("amount")
            )
            .filter(
                Payment.status == "SUCCESS"
            )
            .group_by(
                extract(
                    "year",
                    Payment.created_at
                ),
                extract(
                    "month",
                    Payment.created_at
                )
            )
            .order_by(
                extract(
                    "year",
                    Payment.created_at
                ),
                extract(
                    "month",
                    Payment.created_at
                )
            )
            .all()
        )

        payment_data = [
            {
                "year": int(payment.year),
                "month": int(payment.month),
                "amount": float(payment.amount),
            }
            for payment in payments
            if payment.year is not None and payment.month is not None
        ]

        # ------------------------------------------------------
        # RÉPARTITION DES RÔLES
        # ------------------------------------------------------

        roles = (
            db.query(
                User.role,
                func.count(User.id)
            )
            .group_by(
                User.role
            )
            .all()
        )

        role_data = [
            {
                "role": role,
                "count": count,
            }
            for role, count in roles
        ]

        # ------------------------------------------------------
        # RÉPONSE
        # ------------------------------------------------------

        return {
            "publications": publications,
            "projects": projects,
            "researchers": researchers,
            "comments": comments,
            "likes": likes,
            "payments": payment_data,
            "roles": role_data,
        }

    except SQLAlchemyError as e:

        db.rollback()

        return {
            "publications": [],
            "projects": [],
            "researchers": [],
            "comments": [],
            "likes": [],
            "payments": [],
            "roles": [],
            "error": str(e),
        }