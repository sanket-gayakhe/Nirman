import pdfplumber

pdf_path = "data/raw/april_2026.pdf"

with pdfplumber.open(pdf_path) as pdf:
    print("Number of pages:", len(pdf.pages))