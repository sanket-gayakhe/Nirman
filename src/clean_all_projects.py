import pandas as pd
import re

INPUT = "data/processed/all_projects_raw.csv"
OUTPUT = "data/processed/all_projects_clean.csv"

df = pd.read_csv(INPUT)

PROJECT_COLUMN = (
    "Project Name\n"
    "(Agency)\n"
    "(Project Code) (Legacy OCMS Code) (PMGID)"
)


# --------------------------------------------------
# Helper functions
# --------------------------------------------------

def lines(value):
    return [
        x.strip()
        for x in str(value).split("\n")
        if x.strip()
    ]


def get_project_name(value):

    result = []

    for line in lines(value):

        if line.startswith("("):
            break

        result.append(line)

    return " ".join(result)


def get_agency(value):

    for line in lines(value):

        if line.startswith("(") and not re.match(r"^\(\d", line):

            return line[1:-1]

    return None


def get_codes(value):

    codes = []

    for line in lines(value):

        if line.startswith("("):

            found = re.findall(
                r"\(([^()]*)\)",
                line
            )

            codes.extend(found)

    # Remove agency names accidentally captured
    codes = [
        x for x in codes
        if not x.startswith("Airport Authority")
        and not x.startswith("Adani Airport")
    ]

    return codes


def get_date_pair(value):

    return re.findall(
        r"\d{2}/\d{4}",
        str(value)
    )


def get_cost_pair(value):

    return re.findall(
        r"\d+(?:\.\d+)?",
        str(value)
    )


# --------------------------------------------------
# Project information
# --------------------------------------------------

df["project_name"] = df[
    PROJECT_COLUMN
].apply(get_project_name)


df["agency"] = df[
    PROJECT_COLUMN
].apply(get_agency)


# --------------------------------------------------
# Codes
# --------------------------------------------------

codes = df[
    PROJECT_COLUMN
].apply(get_codes)


df["project_code"] = codes.apply(
    lambda x: x[0]
    if len(x) > 0
    else None
)


df["legacy_ocms_code"] = codes.apply(
    lambda x: x[1]
    if len(x) > 1
    else None
)


df["pmgid"] = codes.apply(
    lambda x: x[2]
    if len(x) > 2
    else None
)


# --------------------------------------------------
# Approval / Start dates
# --------------------------------------------------

dates = df[
    "Date of Approval\n(Start Date)\nMM/YYYY"
].apply(get_date_pair)


df["approval_date"] = dates.apply(
    lambda x: x[0]
    if len(x) > 0
    else None
)


df["start_date"] = dates.apply(
    lambda x: x[1]
    if len(x) > 1
    else None
)


# --------------------------------------------------
# Target / Revised completion dates
# --------------------------------------------------

docs = df[
    "Orignal/Target DoC\n(Revised DoC)\nMM/YYYY"
].apply(get_date_pair)


df["original_doc"] = docs.apply(
    lambda x: x[0]
    if len(x) > 0
    else None
)


df["revised_doc"] = docs.apply(
    lambda x: x[1]
    if len(x) > 1
    else None
)


# --------------------------------------------------
# Original / Revised cost
# --------------------------------------------------

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
# Physical progress
# --------------------------------------------------

df["physical_progress"] = pd.to_numeric(
    df[
        "Physical Progress\n(%)"
    ],
    errors="coerce"
)


# --------------------------------------------------
# Final dataset
# --------------------------------------------------

clean_df = df[
    [
        "Sl.No",
        "project_name",
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
# Validation
# --------------------------------------------------

print("=" * 60)
print("CLEANING COMPLETE")
print("=" * 60)

print("Rows:", len(clean_df))
print("Columns:", len(clean_df.columns))

print("\nColumns:")

for column in clean_df.columns:
    print("-", column)


print("\nMissing values:")

print(
    clean_df.isna().sum()
)


print("\nFirst 5 projects:")

print(
    clean_df.head(5).to_string(
        index=False
    )
)


print("\nSaved to:")

print(OUTPUT)