NIRMAN AI 
AI-Powered Infrastructure Project Risk Intelligence & Monitoring System
Nirman AI is an intelligent infrastructure project monitoring and risk-assessment platform designed to identify projects that may require managerial attention due to cost overruns, schedule delays, low physical progress, and financial execution anomalies.
The system combines Machine Learning with an explainable rule-based risk engine to generate a project-level risk score and classify projects into:
* 🟢 LOW
* 🟡 MEDIUM
* 🟠 HIGH
* 🔴 CRITICAL
The resulting intelligence is exposed through a FastAPI REST backend and presented through an interactive React + Vite dashboard.

🎯 Problem Statement
Large infrastructure projects generate significant amounts of financial, schedule, and physical-progress data. However, identifying high-risk projects early can be difficult because project information is often distributed across different indicators.
Nirman AI addresses this problem by combining these indicators into a unified risk-intelligence system.
Instead of simply displaying project data, the platform answers:
Which projects are at risk, how severe is the risk, and what are the major reasons behind it?

🚀 Key Features
📊 Infrastructure Risk Dashboard
Provides a centralized overview of the project portfolio, including:
* Total monitored projects
* Critical-risk projects
* High-risk projects
* Medium-risk projects
* Low-risk projects
* Top-risk projects
* Risk distribution
🔍 Project Explorer
Allows users to:
* Search projects
* Filter by risk level
* Filter by state
* Filter by agency
* Sort by risk score
* Sort by physical progress
* Sort by cost overrun
* Sort by schedule delay
* Navigate through project pages
⚠️ Risk Monitor
Highlights projects requiring attention and identifies major risk drivers:
* Cost Overrun
* Schedule Delay
* Low Physical Progress
* Financial Anomaly
📅 Project Timeline
Provides important project milestones such as:
* Approval date
* Start date
* Original completion date
* Revised completion date
* Schedule changes
📋 Project Details
Provides detailed information about individual projects, including:
* Project identity
* Agency
* State
* Cost
* Expenditure
* Physical progress
* Cost overrun
* Schedule information
* Final risk score
* Risk classification
* Explainable risk reasons

🧠 AI & Risk Assessment
Nirman AI uses a hybrid approach combining:
              PROJECT DATA
                   │
                   ▼
          Feature Engineering
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
       XGBoost        Rule-Based Engine
          │                 │
          │                 ├── Cost Risk
          │                 ├── Schedule Risk
          │                 ├── Progress Risk
          │                 └── Financial Risk
          │                 │
          └────────┬────────┘
                   ▼
            Final Risk Score
                   │
                   ▼
       LOW / MEDIUM / HIGH /
             CRITICAL

🤖 Machine Learning Model
The project experiments with multiple classification approaches for cost-overrun prediction:
* Logistic Regression
* Random Forest
* XGBoost
The current risk engine uses the trained XGBoost model to generate the ML probability component of the project risk score.
The trained model is stored at:
models/xgboost_cost_model.pkl
The risk engine loads this model using Joblib and obtains the cost-overrun probability using:
model.predict_proba(X)[:, 1]

📈 XGBoost Performance
The current XGBoost model was evaluated using a held-out test set.
Dataset
Total samples:      1,970
Training samples:   1,576
Testing samples:      394
Performance
Metric	Result
Accuracy	80.96%
ROC-AUC	0.8401
Precision — Overrun	68%
Recall — Overrun	58%
F1-score — Overrun	63%
Confusion Matrix
                 Predicted
              No Overrun  Overrun

Actual
No Overrun       256        30
Overrun           45        63
The model therefore demonstrates good classification ability, while the current dataset size and single-snapshot nature mean that additional longitudinal project data and temporal validation would be required for production-grade forecasting.

🧮 Feature Engineering
Raw project information is transformed into ML and risk-engine features.
Important engineered features include:
Cost Overrun
Cost Overrun
= Revised Cost - Original Cost
Cost Overrun %
= (Revised Cost - Original Cost)
  / Original Cost × 100
Expenditure Percentage
Expenditure %
= Expenditure / Revised Cost × 100
Remaining Cost
Remaining Cost
= Revised Cost - Expenditure
Expenditure-Progress Gap
Expenditure-Progress Gap
= Expenditure % - Physical Progress %
Schedule Change
The system calculates changes between the original and revised completion dates.
Project Age
The project age is derived from the project start date and reporting period.
Additional Risk Indicators
The feature-engineering pipeline also derives indicators related to:
* Low physical progress
* Spending ahead of progress
* Expenditure exceeding revised cost
* High cost overruns

⚙️ Explainable Risk Engine
Nirman does not rely exclusively on the ML prediction.
The system also calculates deterministic risk components.
1. Cost Risk
Cost Overrun	Risk Score
> 50%	100
> 25%	75
> 10%	50
> 0%	25
≤ 0%	0
2. Schedule Risk
Schedule Delay	Risk Score
> 24 months	100
> 12 months	75
> 6 months	50
> 0 months	25
No delay	0
3. Physical Progress Risk
Physical Progress	Risk Score
< 25%	100
25–50%	75
50–75%	40
≥ 75%	0
4. Financial Risk
The system compares financial expenditure against physical progress.
Expenditure-Progress Gap	Risk Score
> 50	100
> 20	75
> 10	40
≤ 10	0
🧮 Final Risk Score
The rule-based component is calculated using:
Rule-Based Score =
    30% × Cost Risk
  + 30% × Schedule Risk
  + 25% × Progress Risk
  + 15% × Financial Risk
The current implementation then combines this with the XGBoost ML score:
Final Risk Score =
    60% × Rule-Based Score
  + 40% × ML Score
Therefore, the system combines:
* Explainability from deterministic rules
* Pattern recognition from XGBoost
This provides a more interpretable risk assessment than relying on an ML classifier alone.

🚦 Risk Classification
The final risk score is converted into four levels:
Score	Risk Level
70–100	🔴 CRITICAL
50–69.99	🟠 HIGH
30–49.99	🟡 MEDIUM
0–29.99	🟢 LOW
💡 Explainable Risk Reasons
Nirman generates human-readable explanations for the risk classification.
Examples:
Cost overrun above 10%
Schedule delay above 6 months
Low physical progress
Expenditure is significantly ahead of physical progress
Expenditure exceeds revised project cost
This allows users to understand why a project is considered risky, rather than receiving only an unexplained score.

🏗️ System Architecture
┌───────────────────────────────┐
│       PROJECT DATA            │
│ Cost / Expenditure / Progress │
│ Dates / State / Agency        │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│      DATA PROCESSING          │
│ Cleaning + Feature Engineering│
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌──────────────┐  ┌────────────────┐
│   XGBoost    │  │  Rule Engine   │
│ ML Probability│  │ Cost           │
│              │  │ Schedule       │
│              │  │ Progress       │
│              │  │ Financial      │
└──────┬───────┘  └───────┬────────┘
       │                  │
       └────────┬─────────┘
                ▼
      ┌─────────────────────┐
      │  FINAL RISK SCORE   │
      └──────────┬──────────┘
                 ▼
      ┌─────────────────────┐
      │ LOW / MEDIUM / HIGH │
      │      / CRITICAL     │
      └──────────┬──────────┘
                 │
                 ▼
      ┌─────────────────────┐
      │     FASTAPI         │
      │      BACKEND        │
      └──────────┬──────────┘
                 │ REST / JSON
                 ▼
      ┌─────────────────────┐
      │    REACT + VITE     │
      │      FRONTEND       │
      └─────────────────────┘

🛠️ Technology Stack
Machine Learning & Data
* Python
* Pandas
* NumPy
* Scikit-learn
* XGBoost
* Joblib
Backend
* FastAPI
* Uvicorn
* Pandas
* REST API
* CORS Middleware
Frontend
* React
* Vite
* Axios
* Recharts
* Lucide React
* CSS
Data Storage
The current implementation uses processed CSV datasets:
data/processed/ml_features.csv
data/processed/final_project_risk.csv

📁 Project Structure
Nirman/
│
├── backend/
│   └── main.py
│
├── data/
│   ├── raw/
│   └── processed/
│       ├── ml_features.csv
│       └── final_project_risk.csv
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── models/
│   ├── cost_overrun_model.pkl
│   ├── random_forest_cost_model.pkl
│   └── xgboost_cost_model.pkl
│
├── src/
│   ├── feature_engineering.py
│   ├── train_cost_model.py
│   ├── train_random_forest.py
│   ├── train_xgboost.py
│   ├── risk_engine.py
│   └── ...
│
├── requirements.txt
└── README.md

🔄 End-to-End Workflow
Step 1 — Raw Data
Project information is collected containing:
* Project cost
* Revised cost
* Expenditure
* Physical progress
* Dates
* Agency
* State
* Project identifiers
Step 2 — Data Processing
The raw data is cleaned and transformed into structured project data.
Step 3 — Feature Engineering
Additional indicators such as cost overrun, project age, expenditure percentage and progress gaps are calculated.
Step 4 — Model Training
The XGBoost classifier is trained to estimate the probability of cost overrun.
The trained model is saved as:
models/xgboost_cost_model.pkl
Step 5 — Risk Engine
The saved XGBoost model is loaded by:
src/risk_engine.py
The ML probability is combined with explainable rule-based risk calculations.
Step 6 — Risk Classification
Each project receives:
Risk Score
Risk Level
Risk Reasons
Step 7 — FastAPI
The processed risk data is exposed through REST endpoints.
Step 8 — React Dashboard
The frontend communicates with FastAPI and visualizes the project intelligence.

🔌 API Endpoints
The FastAPI backend provides endpoints including:
Endpoint	Purpose
GET /	API/system health
GET /api/summary	Portfolio risk summary
GET /api/projects/top-risk	Highest-risk projects
GET /api/projects	Project explorer with filtering/search/sorting
GET /api/project-filters	Available states, agencies and risk levels
GET /api/risk-monitor	Risk monitoring and risk drivers
GET /api/projects/{rank}	Project details
The backend loads the processed risk dataset and serves JSON responses to the frontend.

💻 Installation
1. Clone the repository
git clone https://github.com/sanket-gayakhe/Nirman.git
cd Nirman

🐍 Backend Setup
Create a virtual environment:
python3 -m venv .venv
Activate it on macOS/Linux:
source .venv/bin/activate
Install Python dependencies:
pip install -r requirements.txt
Start the FastAPI server:
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
Backend:
http://127.0.0.1:8000
API documentation:
http://127.0.0.1:8000/docs

⚛️ Frontend Setup
Open a new terminal:
cd frontend
Install dependencies:
npm install
Start the development server:
npm run dev
Open the URL displayed by Vite, typically:
http://localhost:5173

🤖 Retraining the XGBoost Model
To retrain the XGBoost cost-overrun model:
python src/train_xgboost.py
The trained model is saved to:
models/xgboost_cost_model.pkl
After training, the model can be used by the risk engine.

⚙️ Running the Risk Engine
To regenerate project risk results using the trained XGBoost model:
python src/risk_engine.py
The risk engine reads:
data/processed/ml_features.csv
loads:
models/xgboost_cost_model.pkl
and generates:
data/processed/final_project_risk.csv

🔐 Environment & Security
Do not commit sensitive information to GitHub.
Never commit:
.env
API keys
Passwords
Secrets
.venv/
node_modules/
Use environment variables for credentials and other sensitive configuration when required.

📊 Current Model Limitations
The current implementation is a prototype/decision-support system rather than a production-grade autonomous forecasting platform.
Important limitations include:
1. The current dataset is relatively limited.
2. The available project data represents a reporting snapshot rather than a long historical time series.
3. Future project forecasting would benefit from longitudinal observations for each project.
4. The XGBoost model's 80.96% accuracy should not be interpreted as an 80.96% guarantee of future prediction accuracy.
5. Production deployment would require additional validation using temporal or out-of-time testing.
6. Probability calibration and monitoring should be added before using predictions for high-stakes decisions.

🔮 Future Enhancements
Potential future improvements include:
📈 Time-Series Risk Prediction
Use multiple historical observations per project to predict how risk evolves over time.
🔔 Real-Time Alerts
Automatically notify authorities when a project's risk crosses a defined threshold.
🗺️ Geographic Risk Visualization
Display project risk geographically using an interactive map.
📑 Automated Reports
Generate periodic project-risk reports for departments and decision-makers.
🔄 Real-Time Data Integration
Connect directly with government project-management systems instead of relying on processed CSV snapshots.
🧠 Advanced ML Models
Experiment with:
* LightGBM
* CatBoost
* Temporal models
* Ensemble models
* Calibrated probability models
📊 Model Monitoring
Track:
* Model drift
* Feature drift
* Prediction quality
* False positives
* False negatives

🎯 Project Objective
Nirman AI aims to transform infrastructure project monitoring from a reactive reporting process into a more proactive, data-driven risk-management system.
The platform brings together:
DATA
  +
MACHINE LEARNING
  +
EXPLAINABLE RULES
  +
RISK INTELLIGENCE
  +
VISUALIZATION
to help decision-makers identify projects that may require attention earlier.

👥 Project Philosophy
Nirman AI is designed around three principles:
1. Predictive
Use machine learning to identify patterns associated with cost-overrun risk.
2. Explainable
Provide understandable reasons behind risk assessments.
3. Actionable
Present risk information through a dashboard that helps users prioritize projects requiring attention.

📌 Disclaimer
Nirman AI is intended as a project-risk intelligence and decision-support prototype.
Its current ML performance should not be interpreted as a guarantee of future project outcomes. Real-world deployment would require larger longitudinal datasets, rigorous temporal validation, probability calibration, continuous monitoring, and domain validation.

⭐ Summary
Nirman AI combines:
XGBoost + Explainable Risk Rules + FastAPI + React
to transform infrastructure project data into actionable risk intelligence.
Project Data
     ↓
Feature Engineering
     ↓
XGBoost + Rule Engine
     ↓
Risk Score
     ↓
Risk Level + Explanation
     ↓
FastAPI
     ↓
React Dashboard
Nirman AI — From project data to actionable risk intelligence. 🚧
