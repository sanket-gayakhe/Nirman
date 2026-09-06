import pandas as pd

FILE = "data/processed/all_projects_clean.csv"

df = pd.read_csv(FILE)

print("=" * 70)
print("PAIMANA DATA VALIDATION")
print("=" * 70)

# --------------------------------------------------
# 1. Basic information
# --------------------------------------------------

print("\n1. BASIC INFORMATION")
print("-" * 70)

print("Rows:", len(df))
print("Columns:", len(df.columns))

# --------------------------------------------------
# 2. Duplicate projects
# --------------------------------------------------

print("\n2. DUPLICATES")
print("-" * 70)

print("Duplicate project codes:",
      df["project_code"].duplicated().sum())

print("Duplicate project names:",
      df["project_name"].duplicated().sum())

# --------------------------------------------------
# 3. Numeric validation
# --------------------------------------------------

print("\n3. NUMERIC VALIDATION")
print("-" * 70)

print("Original cost <= 0:",
      (df["original_cost"] <= 0).sum())

print("Revised cost <= 0:",
      (df["revised_cost"] <= 0).sum())

print("Expenditure < 0:",
      (df["expenditure"] < 0).sum())

print("Physical progress < 0:",
      (df["physical_progress"] < 0).sum())

print("Physical progress > 100:",
      (df["physical_progress"] > 100).sum())

# --------------------------------------------------
# 4. Cost relationships
# --------------------------------------------------

print("\n4. COST ANALYSIS")
print("-" * 70)

df["cost_change"] = (
    df["revised_cost"] -
    df["original_cost"]
)

df["cost_overrun_percent"] = (
    df["cost_change"] /
    df["original_cost"]
) * 100

print(
    "Projects with cost increase:",
    (df["cost_change"] > 0).sum()
)

print(
    "Projects with cost decrease:",
    (df["cost_change"] < 0).sum()
)

print(
    "Projects with unchanged cost:",
    (df["cost_change"] == 0).sum()
)

# --------------------------------------------------
# 5. Expenditure relationship
# --------------------------------------------------

print("\n5. EXPENDITURE ANALYSIS")
print("-" * 70)

print(
    "Projects where expenditure > revised cost:",
    (df["expenditure"] > df["revised_cost"]).sum()
)

# --------------------------------------------------
# 6. Physical progress
# --------------------------------------------------

print("\n6. PHYSICAL PROGRESS")
print("-" * 70)

print(
    "Average physical progress:",
    round(df["physical_progress"].mean(), 2)
)

print(
    "Projects >= 90% progress:",
    (df["physical_progress"] >= 90).sum()
)

print(
    "Projects < 25% progress:",
    (df["physical_progress"] < 25).sum()
)

# --------------------------------------------------
# 7. State distribution
# --------------------------------------------------

print("\n7. TOP STATES")
print("-" * 70)

print(
    df["State"]
    .value_counts()
    .head(10)
)

# --------------------------------------------------
# 8. Agency distribution
# --------------------------------------------------

print("\n8. TOP AGENCIES")
print("-" * 70)

print(
    df["agency"]
    .value_counts()
    .head(10)
)

# --------------------------------------------------
# 9. Missing values
# --------------------------------------------------

print("\n9. MISSING VALUES")
print("-" * 70)

missing = df.isna().sum()

print(
    missing[missing > 0]
)

# --------------------------------------------------
# 10. Save validation dataset
# --------------------------------------------------

OUTPUT = "data/processed/validated_projects.csv"

df.to_csv(
    OUTPUT,
    index=False
)

print("\n")
print("=" * 70)
print("VALIDATION COMPLETE")
print("=" * 70)

print("Saved to:", OUTPUT)