import pandas as pd

FILE = "data/processed/ml_features.csv"

df = pd.read_csv(FILE)

print("=" * 70)
print("PAIMANA TARGET ANALYSIS")
print("=" * 70)


# ============================================================
# 1. COST OVERRUN
# ============================================================

print("\n1. COST OVERRUN")
print("-" * 70)

print(
    "No overrun:",
    (df["cost_overrun_percent"] <= 0).sum()
)

print(
    "1-10%:",
    ((df["cost_overrun_percent"] > 0) &
     (df["cost_overrun_percent"] <= 10)).sum()
)

print(
    "10-25%:",
    ((df["cost_overrun_percent"] > 10) &
     (df["cost_overrun_percent"] <= 25)).sum()
)

print(
    "25-50%:",
    ((df["cost_overrun_percent"] > 25) &
     (df["cost_overrun_percent"] <= 50)).sum()
)

print(
    ">50%:",
    (df["cost_overrun_percent"] > 50).sum()
)


# ============================================================
# 2. TIME OVERRUN
# ============================================================

print("\n2. TIME OVERRUN")
print("-" * 70)

print(
    "No schedule change:",
    (df["schedule_change_months"] <= 0).sum()
)

print(
    "1-6 months:",
    ((df["schedule_change_months"] > 0) &
     (df["schedule_change_months"] <= 6)).sum()
)

print(
    "7-12 months:",
    ((df["schedule_change_months"] > 6) &
     (df["schedule_change_months"] <= 12)).sum()
)

print(
    "13-24 months:",
    ((df["schedule_change_months"] > 12) &
     (df["schedule_change_months"] <= 24)).sum()
)

print(
    ">24 months:",
    (df["schedule_change_months"] > 24).sum()
)


# ============================================================
# 3. PROJECT STATUS
# ============================================================

print("\n3. PROJECT STATUS")
print("-" * 70)

print(
    "Projects with revised completion date:",
    df["revised_doc"].notna().sum()
)

print(
    "Projects without revised completion date:",
    df["revised_doc"].isna().sum()
)


# ============================================================
# 4. CURRENT RISK INDICATORS
# ============================================================

print("\n4. CURRENT RISK INDICATORS")
print("-" * 70)

print(
    "Low physical progress (<25%):",
    df["low_progress_flag"].sum()
)

print(
    "Spending >20 percentage points ahead of progress:",
    df["spending_ahead_of_progress"].sum()
)

print(
    "Expenditure > revised cost:",
    df["expenditure_exceeds_revised_cost"].sum()
)

print(
    "Extreme cost overrun (>100%):",
    df["extreme_cost_overrun"].sum()
)


# ============================================================
# 5. POTENTIAL HIGH-RISK PROJECTS
# ============================================================

print("\n5. POTENTIAL HIGH-RISK PROJECTS")
print("-" * 70)

risk = df[
    (
        (df["low_progress_flag"] == 1)
        |
        (df["spending_ahead_of_progress"] == 1)
        |
        (df["schedule_change_months"] > 12)
        |
        (df["cost_overrun_percent"] > 25)
    )
]

print(
    "Projects meeting at least one risk condition:",
    len(risk)
)


# ============================================================
# 6. IMPORTANT DATA LIMITATION
# ============================================================

print("\n6. DATASET LIMITATION")
print("-" * 70)

print(
    "This dataset contains one reporting snapshot: April 2026."
)

print(
    "A future-prediction model requires multiple historical"
)

print(
    "observations per project across different months."
)

print(
    "Therefore current overrun flags should NOT be treated"
)

print(
    "as validated future-prediction labels."
)


print("\n")
print("=" * 70)
print("TARGET ANALYSIS COMPLETE")
print("=" * 70)