import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./components/views/Dashboard";
import RiskMonitor from "./components/views/RiskMonitor";
import Explorer from "./components/views/Explorer";
import ProjectDetails from "./components/views/ProjectDetails";
import Timeline from "./components/views/Timeline";
import LoadingSkeleton from "./components/common/LoadingSkeleton";
import { MOCK_PROJECTS, MOCK_SUMMARY } from "./utils/mockData";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000";

// Normalize project keys between FastAPI backend and frontend UI
function normalizeProject(p) {
  if (!p) return p;
  return {
    ...p,
    rank: p.rank || 1,
    project_name: p.project_name || "Infrastructure Project",
    sector: p.sector || p.agency || p.project_code || "Infrastructure",
    state: p.state || p.State || "India",
    risk_level: p.risk_level || "MEDIUM",
    risk_score: Math.round(p.final_risk_score || p.rule_based_score || p.risk_score || 50),
    cost_overrun_pct: Math.round(p.cost_overrun_percent || p.cost_overrun_pct || 0),
    delay_months: Math.round(p.schedule_change_months || p.delay_months || 0),
    original_cost: p.original_cost || 0,
    latest_cost: p.revised_cost || p.latest_cost || p.original_cost || 0,
    physical_progress: Math.round(p.physical_progress || 0),
    financial_progress: Math.round(p.financial_progress || p.expenditure_progress_gap || p.physical_progress || 0),
    start_date: p.start_date || p.approval_date,
    original_doc: p.original_doc,
    revised_doc: p.revised_doc || p.original_doc,
    risk_factors: p.risk_reasons || p.risk_factors || [],
    contractor: p.agency || p.contractor || "Executing Agency",
  };
}

export function App() {
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Global state & search query
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSectorFilter, setActiveSectorFilter] = useState("all");

  // API Data & Connection State
  const [summary, setSummary] = useState(MOCK_SUMMARY);
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch telemetry data from backend or fallback to mock data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, projectsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/summary`, { timeout: 5000 }),
        axios.get(`${API_BASE_URL}/api/projects?page_size=2000`, { timeout: 5000 }),
      ]);

      if (summaryRes.data) {
        setSummary(summaryRes.data);
      }

      if (projectsRes.data) {
        const rawList = Array.isArray(projectsRes.data)
          ? projectsRes.data
          : projectsRes.data.projects || [];

        if (rawList.length > 0) {
          const normalized = rawList.map(normalizeProject);
          setProjects(normalized);
        }
      }

      setIsConnected(true);
    } catch (err) {
      console.warn("Backend API unreachable, using realistic fallback data:", err.message);
      setIsConnected(false);
      setSummary(MOCK_SUMMARY);
      setProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      if (!ignore) {
        await fetchData();
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [fetchData]);

  // Filter projects globally based on Topbar search & sector filter
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sector?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector =
        activeSectorFilter === "all" || p.sector === activeSectorFilter;

      return matchesSearch && matchesSector;
    });
  }, [projects, searchQuery, activeSectorFilter]);

  // Extract unique sectors list for Topbar filter pills
  const sectors = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.sector).filter(Boolean)));
  }, [projects]);

  const openProject = async (rankOrCode) => {
    try {
      if (isConnected) {
        const res = await axios.get(`${API_BASE_URL}/api/projects/${rankOrCode}`);
        if (res.data) {
          setSelectedProject(normalizeProject(res.data));
          setPage("details");
          return;
        }
      }
    } catch (err) {
      console.error("Project details API error:", err);
    }

    // Fallback to finding project locally
    const found = projects.find((p) => p.rank === rankOrCode || p.project_code === rankOrCode);
    setSelectedProject(found ? normalizeProject(found) : projects[0]);
    setPage("details");
  };

  const renderCurrentPage = () => {
    if (loading) {
      return (
        <div className="p-8">
          <LoadingSkeleton count={4} height="h-32" />
        </div>
      );
    }

    if (page === "details") {
      return (
        <ProjectDetails
          project={selectedProject}
          goBack={() => setPage("explorer")}
        />
      );
    }

    if (page === "risk") {
      return (
        <RiskMonitor
          projects={filteredProjects}
          openProject={openProject}
        />
      );
    }

    if (page === "explorer") {
      return (
        <Explorer
          projects={filteredProjects}
          openProject={openProject}
        />
      );
    }

    if (page === "timeline") {
      return (
        <Timeline
          projects={filteredProjects}
          openProject={openProject}
        />
      );
    }

    return (
      <Dashboard
        summary={summary}
        projects={filteredProjects}
        setPage={setPage}
        openProject={openProject}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        page={page}
        setPage={setPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isConnected={isConnected}
          onRetryConnection={fetchData}
          activeSectorFilter={activeSectorFilter}
          setActiveSectorFilter={setActiveSectorFilter}
          sectors={sectors}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default App;