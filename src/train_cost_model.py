import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    roc_auc_score
)

# ============================================================
# CONFIGURATION
# ============================================================

INPUT_FILE = "data/processed/ml_ready.csv"

TARGET = "cost_overrun_flag"

NUMERIC_FEATURES = [
    "original_cost",
    "expenditure",
    "physical_progress",
    "planned_duration_months",
    "project_age_months",
    "approval_to_start_months"
]

CATEGORICAL_FEATURES = [
    "State",
    "agency"
]


# ============================================================
# LOAD DATA
# ============================================================

print("=" * 70)
print("COST OVERRUN ML MODEL")
print("=" * 70)

df = pd.read_csv(INPUT_FILE)

print(f"\nDataset shape: {df.shape}")


# ============================================================
# FEATURES AND TARGET
# ============================================================

X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
y = df[TARGET]


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f"\nTraining samples: {len(X_train)}")
print(f"Testing samples:  {len(X_test)}")


# ============================================================
# PREPROCESSING
# ============================================================

numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(
        handle_unknown="ignore",
        sparse_output=False
    ))
])

preprocessor = ColumnTransformer([
    ("numeric", numeric_pipeline, NUMERIC_FEATURES),
    ("categorical", categorical_pipeline, CATEGORICAL_FEATURES)
])


# ============================================================
# MODEL
# ============================================================

model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)


# ============================================================
# COMPLETE PIPELINE
# ============================================================

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model)
])


# ============================================================
# TRAIN
# ============================================================

print("\nTraining Logistic Regression...")

pipeline.fit(X_train, y_train)

print("Training complete.")


# ============================================================
# PREDICTIONS
# ============================================================

y_pred = pipeline.predict(X_test)
y_probability = pipeline.predict_proba(X_test)[:, 1]


# ============================================================
# EVALUATION
# ============================================================

accuracy = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_probability)

print("\n" + "=" * 70)
print("MODEL PERFORMANCE")
print("=" * 70)

print(f"\nAccuracy: {accuracy:.4f}")
print(f"ROC-AUC:  {roc_auc:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# ============================================================
# SAVE MODEL
# ============================================================

import joblib

OUTPUT_MODEL = "models/cost_overrun_model.pkl"

joblib.dump(pipeline, OUTPUT_MODEL)

print("\nModel saved to:")
print(OUTPUT_MODEL)

print("\n" + "=" * 70)
print("DONE")
print("=" * 70)