import pdfplumber
import pandas as pd

PDF_PATH = "data/raw/april_2026.pdf"
PAGE_NUMBER = 55

with pdfplumber.open(PDF_PATH) as pdf:
    page = pdf.pages[PAGE_NUMBER - 1]
    table = page.extract_tables()[0]

df = pd.DataFrame(table[1:], columns=table[0])

# Keep only actual projects
df = df[df["Sl.No"].notna()]

# Sl.No must be numeric
df = df[pd.to_numeric(df["Sl.No"], errors="coerce").notna()]

# Convert Sl.No to integer
df["Sl.No"] = df["Sl.No"].astype(int)

print("Project rows:", len(df))
print()

print(df.to_string(index=False))
df.to_csv("data/processed/page55_projects.csv", index=False)
print("\nCSV saved successfully.")