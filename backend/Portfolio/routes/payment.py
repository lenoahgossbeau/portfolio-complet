from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import random
from database import get_db
from models.user import User
from auth.jwt import get_current_user

# ✅ IMPORTS POUR LA GESTION DES DATES ET DES MODÈLES
from datetime import datetime, timedelta
from models.profile import Profile
from models.subscription import Subscription
from models.payment import Payment

# ✅ AJOUT DES IMPORTS POUR LA FACTURE
from fastapi.responses import Response
from routes.invoice import generate_invoice

router = APIRouter(prefix="/payment", tags=["Payment"])

class PaymentRequest(BaseModel):
    operator: str   # "orange" ou "mtn"
    phone: str
    amount: float

@router.post("/initiate")
def initiate_payment(
    payment: PaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Validation de l'opérateur
    if payment.operator not in ["orange", "mtn"]:
        raise HTTPException(status_code=400, detail="Opérateur invalide. Choisissez 'orange' ou 'mtn'.")

    # 2. Validation simple du numéro de téléphone (Cameroun)
    if not payment.phone.startswith("6") or len(payment.phone) != 9:
        raise HTTPException(status_code=400, detail="Numéro de téléphone invalide (ex: 612345678).")

    # 3. Simulation d'un paiement réussi (toujours vrai ici)
    # En production : appel à l'API Orange Money / MTN Money ou Strapile
    transaction_id = f"SIM_{current_user.id}_{random.randint(100000, 999999)}"

    # =================================================================
    # ✅ CRÉATION DU PAIEMENT + GESTION DE L'ABONNEMENT
    # =================================================================

    # Recherche du profil de l'utilisateur connecté
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )

    if profile:
        today = datetime.now()

        # ✅ CRÉATION DE L'ENREGISTREMENT DE PAIEMENT
        payment_record = Payment(
            profile_id=profile.id,
            operator=payment.operator.upper(),
            phone=payment.phone,
            amount=payment.amount,
            transaction_id=transaction_id,
            status="SUCCESS"
        )

        db.add(payment_record)

        # Vérifier si un abonnement existe déjà pour ce profil
        subscription = (
            db.query(Subscription)
            .filter(Subscription.profile_id == profile.id)
            .first()
        )

        if subscription:
            # ✅ LOGIQUE DE RENOUVELLEMENT INTELLIGENT
            # Si l'abonnement est encore actif, on ajoute 30 jours à la date de fin actuelle
            current_end = datetime.strptime(subscription.end_date, "%Y-%m-%d")

            if current_end > today:
                new_end = current_end + timedelta(days=30)
            else:
                new_end = today + timedelta(days=30)

            subscription.end_date = new_end.strftime("%Y-%m-%d")
            subscription.payment_method = payment.operator.upper()
            subscription.type = "PREMIUM"

        else:
            # Création d'un nouvel abonnement
            end_date = today + timedelta(days=30)

            subscription = Subscription(
                profile_id=profile.id,
                start_date=today.strftime("%Y-%m-%d"),
                end_date=end_date.strftime("%Y-%m-%d"),
                type="PREMIUM",
                payment_method=payment.operator.upper()
            )
            db.add(subscription)

        # ✅ Sauvegarde des changements dans la base de données (Paiement + Abonnement)
        db.commit()

    # =================================================================

    return {
        "success": True,
        "transaction_id": transaction_id,
        "message": f"✅ Paiement de {payment.amount} XAF simulé avec succès via {payment.operator.upper()} Money.",
        "operator": payment.operator,
        "phone": payment.phone
    }


# ==============================================================================
# ✅ ENDPOINT : GET /payment/subscription
# ==============================================================================
@router.get("/subscription")
def get_my_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Recherche du profil
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profil introuvable")

    # Recherche de l'abonnement
    subscription = (
        db.query(Subscription)
        .filter(Subscription.profile_id == profile.id)
        .first()
    )

    if not subscription:
        return {
            "active": False,
            "message": "Aucun abonnement"
        }

    today = datetime.now().date()
    end_date = datetime.strptime(
        subscription.end_date,
        "%Y-%m-%d"
    ).date()

    active = end_date >= today

    days_left = max((end_date - today).days, 0)

    return {
        "active": active,
        "plan": subscription.type,
        "payment_method": subscription.payment_method,
        "start_date": subscription.start_date,
        "end_date": subscription.end_date,
        "days_left": days_left
    }


# ==============================================================================
# ✅ ENDPOINT : GET /payment/history
# ==============================================================================
@router.get("/history")
def get_payment_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Profil introuvable")

    payments = (
        db.query(Payment)
        .filter(Payment.profile_id == profile.id)
        .order_by(Payment.created_at.desc())
        .all()
    )

    return [
        {
            "id": payment.id,
            "transaction_id": payment.transaction_id,
            "operator": payment.operator,
            "phone": payment.phone,
            "amount": payment.amount,
            "status": payment.status,
            "date": payment.created_at.strftime("%d/%m/%Y %H:%M")
        }
        for payment in payments
    ]


# ==============================================================================
# ✅ ENDPOINT : TÉLÉCHARGER LE REÇU PDF
# ==============================================================================
@router.get("/receipt/{payment_id}")
def download_receipt(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Recherche du paiement
    payment = (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Paiement introuvable"
        )

    # Vérification que le paiement appartient bien à l'utilisateur connecté
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )

    if not profile or payment.profile_id != profile.id:
        raise HTTPException(
            status_code=403,
            detail="Accès refusé"
        )

    subscription = (
        db.query(Subscription)
        .filter(Subscription.profile_id == profile.id)
        .first()
    )

    pdf = generate_invoice(
        payment,
        profile,
        subscription
    )

    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            f'attachment; filename="recu_{payment.transaction_id}.pdf"'
        },
    )