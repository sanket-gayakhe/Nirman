import pandas as pd
import joblib


MODEL_FILE = "models/xgboost_cost_model.pkl"
INPUT_FILE = "data/processed/ml_ready.csv"
OUTPUT_FILE = "data/processed/ai_project_risk.csv"


FEATURES = [
    "original_cost",
    "expenditure",
    "physical_progress",
    "planned_duration_months",
    "project_age_months",
    "approval_to_start_months",
    "State",
    "agency"
]


print("=" * 70)
print("PAIMANA AI - ALL PROJECT RISK SCORING")
print("=" * 70)


# Load model
model = joblib.load(MODEL_FILE)


# Load correctly aligned data
df = pd.read_csv(INPUT_FILE)

print(f"\nProjects available: {len(df)}")


# Model input
X = df[FEATURES]


print("\nRunning AI predictions...")


# Predict probabilities
probabilities = model.predict_proba(X)[:, 1]


# Create output directly from SAME dataframe
results = df[
    [
        "project_name",
        "project_code",
        "legacy_ocms_code",
        "State",
        "agency",
        "original_cost",
        "expenditure",
        "physical_progress",
        "project_age_months"
    ]
].copy()


results["overrun_probability"] = probabilities * 100
results["risk_score"] = probabilities * 100


def get_risk_level(score):

    if score >= 70:
        return "CRITICAL"

    elif score >= 50:
        return "HIGH"

    elif score >= 30:
        return "MEDIUM"

    return "LOW"


results["risk_level"] = (
    results["risk_score"]
    .apply(get_risk_level)
)


# Sort highest risk first
results = results.sort_values(
    "risk_score",
    ascending=False
).reset_index(drop=True)


# Add ranking
results.insert(
    0,
    "rank",
    range(1, len(results) + 1)
)


# Save
results.to_csv(
    OUTPUT_FILE,
    index=False
)


print("\n" + "=" * 70)
print("RISK SUMMARY")
print("=" * 70)

print(
    results["risk_level"]
    .value_counts()
)


print("\n" + "=" * 70)
print("TOP 10 HIGHEST-RISK PROJECTS")
print("=" * 70)


for _, row in results.head(10).iterrows():

    print(f"\n#{int(row['rank'])} {row['project_name']}")

    print(f"Project Code: {row['project_code']}")

    print(f"Risk Score: {row['risk_score']:.2f}")

    print(
        f"Probability: "
        f"{row['overrun_probability']:.2f}%"
    )

    print(f"Risk Level: {row['risk_level']}")

    print(
        f"Progress: "
        f"{row['physical_progress']:.2f}%"
    )

    print(f"State: {row['State']}")

    print(f"Agency: {row['agency']}")


print("\n" + "=" * 70)

print("Saved to:")
print(OUTPUT_FILE)

print("=" * 70)