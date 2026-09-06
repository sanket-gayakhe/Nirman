import pdfplumber

pdf_path = "data/raw/april_2026.pdf"

# PDF page 55 = index 54 in Python
page_number = 55

with pdfplumber.open(pdf_path) as pdf:

    page = pdf.pages[page_number - 1]

    print("=" * 100)
    print(f"PDF PAGE {page_number}")
    print("=" * 100)

    text = page.extract_text()

    if text:
        print(text)
    else:
        print("No text found.")