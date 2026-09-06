from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

RISK_DATA_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "final_project_risk.csv"
)

PROJECT_DATA_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "ml_features.csv"
)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="PAIMANA AI API",
    description="AI-powered infrastructure project risk intelligence API",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# LOAD DATA
# ============================================================

df = pd.read_csv(RISK_DATA_FILE)

# Rich project dataset containing timeline/date information
project_df = pd.read_csv(PROJECT_DATA_FILE)


# ============================================================
# DATE COLUMNS
# ============================================================

DATE_COLUMNS = [
    "approval_date",
    "start_date",
    "original_doc",
    "revised_doc",
]


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def clean_value(value):
    """
    Convert pandas/numpy values into JSON-compatible values.
    """

    if pd.isna(value):
        return None

    if hasattr(value, "item"):
        value = value.item()

    return value


def parse_risk_reasons(value):
    """
    Convert the risk reason string into a clean list.

    Example:

    "Cost overrun above 10% | Schedule delay above 6 months |
     Low physical progress"

    becomes:

    [
        "Cost overrun above 10%",
        "Schedule delay above 6 months",
        "Low physical progress"
    ]
    """

    if value is None or pd.isna(value):
        return []

    text = str(value).strip()

    if not text:
        return []

    reasons = [
        reason.strip()
        for reason in text.split("|")
        if reason.strip()
    ]

    return reasons


def find_project_dates(row):
    """
    Find timeline/date information for a project from ml_features.csv.

    Matching priority:
    1. project_name + project_code + legacy_ocms_code
    2. project_name + legacy_ocms_code
    3. project_name
    """

    project_name = str(
        row.get("project_name", "")
    ).strip()

    project_code = str(
        row.get("project_code", "")
    ).strip()

    legacy_code = str(
        row.get("legacy_ocms_code", "")
    ).strip()

    if not project_name:
        return {}

    candidates = project_df.copy()

    # --------------------------------------------------------
    # MATCH 1
    # --------------------------------------------------------

    if (
        "project_code" in candidates.columns
        and "legacy_ocms_code" in candidates.columns
    ):

        matches = candidates[
            (
                candidates["project_name"]
                .fillna("")
                .astype(str)
                .str.strip()
                == project_name
            )
            &
            (
                candidates["project_code"]
                .fillna("")
                .astype(str)
                .str.strip()
                == project_code
            )
            &
            (
                candidates["legacy_ocms_code"]
                .fillna("")
                .astype(str)
                .str.strip()
                == legacy_code
            )
        ]

        if len(matches) > 0:
            return matches.iloc[0].to_dict()

    # --------------------------------------------------------
    # MATCH 2
    # --------------------------------------------------------

    if "legacy_ocms_code" in candidates.columns:

        matches = candidates[
            (
                candidates["project_name"]
                .fillna("")
                .astype(str)
                .str.strip()
                == project_name
            )
            &
            (
                candidates["legacy_ocms_code"]
                .fillna("")
                .astype(str)
                .str.strip()
                == legacy_code
            )
        ]

        if len(matches) > 0:
            return matches.iloc[0].to_dict()

    # --------------------------------------------------------
    # MATCH 3
    # --------------------------------------------------------

    matches = candidates[
        candidates["project_name"]
        .fillna("")
        .astype(str)
        .str.strip()
        == project_name
    ]

    if len(matches) > 0:
        return matches.iloc[0].to_dict()

    return {}


def add_timeline_data(result, row):
    """
    Add project timeline/date fields to an API result.
    """

    timeline_data = find_project_dates(row)

    for column in DATE_COLUMNS:

        if column in timeline_data:

            result[column] = clean_value(
                timeline_data[column]
            )

        elif column not in result:

            result[column] = None

    return result


def project_to_dict(row):
    """
    Convert one pandas row into a JSON-compatible dictionary.

    Also attaches timeline/date information from ml_features.csv.
    """

    result = {}

    for column in row.index:

        result[column] = clean_value(
            row[column]
        )

    # Always return risk reasons as a proper list.
    result["risk_reasons"] = parse_risk_reasons(
        row.get("risk_reasons")
    )

    # Add timeline information.
    result = add_timeline_data(
        result,
        row,
    )

    return result


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "system": "PAIMANA AI",
        "status": "online",
        "projects": len(df),
    }


# ============================================================
# DASHBOARD SUMMARY
# ============================================================

@app.get("/api/summary")
def summary():

    risk_distribution = (
        df["risk_level"]
        .value_counts()
        .reindex(
            [
                "CRITICAL",
                "HIGH",
                "MEDIUM",
                "LOW",
            ],
            fill_value=0,
        )
        .to_dict()
    )

    return {
        "total_projects": len(df),
        "risk_distribution": risk_distribution,
    }


# ============================================================
# TOP RISK PROJECTS
# ============================================================

@app.get("/api/projects/top-risk")
def top_risk(
    limit: int = 10,
):

    limit = max(
        1,
        min(limit, 100),
    )

    result = (
        df
        .sort_values(
            "final_risk_score",
            ascending=False,
        )
        .head(limit)
        .copy()
    )

    return [
        project_to_dict(row)
        for _, row in result.iterrows()
    ]


# ============================================================
# PROJECT EXPLORER
# ============================================================

@app.get("/api/projects")
def projects(
    search: str = "",
    risk: str = "ALL",
    state: str = "ALL",
    agency: str = "ALL",
    sort: str = "risk",
    page: int = 1,
    page_size: int = 25,
):

    result = df.copy()

    # --------------------------------------------------------
    # SEARCH
    # --------------------------------------------------------

    if search.strip():

        query = search.strip().lower()

        project_name_match = (
            result["project_name"]
            .fillna("")
            .astype(str)
            .str.lower()
            .str.contains(
                query,
                regex=False,
            )
        )

        project_code_match = (
            result["project_code"]
            .fillna("")
            .astype(str)
            .str.lower()
            .str.contains(
                query,
                regex=False,
            )
        )

        legacy_code_match = (
            result["legacy_ocms_code"]
            .fillna("")
            .astype(str)
            .str.lower()
            .str.contains(
                query,
                regex=False,
            )
        )

        agency_match = (
            result["agency"]
            .fillna("")
            .astype(str)
            .str.lower()
            .str.contains(
                query,
                regex=False,
            )
        )

        state_match = (
            result["State"]
            .fillna("")
            .astype(str)
            .str.lower()
            .str.contains(
                query,
                regex=False,
            )
        )

        result = result[
            project_name_match
            | project_code_match
            | legacy_code_match
            | agency_match
            | state_match
        ]

    # --------------------------------------------------------
    # RISK FILTER
    # --------------------------------------------------------

    if risk.upper() != "ALL":

        result = result[
            result["risk_level"]
            .fillna("")
            .astype(str)
            .str.upper()
            == risk.upper()
        ]

    # --------------------------------------------------------
    # STATE FILTER
    # --------------------------------------------------------

    if state.upper() != "ALL":

        result = result[
            result["State"]
            .fillna("")
            .astype(str)
            .str.lower()
            == state.lower()
        ]

    # --------------------------------------------------------
    # AGENCY FILTER
    # --------------------------------------------------------

    if agency.upper() != "ALL":

        result = result[
            result["agency"]
            .fillna("")
            .astype(str)
            .str.lower()
            == agency.lower()
        ]

    # --------------------------------------------------------
    # SORTING
    # --------------------------------------------------------

    if sort == "risk":

        result = result.sort_values(
            "final_risk_score",
            ascending=False,
        )

    elif sort == "risk_low":

        result = result.sort_values(
            "final_risk_score",
            ascending=True,
        )

    elif sort == "progress":

        result = result.sort_values(
            "physical_progress",
            ascending=False,
        )

    elif sort == "progress_low":

        result = result.sort_values(
            "physical_progress",
            ascending=True,
        )

    elif sort == "cost_overrun":

        result = result.sort_values(
            "cost_overrun_percent",
            ascending=False,
        )

    elif sort == "cost_overrun_low":

        result = result.sort_values(
            "cost_overrun_percent",
            ascending=True,
        )

    elif sort == "schedule_delay":

        result = result.sort_values(
            "schedule_change_months",
            ascending=False,
        )

    # --------------------------------------------------------
    # PAGINATION
    # --------------------------------------------------------

    total = len(result)

    page = max(
        1,
        page,
    )

    page_size = max(
        1,
        min(page_size, 3000),
    )

    start = (
        page - 1
    ) * page_size

    end = start + page_size

    paginated_result = result.iloc[
        start:end
    ]

    total_pages = (
        (total + page_size - 1)
        // page_size
        if total > 0
        else 0
    )

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "projects": [
            project_to_dict(row)
            for _, row in paginated_result.iterrows()
        ],
    }


# ============================================================
# FILTER OPTIONS
# ============================================================

@app.get("/api/project-filters")
def project_filters():

    states = sorted(
        [
            str(value)
            for value in df["State"]
            .dropna()
            .unique()
        ]
    )

    agencies = sorted(
        [
            str(value)
            for value in df["agency"]
            .dropna()
            .unique()
        ]
    )

    return {
        "states": states,
        "agencies": agencies,
        "risk_levels": [
            "CRITICAL",
            "HIGH",
            "MEDIUM",
            "LOW",
        ],
    }


# ============================================================
# RISK MONITOR
# ============================================================

@app.get("/api/risk-monitor")
def risk_monitor(
    limit: int = Query(
        default=25,
        ge=1,
        le=100,
    ),
    risk: str = "ATTENTION",
):

    result = df.copy()

    # --------------------------------------------------------
    # FILTER
    # --------------------------------------------------------

    if risk.upper() == "ATTENTION":

        result = result[
            result["risk_level"]
            .fillna("")
            .astype(str)
            .str.upper()
            .isin(
                [
                    "CRITICAL",
                    "HIGH",
                ]
            )
        ]

    elif risk.upper() != "ALL":

        result = result[
            result["risk_level"]
            .fillna("")
            .astype(str)
            .str.upper()
            == risk.upper()
        ]

    # --------------------------------------------------------
    # SORT BY RISK
    # --------------------------------------------------------

    result = result.sort_values(
        "final_risk_score",
        ascending=False,
    )

    # --------------------------------------------------------
    # RISK SUMMARY
    # --------------------------------------------------------

    critical_count = int(
        (
            df["risk_level"]
            .fillna("")
            .astype(str)
            .str.upper()
            == "CRITICAL"
        ).sum()
    )

    high_count = int(
        (
            df["risk_level"]
            .fillna("")
            .astype(str)
            .str.upper()
            == "HIGH"
        ).sum()
    )

    medium_count = int(
        (
            df["risk_level"]
            .fillna("")
            .astype(str)
            .str.upper()
            == "MEDIUM"
        ).sum()
    )

    low_count = int(
        (
            df["risk_level"]
            .fillna("")
            .astype(str)
            .str.upper()
            == "LOW"
        ).sum()
    )

    # --------------------------------------------------------
    # RISK DRIVER COUNTS
    # --------------------------------------------------------

    driver_counts = {
        "Cost Overrun": 0,
        "Schedule Delay": 0,
        "Low Progress": 0,
        "Financial Anomaly": 0,
    }

    for _, row in df.iterrows():

        reasons = parse_risk_reasons(
            row.get("risk_reasons")
        )

        reasons_text = " ".join(
            reasons
        ).lower()

        # Cost
        if "cost overrun" in reasons_text:

            driver_counts[
                "Cost Overrun"
            ] += 1

        # Schedule
        if "schedule delay" in reasons_text:

            driver_counts[
                "Schedule Delay"
            ] += 1

        # Physical progress
        if (
            "low physical progress"
            in reasons_text
        ):

            driver_counts[
                "Low Progress"
            ] += 1

        # Financial anomaly
        if (
            "spending is significantly ahead"
            in reasons_text
            or
            "expenditure exceeds"
            in reasons_text
        ):

            driver_counts[
                "Financial Anomaly"
            ] += 1

    # --------------------------------------------------------
    # TOP PROJECTS
    # --------------------------------------------------------

    top_projects = result.head(
        limit
    )

    return {

        "summary": {
            "critical": critical_count,
            "high": high_count,
            "medium": medium_count,
            "low": low_count,
            "attention": (
                critical_count
                + high_count
            ),
        },

        "risk_drivers": driver_counts,

        "projects": [
            project_to_dict(row)
            for _, row in top_projects.iterrows()
        ],
    }


# ============================================================
# PROJECT DETAIL
# ============================================================

@app.get("/api/projects/{rank}")
def project_detail(rank: int):

    if (
        rank < 1
        or rank > len(df)
    ):

        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    result = (
        df
        .sort_values(
            "final_risk_score",
            ascending=False,
        )
        .iloc[
            rank - 1
        ]
    )

    return project_to_dict(result)