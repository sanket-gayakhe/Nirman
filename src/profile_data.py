import pandas as pd

FILE = "data/processed/all_projects_clean.csv"

df = pd.read_csv(FILE)

print("=" * 70)
print("PAIMANA DATA PROFILE")
print("=" * 70)


# --------------------------------------------------
# 1. Unique values
# --------------------------------------------------

print("\n1. UNIQUE VALUES")
print("-" * 70)

for column in df.columns:
    print(
        f"{column:25} "
        f"{df[column].nunique(dropna=True)} unique"
    )


# --------------------------------------------------
# 2. Cost overrun distribution
# --------------------------------------------------

df["cost_overrun_percent"] = (
    (df["revised_cost"] - df["original_cost"])
    / df["original_cost"]
) * 100

print("\n2. COST OVERRUN DISTRIBUTION")
print("-" * 70)

print(
    df["cost_overrun_percent"].describe()
)


# --------------------------------------------------
# 3. Projects with large cost increases
# --------------------------------------------------

print("\n3. TOP COST OVERRUNS")
print("-" * 70)

top_cost = df.sort_values(
    "cost_overrun_percent",
    ascending=False
)[
    [
        "project_name",
        "original_cost",
        "revised_cost",
        "cost_overrun_percent",
        "physical_progress"
    ]
].head(10)

print(
    top_cost.to_string(index=False)
)


# --------------------------------------------------
# 4. Progress vs expenditure
# --------------------------------------------------

df["expenditure_percent"] = (
    df["expenditure"] /
    df["revised_cost"]
) * 100

print("\n4. EXPENDITURE % OF REVISED COST")
print("-" * 70)

print(
    df["expenditure_percent"].describe()
)


# --------------------------------------------------
# 5. Very high expenditure
# --------------------------------------------------

print("\n5. HIGH EXPENDITURE PROJECTS")
print("-" * 70)

high_exp = df.sort_values(
    "expenditure_percent",
    ascending=False
)[
    [
        "project_name",
        "revised_cost",
        "expenditure",
        "expenditure_percent",
        "physical_progress"
    ]
].head(10)

print(
    high_exp.to_string(index=False)
)


# --------------------------------------------------
# 6. State statistics
# --------------------------------------------------

print("\n6. PROJECTS BY STATE")
print("-" * 70)

state_stats = (
    df.groupby("State")
    .agg(
        projects=("project_name", "count"),
        avg_progress=("physical_progress", "mean"),
        avg_cost_overrun=("cost_overrun_percent", "mean")
    )
    .sort_values(
        "projects",
        ascending=False
    )
    .head(15)
)

print(
    state_stats.to_string()
)


# --------------------------------------------------
# 7. Physical progress distribution
# --------------------------------------------------

print("\n7. PHYSICAL PROGRESS DISTRIBUTION")
print("-" * 70)

bins = [
    -1,
    25,
    50,
    75,
    90,
    101
]

labels = [
    "0-25%",
    "25-50%",
    "50-75%",
    "75-90%",
    "90-100%"
]

df["progress_group"] = pd.cut(
    df["physical_progress"],
    bins=bins,
    labels=labels
)

print(
    df["progress_group"]
    .value_counts()
    .sort_index()
)


print("\n")
print("=" * 70)
print("PROFILE COMPLETE")
print("=" * 70)