from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
)
import os
from datetime import datetime  # ✅ Ajout de l'import pour la date

# ==============================================================================
# ✅ FONCTION DE GÉNÉRATION DE FACTURE PDF
# ==============================================================================
def generate_invoice(
    payment,
    profile,
    subscription
):
    """
    Génère une facture PDF et retourne son contenu.
    """

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=(21 * cm, 29.7 * cm),
        rightMargin=1.5 * cm,
        leftMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
    )

    styles = getSampleStyleSheet()

    story = []

    # ==========================
    # Logo INCHTECHS
    # ==========================
    logo_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "portfolio",
        "src",
        "assets",
        "inchtechs_logo.jpeg"
    )

    if os.path.exists(logo_path):
        logo = Image(logo_path, width=4*cm, height=4*cm)
        logo.hAlign = "CENTER"
        story.append(logo)

    story.append(Spacer(1, 0.5 * cm))

    # ==========================
    # Titre
    # ==========================
    title_style = styles["Heading1"]
    title_style.alignment = TA_CENTER

    story.append(
        Paragraph(
            "FACTURE / REÇU DE PAIEMENT",
            title_style
        )
    )

    story.append(Spacer(1, 0.7 * cm))

    # ==========================
    # Informations du paiement
    # ==========================
    data = [
        ["Reçu N°", f"REC-{payment.id:06d}"],
        ["Transaction", payment.transaction_id],
        ["Chercheur", f"{profile.first_name or ''} {profile.last_name or ''}".strip()],
        ["Email", profile.email or "-"],
        ["Téléphone", payment.phone],
        ["Paiement", payment.operator],
        ["Montant", f"{payment.amount:,.0f} FCFA".replace(",", " ")],
        ["Abonnement", subscription.type if subscription else "PREMIUM"],
        ["Début", subscription.start_date if subscription else "-"],
        ["Expiration", subscription.end_date if subscription else "-"],
        ["Statut", "PAYÉ"],
    ]

    table = Table(data, colWidths=[5 * cm, 11 * cm])

    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F4F4F4")),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ])
    )

    story.append(table)
    story.append(Spacer(1, 1 * cm))

    # ==========================
    # Message de remerciement
    # ==========================
    thank_style = styles["Normal"]
    thank_style.alignment = TA_CENTER

    story.append(
        Paragraph(
            "<b>Merci d'avoir choisi INCHTECHS.</b>",
            thank_style
        )
    )

    story.append(Spacer(1, 0.3 * cm))

    story.append(
        Paragraph(
            "Ce reçu constitue une preuve officielle de votre paiement.",
            thank_style
        )
    )

    story.append(Spacer(1, 0.3 * cm))

    story.append(
        Paragraph(
            f"Généré le : {datetime.now().strftime('%d/%m/%Y à %H:%M')}",
            thank_style
        )
    )

    story.append(Spacer(1, 0.5 * cm))

    story.append(
        Paragraph(
            "<font color='grey'>Document généré automatiquement par la plateforme INCHTECHS.</font>",
            thank_style
        )
    )

    doc.build(story)

    pdf = buffer.getvalue()
    buffer.close()

    return pdf