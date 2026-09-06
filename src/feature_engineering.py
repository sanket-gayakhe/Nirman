import pandas as pd
import numpy as np

INPUT = "data/processed/all_projects_clean.csv"
OUTPUT = "data/processed/ml_features.csv"

df = pd.read_csv(INPUT)


# ============================================================
# 1. COST OVERRUN
# ============================================================

df["cost_overrun_amount"] = (
    df["revised_cost"] - df["original_cost"]
)

df["cost_overrun_percent"] = (
    df["cost_overrun_amount"]
    / df["original_cost"]
) * 100


# ============================================================
# 2. EXPENDITURE RATIO
# ============================================================

df["expenditure_percent"] = (
    df["expenditure"]
    / df["revised_cost"]
) * 100


# ============================================================
# 3. REMAINING COST
# ============================================================

df["remaining_cost"] = (
    df["revised_cost"]
    - df["expenditure"]
)


# ============================================================
# 4. EXPENDITURE VS PHYSICAL PROGRESS
# ============================================================

df["expenditure_progress_gap"] = (
    df["expenditure_percent"]
    - df["physical_progress"]
)


# ============================================================
# 5. DATE CONVERSION
# ============================================================

date_columns = [
    "approval_date",
    "start_date",
    "original_doc",
    "revised_doc"
]

for column in date_columns:

    df[column] = pd.to_datetime(
        df[column],
        format="%m/%Y",
        errors="coerce"
    )


# ============================================================
# HELPER: MONTH DIFFERENCE
# ============================================================

def month_difference(start, end):

    if pd.isna(start) or pd.isna(end):
        return np.nan

    return (
        (end.year - start.year) * 12
        + (end.month - start.month)
    )


# ============================================================
# 6. PLANNED PROJECT DURATION
# ============================================================

df["planned_duration_months"] = df.apply(
    lambda row: month_difference(
        row["start_date"],
        row["original_doc"]
    ),
    axis=1
)


# ============================================================
# 7. APPROVAL TO START
# ============================================================

df["approval_to_start_months"] = df.apply(
    lambda row: month_difference(
        row["approval_date"],
        row["start_date"]
    ),
    axis=1
)


# ============================================================
# 8. PROJECT AGE
# ============================================================

REPORT_DATE = pd.Timestamp("2026-04-30")

df["project_age_months"] = df.apply(
    lambda row: month_difference(
        row["start_date"],
        REPORT_DATE
    ),
    axis=1
)


# ============================================================
# 9. SCHEDULE CHANGE
# ============================================================

df["schedule_change_months"] = df.apply(
    lambda row: month_difference(
        row["original_doc"],
        row["revised_doc"]
    ),
    axis=1
)


# ============================================================
# 10. TIME OVERRUN FLAG
# ============================================================

df["time_overrun_flag"] = (
    df["schedule_change_months"] > 0
).astype(int)


# ============================================================
# 11. COST OVERRUN FLAG
# ============================================================

df["cost_overrun_flag"] = (
    df["cost_overrun_percent"] > 0
).astype(int)


# ============================================================
# 12. PROJECT SIZE
# ============================================================

df["project_size_category"] = pd.cut(
    df["original_cost"],
    bins=[
        0,
        500,
        1000,
        5000,
        float("inf")
    ],
    labels=[
        "Small",
        "Medium",
        "Large",
        "Mega"
    ]
)


# ============================================================
# 13. LOW PROGRESS FLAG
# ============================================================

df["low_progress_flag"] = (
    df["physical_progress"] < 25
).astype(int)


# ============================================================
# 14. SPENDING AHEAD OF PHYSICAL PROGRESS
# ============================================================

df["spending_ahead_of_progress"] = (
    df["expenditure_progress_gap"] > 20
).astype(int)


# ============================================================
# 15. DATA QUALITY FLAGS
# ============================================================

df["expenditure_exceeds_revised_cost"] = (
    df["expenditure"] > df["revised_cost"]
).astype(int)

df["extreme_cost_overrun"] = (
    df["cost_overrun_percent"] > 100
).astype(int)


# ============================================================
# 16. SAVE
# ============================================================

df.to_csv(
    OUTPUT,
    index=False
)


# ============================================================
# REPORT
# ============================================================

print("=" * 70)
print("FEATURE ENGINEERING COMPLETE")
print("=" * 70)

print("Rows:", len(df))
print("Columns:", len(df.columns))

print("\nNew features:")

new_features = [
    "cost_overrun_amount",
    "cost_overrun_percent",
    "expenditure_percent",
    "remaining_cost",
    "expenditure_progress_gap",
    "planned_duration_months",
    "approval_to_start_months",
    "project_age_months",
    "schedule_change_months",
    "time_overrun_flag",
    "cost_overrun_flag",
    "project_size_category",
    "low_progress_flag",
    "spending_ahead_of_progress",
    "expenditure_exceeds_revised_cost",
    "extreme_cost_overrun"
]

for feature in new_features:
    print("-", feature)


print("\nCost overrun flags:")
print(
    df["cost_overrun_flag"].value_counts()
)


print("\nTime overrun flags:")
print(
    df["time_overrun_flag"].value_counts()
)


print("\nData quality flags:")

print(
    "Expenditure > revised cost:",
    df["expenditure_exceeds_revised_cost"].sum()
)

print(
    "Extreme cost overrun >100%:",
    df["extreme_cost_overrun"].sum()
)


print("\nSaved to:")
print(OUTPUT)