import pdfplumber
import pandas as pd

PDF_PATH = "data/raw/april_2026.pdf"
OUTPUT = "data/processed/all_projects_raw.csv"

all_rows = []

with pdfplumber.open(PDF_PATH) as pdf:

    print("Total PDF pages:", len(pdf.pages))
    print("Extracting project tables...")
    print()

    for page_number in range(55, 163):

        page = pdf.pages[page_number - 1]

        tables = page.extract_tables()

        if not tables:
            print(f"Page {page_number}: No table found")
            continue

        table = tables[0]

        if len(table) < 2:
            continue

        header = table[0]

        # Check that this is the project table
        if "Sl.No" not in header:
            print(f"Page {page_number}: Not a project table")
            continue

        rows = table[1:]

        project_rows = []

        for row in rows:

            if not row:
                continue

            # First column should contain a project number
            sl_no = row[0]

            if sl_no is None:
                continue

            sl_no = str(sl_no).strip()

            if not sl_no.isdigit():
                continue

            project_rows.append(row)

        all_rows.extend(project_rows)

        print(
            f"Page {page_number}: "
            f"{len(project_rows)} projects"
        )


# Create dataframe
df = pd.DataFrame(
    all_rows,
    columns=header
)


# Save
df.to_csv(
    OUTPUT,
    index=False
)


print()
print("=" * 60)
print("EXTRACTION COMPLETE")
print("=" * 60)

print("Total extracted projects:", len(df))

print("Output file:")
print(OUTPUT)