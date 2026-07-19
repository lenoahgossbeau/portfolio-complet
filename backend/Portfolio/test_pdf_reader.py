from services.pdf_reader import extract_text_from_pdf

pdf_path = r"uploads/cv/cv_32_20260711_172430.pdf"

try:
    text = extract_text_from_pdf(pdf_path)

    print("=" * 80)
    print(text[:3000])
    print("=" * 80)

except Exception as e:
    print("Erreur :", e)