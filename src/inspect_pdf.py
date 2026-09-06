import pdfplumber

pdf_path = "data/raw/april_2026.pdf"

with pdfplumber.open(pdf_path) as pdf:

    print("Total pages:", len(pdf.pages))
    print("\nSearching PDF for important sections...\n")

    keywords = [
        "All Ongoing Projects",
        "ongoing projects",
        "Project Name",
        "Project ID",
        "Original Cost",
        "Revised Cost"
    ]

    for page_number, page in enumerate(pdf.pages, start=1):

        text = page.extract_text()

        if not text:
            continue

        text_lower = text.lower()

        found = []

        for keyword in keywords:
            if keyword.lower() in text_lower:
                found.append(keyword)

        if found:
            print(f"Page {page_number}:")
            print("  Found:", ", ".join(found))