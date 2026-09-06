import pdfplumber

pdf_path = "data/raw/april_2026.pdf"

with pdfplumber.open(pdf_path) as pdf:

    for page_number in range(min(10, len(pdf.pages))):

        page = pdf.pages[page_number]

        print("\n")
        print("=" * 80)
        print(f"PAGE {page_number + 1}")
        print("=" * 80)

        text = page.extract_text()

        if text:
            print(text[:5000])
        else:
            print("No text found")