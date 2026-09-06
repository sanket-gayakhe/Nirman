import pandas as pd
import re

INPUT = "data/processed/page55_projects.csv"
OUTPUT = "data/processed/page55_clean.csv"

df = pd.read_csv(INPUT)

PROJECT_COLUMN = "Project Name\n(Agency)\n(Project Code) (Legacy OCMS Code) (PMGID)"


# --------------------------------------------------
# Helper: split cell into lines
# --------------------------------------------------

def lines(value):
    return [
        x.strip()
        for x in str(value).split("\n")
        if x.strip()
    ]


# --------------------------------------------------
# Project Name
# --------------------------------------------------

def get_project_name(value):

    result = []

    for line in lines(value):

        if line.startswith("("):
            break

        result.append(line)

    return " ".join(result)


# --------------------------------------------------
# Agency
# --------------------------------------------------

def get_agency(value):

    for line in lines(value):

        if line.startswith("(") and not re.match(r"^\(\d", line):

            return line[1:-1]

    return None


# --------------------------------------------------
# Project Codes
# --------------------------------------------------

def get_codes(value):

    all_lines = lines(value)

    codes = []

    for line in all_lines:

        if line.startswith("("):

            found = re.findall(
                r"\(([^()]*)\)",
                line
            )

            codes.extend(found)

    # Remove agency if captured
    codes = [
        x for x in codes
        if not x.startswith("Airport Authority")
        and not x.startswith("Adani Airport")
    ]

    return codes


# --------------------------------------------------
# Extract Project Name
# --------------------------------------------------

df["project_name"] = df[
    PROJECT_COLUMN
].apply(get_project_name)


# --------------------------------------------------
# Extract Agency
# --------------------------------------------------

df["agency"] = df[
    PROJECT_COLUMN
].apply(get_agency)


# --------------------------------------------------
# Extract Codes
# --------------------------------------------------

codes = df[
    PROJECT_COLUMN
].apply(get_codes)


df["project_code"] = codes.apply(
    lambda x: x[0] if len(x) > 0 else None
)

df["legacy_ocms_code"] = codes.apply(
    lambda x: x[1] if len(x) > 1 else None
)

df["pmgid"] = codes.apply(
    lambda x: x[2] if len(x) > 2 else None
)


# --------------------------------------------------
# Extract Dates
# --------------------------------------------------

def get_date_pair(value):

    text = str(value)

    return re.findall(
        r"\d{2}/\d{4}",
        text
    )


dates = df[
    "Date of Approval\n(Start Date)\nMM/YYYY"
].apply(get_date_pair)


df["approval_date"] = dates.apply(
    lambda x: x[0] if len(x) > 0 else None
)

df["start_date"] = dates.apply(
    lambda x: x[1] if len(x) > 1 else None
)


# --------------------------------------------------
# Extract Completion Dates
# --------------------------------------------------

docs = df[
    "Orignal/Target DoC\n(Revised DoC)\nMM/YYYY"
].apply(get_date_pair)


df["original_doc"] = docs.apply(
    lambda x: x[0] if len(x) > 0 else None
)

df["revised_doc"] = docs.apply(
    lambda x: x[1] if len(x) > 1 else None
)


# --------------------------------------------------
# Extract Costs
# --------------------------------------------------

def get_cost_pair(value):

    text = str(value)

    return re.findall(
        r"\d+(?:\.\d+)?",
        text
    )


costs = df[
    "Orignal Cost\nRevised Cost\nin Rs. Crore"
].apply(get_cost_pair)


df["original_cost"] = costs.apply(
    lambda x: float(x[0])
    if len(x) > 0
    else None
)

df["revised_cost"] = costs.apply(
    lambda x: float(x[1])
    if len(x) > 1
    else None
)


# --------------------------------------------------
# Expenditure
# --------------------------------------------------

df["expenditure"] = pd.to_numeric(
    df[
        "Cumulative\nExpenditure\nin Rs. Crore"
    ],
    errors="coerce"
)


# --------------------------------------------------
# Physical Progress
# --------------------------------------------------

df["physical_progress"] = pd.to_numeric(
    df[
        "Physical Progress\n(%)"
    ],
    errors="coerce"
)


# --------------------------------------------------
# Ministry and Sector
# --------------------------------------------------

df["ministry"] = "Ministry of Civil Aviation"

df["sector"] = "Aviation & Aviation Infrastructure"


# --------------------------------------------------
# Create Final Dataset
# --------------------------------------------------

clean_df = df[
    [
        "Sl.No",
        "project_name",
        "ministry",
        "sector",
        "agency",
        "State",
        "approval_date",
        "start_date",
        "original_doc",
        "revised_doc",
        "original_cost",
        "revised_cost",
        "expenditure",
        "physical_progress",
        "project_code",
        "legacy_ocms_code",
        "pmgid",
    ]
]


# --------------------------------------------------
# Save
# --------------------------------------------------

clean_df.to_csv(
    OUTPUT,
    index=False
)


# --------------------------------------------------
# Display Results
# --------------------------------------------------

print("Clean dataset created.")

print("Rows:", len(clean_df))

print("Columns:", len(clean_df.columns))

print("\nColumns:")

for column in clean_df.columns:

    print("-", column)


print("\nFirst 3 projects:")

print(
    clean_df.head(3).to_string(
        index=False
    )
)


print("\nCSV saved to:")

print(OUTPUT)