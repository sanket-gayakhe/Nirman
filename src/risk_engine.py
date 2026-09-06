import pandas as pd
import joblib


# ============================================================
# FILES
# ============================================================

DATA_FILE = "data/processed/ml_features.csv"
MODEL_FILE = "models/xgboost_cost_model.pkl"

OUTPUT_FILE = "data/processed/final_project_risk.csv"


# ============================================================
# LOAD
# ============================================================

print("=" * 70)
print("PAIMANA AI - EXPLAINABLE RISK ENGINE")
print("=" * 70)

df = pd.read_csv(DATA_FILE)

model = joblib.load(MODEL_FILE)


# ============================================================
# PREPARE ML DATA
# ============================================================

features = [
    "original_cost",
    "expenditure",
    "physical_progress",
    "planned_duration_months",
    "project_age_months",
    "approval_to_start_months",
    "State",
    "agency"
]


# Only rows usable by the ML model
ml_df = df.dropna(
    subset=features
).copy()


X = ml_df[features]


# ============================================================
# ML SCORE
# ============================================================

print("\nRunning ML model...")

ml_probability = model.predict_proba(X)[:, 1] * 100


# ============================================================
# RULE-BASED RISK
# ============================================================

def cost_risk(cost_overrun):

    if cost_overrun > 50:
        return 100

    elif cost_overrun > 25:
        return 75

    elif cost_overrun > 10:
        return 50

    elif cost_overrun > 0:
        return 25

    return 0


def schedule_risk(schedule_change):

    if pd.isna(schedule_change):
        return 50

    if schedule_change > 24:
        return 100

    elif schedule_change > 12:
        return 75

    elif schedule_change > 6:
        return 50

    elif schedule_change > 0:
        return 25

    return 0


def progress_risk(progress):

    if progress < 25:
        return 100

    elif progress < 50:
        return 75

    elif progress < 75:
        return 40

    return 0


def financial_risk(gap):

    if gap > 50:
        return 100

    elif gap > 20:
        return 75

    elif gap > 10:
        return 40

    return 0


# ============================================================
# CALCULATE COMPONENT SCORES
# ============================================================

ml_df["cost_risk"] = (
    ml_df["cost_overrun_percent"]
    .apply(cost_risk)
)

ml_df["schedule_risk"] = (
    ml_df["schedule_change_months"]
    .apply(schedule_risk)
)

ml_df["progress_risk"] = (
    ml_df["physical_progress"]
    .apply(progress_risk)
)

ml_df["financial_risk"] = (
    ml_df["expenditure_progress_gap"]
    .apply(financial_risk)
)


# ============================================================
# RULE-BASED OVERALL SCORE
# ============================================================

ml_df["rule_based_score"] = (

    ml_df["cost_risk"] * 0.30

    + ml_df["schedule_risk"] * 0.30

    + ml_df["progress_risk"] * 0.25

    + ml_df["financial_risk"] * 0.15
)


# ============================================================
# FINAL SCORE
# ============================================================

# ML contributes 40%
# Explainable rule engine contributes 60%

ml_df["ml_score"] = ml_probability

ml_df["final_risk_score"] = (

    ml_df["rule_based_score"] * 0.60

    + ml_df["ml_score"] * 0.40
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

    return "LOW"


ml_df["risk_level"] = (
    ml_df["final_risk_score"]
    .apply(risk_level)
)


# ============================================================
# GENERATE EXPLANATIONS
# ============================================================

def generate_reasons(row):

    reasons = []

    if row["cost_overrun_percent"] > 10:
        reasons.append(
            "Cost overrun above 10%"
        )

    if row["schedule_change_months"] > 6:
        reasons.append(
            "Schedule delay above 6 months"
        )

    if row["physical_progress"] < 50:
        reasons.append(
            "Low physical progress"
        )

    if row["expenditure_progress_gap"] > 20:
        reasons.append(
            "Expenditure is significantly ahead of physical progress"
        )

    if row["expenditure_exceeds_revised_cost"]:
        reasons.append(
            "Expenditure exceeds revised project cost"
        )

    if not reasons:
        reasons.append(
            "No major rule-based risk indicator detected"
        )

    return " | ".join(reasons)


ml_df["risk_reasons"] = ml_df.apply(
    generate_reasons,
    axis=1
)


# ============================================================
# SELECT OUTPUT COLUMNS
# ============================================================

output_columns = [
    "project_name",
    "project_code",
    "legacy_ocms_code",
    "State",
    "agency",

    "original_cost",
    "revised_cost",
    "expenditure",

    "physical_progress",

    "cost_overrun_percent",
    "schedule_change_months",
    "expenditure_progress_gap",

    "cost_risk",
    "schedule_risk",
    "progress_risk",
    "financial_risk",

    "rule_based_score",
    "ml_score",

    "final_risk_score",
    "risk_level",

    "risk_reasons"
]


results = ml_df[output_columns].copy()


# ============================================================
# SORT
# ============================================================

results = results.sort_values(
    "final_risk_score",
    ascending=False
).reset_index(drop=True)


results.insert(
    0,
    "rank",
    range(1, len(results) + 1)
)


# ============================================================
# SAVE
# ============================================================

results.to_csv(
    OUTPUT_FILE,
    index=False
)


# ============================================================
# SUMMARY
# ============================================================

print("\n" + "=" * 70)
print("FINAL RISK DISTRIBUTION")
print("=" * 70)

print(
    results["risk_level"]
    .value_counts()
)


# ============================================================
# TOP 10
# ============================================================

print("\n" + "=" * 70)
print("TOP 10 PROJECTS REQUIRING ATTENTION")
print("=" * 70)

for _, row in results.head(10).iterrows():

    print(
        f"\n#{int(row['rank'])} "
        f"{row['project_name']}"
    )

    print(
        f"Final Risk Score : "
        f"{row['final_risk_score']:.2f}/100"
    )

    print(
        f"Risk Level       : "
        f"{row['risk_level']}"
    )

    print(
        f"ML Score         : "
        f"{row['ml_score']:.2f}"
    )

    print(
        f"Physical Progress: "
        f"{row['physical_progress']:.2f}%"
    )

    print(
        f"Reasons          : "
        f"{row['risk_reasons']}"
    )


print("\n" + "=" * 70)

print("Saved to:")

print(OUTPUT_FILE)

print("=" * 70)