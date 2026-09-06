export const MOCK_SUMMARY = {
  total_projects: 48,
  risk_distribution: {
    CRITICAL: 6,
    HIGH: 14,
    MEDIUM: 18,
    LOW: 10
  },
  total_budget: 184500, // in Cr
  avg_delay_months: 14.2,
  sectors: ["Road Transport & Highways", "Railways", "Power & Renewable Energy", "Urban Infrastructure & Metro", "Ports & Waterways", "Airports"]
};

export const MOCK_PROJECTS = [
  {
    rank: 1,
    project_name: "Delhi-Mumbai Expressway Phase II",
    sector: "Road Transport & Highways",
    state: "Maharashtra",
    risk_level: "CRITICAL",
    risk_score: 88,
    cost_overrun_pct: 34.5,
    delay_months: 22,
    original_cost: 14500,
    latest_cost: 19500,
    physical_progress: 62,
    financial_progress: 74,
    start_date: "2021-03-15",
    original_doc: "2024-12-31",
    revised_doc: "2026-10-31",
    risk_factors: [
      "Land acquisition delay in Palghar district",
      "Environmental clearance pending for Forest Division",
      "Monsoon damage to drainage sub-base"
    ],
    contractor: "National Highways Authority of India (NHAI)"
  },
  {
    rank: 2,
    project_name: "Mumbai Metro Line 3 (Aqua Line)",
    sector: "Urban Infrastructure & Metro",
    state: "Maharashtra",
    risk_level: "CRITICAL",
    risk_score: 84,
    cost_overrun_pct: 42.1,
    delay_months: 28,
    original_cost: 23136,
    latest_cost: 32868,
    physical_progress: 91,
    financial_progress: 89,
    start_date: "2017-01-10",
    original_doc: "2021-12-31",
    revised_doc: "2025-06-30",
    risk_factors: [
      "Aarey car shed litigation delays",
      "Underground tunneling geological surprises near Girgaon",
      "Utility relocation bottlenecks"
    ],
    contractor: "MMRC / L&T-STEC JV"
  },
  {
    rank: 3,
    project_name: "Kolkata East-West Metro Extension",
    sector: "Urban Infrastructure & Metro",
    state: "West Bengal",
    risk_level: "CRITICAL",
    risk_score: 82,
    cost_overrun_pct: 28.0,
    delay_months: 18,
    original_cost: 8575,
    latest_cost: 10976,
    physical_progress: 85,
    financial_progress: 88,
    start_date: "2018-06-01",
    original_doc: "2023-03-31",
    revised_doc: "2025-11-30",
    risk_factors: [
      "Bowbazar subsidence incidents requiring structural stabilization",
      "Land title disputes along riverbank"
    ],
    contractor: "KMRCL"
  },
  {
    rank: 4,
    project_name: "Dedicated Freight Corridor (Eastern DFC)",
    sector: "Railways",
    state: "Uttar Pradesh",
    risk_level: "HIGH",
    risk_score: 76,
    cost_overrun_pct: 19.4,
    delay_months: 14,
    original_cost: 30355,
    latest_cost: 36243,
    physical_progress: 88,
    financial_progress: 84,
    start_date: "2016-04-20",
    original_doc: "2022-03-31",
    revised_doc: "2025-08-15",
    risk_factors: [
      "Right of Way (RoW) clearance bottlenecks",
      "Steel supplier price volatility"
    ],
    contractor: "DFCCIL"
  },
  {
    rank: 5,
    project_name: "Zojila Tunnel Construction Project",
    sector: "Road Transport & Highways",
    state: "Jammu & Kashmir",
    risk_level: "HIGH",
    risk_score: 73,
    cost_overrun_pct: 12.8,
    delay_months: 12,
    original_cost: 6800,
    latest_cost: 7670,
    physical_progress: 54,
    financial_progress: 58,
    start_date: "2020-10-15",
    original_doc: "2026-11-30",
    revised_doc: "2027-12-31",
    risk_factors: [
      "Extreme sub-zero winter stoppage",
      "Avalanche safety & high-altitude ventilation engineering challenges"
    ],
    contractor: "MEIL"
  },
  {
    rank: 6,
    project_name: "Vadodara-Mumbai Expressway Segment 3",
    sector: "Road Transport & Highways",
    state: "Gujarat",
    risk_level: "MEDIUM",
    risk_score: 58,
    cost_overrun_pct: 8.5,
    delay_months: 6,
    original_cost: 9200,
    latest_cost: 9982,
    physical_progress: 78,
    financial_progress: 75,
    start_date: "2021-09-01",
    original_doc: "2024-09-30",
    revised_doc: "2025-03-31",
    risk_factors: [
      "Local flyover interchange design revision",
      "Rainy season gravel supply chain pause"
    ],
    contractor: "IRB Infrastructure"
  },
  {
    rank: 7,
    project_name: "Kudankulam Nuclear Power Plant Unit 3 & 4",
    sector: "Power & Renewable Energy",
    state: "Tamil Nadu",
    risk_level: "HIGH",
    risk_score: 79,
    cost_overrun_pct: 22.0,
    delay_months: 16,
    original_cost: 39849,
    latest_cost: 48615,
    physical_progress: 72,
    financial_progress: 70,
    start_date: "2017-06-29",
    original_doc: "2023-12-31",
    revised_doc: "2026-03-31",
    risk_factors: [
      "Import component logistics delays",
      "Safety audit compliance cycles"
    ],
    contractor: "NPCIL / Rosatom"
  },
  {
    rank: 8,
    project_name: "Jewar International Airport Phase 1",
    sector: "Airports",
    state: "Uttar Pradesh",
    risk_level: "LOW",
    risk_score: 32,
    cost_overrun_pct: 3.2,
    delay_months: 3,
    original_cost: 10056,
    latest_cost: 10377,
    physical_progress: 89,
    financial_progress: 86,
    start_date: "2021-08-01",
    original_doc: "2024-09-30",
    revised_doc: "2025-04-30",
    risk_factors: [
      "Runway final calibration testing",
      "Terminal retail fitouts"
    ],
    contractor: "YIAPL / Tata Projects"
  }
];
