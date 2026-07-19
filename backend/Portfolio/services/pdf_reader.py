import fitz
from pathlib import Path


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extrait tout le texte d'un fichier PDF.

    Args:
        pdf_path (str): Chemin du fichier PDF.

    Returns:
        str: Texte complet du PDF.
    """

    pdf_file = Path(pdf_path)

    if not pdf_file.exists():
        raise FileNotFoundError(f"PDF introuvable : {pdf_path}")

    document = fitz.open(pdf_path)

    text = ""

    for page in document:
        text += page.get_text("text") + "\n"

    document.close()

    return text.strip()