import pandas as pd
import numpy as np

INPUT = "data/processed/ml_features.csv"
OUTPUT = "data/processed/project_risk_scores.csv"

df = pd.read_csv(INPUT)


# ============================================================
# RISK COMPONENTS
# ============================================================

# ------------------------------------------------------------
# 1. COST RISK
# ------------------------------------------------------------

def cost_risk(row):

    cost = row["cost_overrun_percent"]

    if cost > 50:
        return 100

    elif cost > 25:
        return 75

    elif cost > 10:
        return 50

    elif cost > 0:
        return 25

    else:
        return 0


df["cost_risk"] = df.apply(
    cost_risk,
    axis=1
)


# ------------------------------------------------------------
# 2. SCHEDULE RISK
# ------------------------------------------------------------

def schedule_risk(row):

    delay = row["schedule_change_months"]

    if pd.isna(delay):
        return 50

    if delay > 24:
        return 100

    elif delay > 12:
        return 75

    elif delay > 6:
        return 50

    elif delay > 0:
        return 25

    else:
        return 0


df["schedule_risk"] = df.apply(
    schedule_risk,
    axis=1
)


# ------------------------------------------------------------
# 3. PROGRESS RISK
# ------------------------------------------------------------

def progress_risk(row):

    progress = row["physical_progress"]

    if progress < 25:
        return 100

    elif progress < 50:
        return 75

    elif progress < 75:
        return 40

    else:
        return 0


df["progress_risk"] = df.apply(
    progress_risk,
    axis=1
)


# ------------------------------------------------------------
# 4. FINANCIAL EXECUTION RISK
# ------------------------------------------------------------

def financial_risk(row):

    gap = row["expenditure_progress_gap"]

    if gap > 50:
        return 100

    elif gap > 20:
        return 75

    elif gap > 10:
        return 40

    else:
        return 0


df["financial_risk"] = df.apply(
    financial_risk,
    axis=1
)


# ============================================================
# OVERALL RISK SCORE
# ============================================================

df["risk_score"] = (
    df["cost_risk"] * 0.30
    +
    df["schedule_risk"] * 0.30
    +
    df["progress_risk"] * 0.25
    +
    df["financial_risk"] * 0.15
)


# ============================================================
# RISK LEVEL
# ============================================================

def risk_level(score):

    if score >= 70:
        return "CRITICAL"

    elif score >= 50:
        return "HIGH"

    elif score >= 30:
        return "MEDIUM"

    else:
        return "LOW"


df["risk_level"] = df["risk_score"].apply(
    risk_level
)


# ============================================================
# PRIORITY
# ============================================================

df["intervention_priority"] = (
    df["risk_score"]
    .rank(
        ascending=False,
        method="min"
    )
    .astype(int)
)


# ============================================================
# TOP RISK PROJECTS
# ============================================================

top_risk = df.sort_values(
    "risk_score",
    ascending=False
)


# ============================================================
# SAVE
# ============================================================

top_risk.to_csv(
    OUTPUT,
    index=False
)


# ============================================================
# REPORT
# ============================================================

print("=" * 70)
print("PAIMANA PROJECT RISK SCORING")
print("=" * 70)

print("\nRisk distribution:")

print(
    df["risk_level"]
    .value_counts()
)


print("\nAverage risk score:")

print(
    round(
        df["risk_score"].mean(),
        2
    )
)


print("\nTop 10 highest-risk projects:")

columns = [
    "project_name",
    "State",
    "risk_score",
    "risk_level",
    "cost_risk",
    "schedule_risk",
    "progress_risk",
    "financial_risk"
]

print(
    top_risk[
        columns
    ]
    .head(10)
    .to_string(index=False)
)


print("\nSaved to:")

print(OUTPUT)