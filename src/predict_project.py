import pandas as pd
import joblib


MODEL_FILE = "models/xgboost_cost_model.pkl"
ML_DATA_FILE = "data/processed/ml_ready.csv"
FULL_DATA_FILE = "data/processed/ml_features.csv"


print("=" * 70)
print("PAIMANA AI - PROJECT COST OVERRUN PREDICTION")
print("=" * 70)


# ============================================================
# LOAD MODEL AND DATA
# ============================================================

model = joblib.load(MODEL_FILE)

df = pd.read_csv(ML_DATA_FILE)

full_df = pd.read_csv(FULL_DATA_FILE)


# ============================================================
# SELECT PROJECT
# ============================================================

project_number = 0

project = df.iloc[project_number]
full_project = full_df.iloc[project_number]


# ============================================================
# PREPARE MODEL INPUT
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

X = pd.DataFrame([project[features]])


# ============================================================
# PREDICTION
# ============================================================

probability = model.predict_proba(X)[0][1]

risk_score = probability * 100


# ============================================================
# RISK LEVEL
# ============================================================

if risk_score >= 70:
    risk_level = "CRITICAL"

elif risk_score >= 50:
    risk_level = "HIGH"

elif risk_score >= 30:
    risk_level = "MEDIUM"

else:
    risk_level = "LOW"


# ============================================================
# DISPLAY PROJECT
# ============================================================

print("\nPROJECT")
print("-" * 70)

print(f"Project Name       : {full_project['project_name']}")
print(f"State              : {project['State']}")
print(f"Agency             : {project['agency']}")


# ============================================================
# FINANCIAL INFORMATION
# ============================================================

print("\nFINANCIAL")
print("-" * 70)

print(f"Original Cost      : ₹{project['original_cost']:.2f} Cr")
print(f"Expenditure        : ₹{project['expenditure']:.2f} Cr")


# ============================================================
# PROGRESS
# ============================================================

print("\nPROGRESS")
print("-" * 70)

print(f"Physical Progress  : {project['physical_progress']:.2f}%")
print(f"Project Age        : {project['project_age_months']:.0f} months")


# ============================================================
# AI PREDICTION
# ============================================================

print("\nAI PREDICTION")
print("-" * 70)

print(f"Overrun Probability: {probability * 100:.2f}%")
print(f"Risk Score         : {risk_score:.2f}/100")
print(f"Risk Level         : {risk_level}")


print("\n" + "=" * 70)
print("DONE")
print("=" * 70)