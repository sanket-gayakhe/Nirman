import pandas as pd


INPUT_FILE = "data/processed/ml_features.csv"
OUTPUT_FILE = "data/processed/ml_ready.csv"

TARGET = "cost_overrun_flag"

FEATURES = [
    "project_name",
    "project_code",
    "legacy_ocms_code",
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
print("ML DATASET PREPARATION")
print("=" * 70)


df = pd.read_csv(INPUT_FILE)

ml_df = df[FEATURES + [TARGET]].copy()


# Remove rows where required MODEL features are missing
required_model_features = [
    "original_cost",
    "expenditure",
    "physical_progress",
    "planned_duration_months",
    "project_age_months",
    "approval_to_start_months",
    "State",
    "agency"
]

ml_df = ml_df.dropna(
    subset=required_model_features + [TARGET]
).reset_index(drop=True)


ml_df.to_csv(
    OUTPUT_FILE,
    index=False
)


print(f"\nRows: {len(ml_df)}")

print("\nModel Features:")

for feature in required_model_features:
    print(f"- {feature}")

print("\nIdentifiers retained:")
print("- project_name")
print("- project_code")
print("- legacy_ocms_code")

print("\nTarget:")
print(f"- {TARGET}")

print("\nTarget distribution:")
print(ml_df[TARGET].value_counts())

print("\nTarget percentage:")
print(
    (
        ml_df[TARGET]
        .value_counts(normalize=True)
        * 100
    ).round(2)
)

print("\nSaved to:")
print(OUTPUT_FILE)