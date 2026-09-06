import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Filter,
  ShieldAlert,
  AlertCircle
} from "lucide-react";
import RiskBadge from "../common/RiskBadge";

export function RiskMonitor({ projects = [], openProject }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  const categories = [
    { id: "all", label: "All Risk Types" },
    { id: "land", label: "Land Acquisition" },
    { id: "environmental", label: "Environmental & Forest" },
    { id: "financial", label: "Budget Overrun" },
    { id: "technical", label: "Geological & Technical" },
  ];

  const severities = [
    { id: "all", label: "All Severities" },
    { id: "CRITICAL", label: "Critical Risk" },
    { id: "HIGH", label: "High Risk" },
    { id: "MEDIUM", label: "Medium Risk" },
  ];

  // Filter projects based on severity and risk factors category
  const filteredProjects = projects.filter((project) => {
    if (selectedSeverity !== "all" && project.risk_level !== selectedSeverity) {
      return false;
    }
    if (selectedCategory === "all") return true;

    const factorsText = (project.risk_factors || []).join(" ").toLowerCase();
    if (selectedCategory === "land") return factorsText.includes("land") || factorsText.includes("acquisition");
    if (selectedCategory === "environmental") return factorsText.includes("environment") || factorsText.includes("forest");
    if (selectedCategory === "financial") return (project.cost_overrun_pct || 0) > 15;
    if (selectedCategory === "technical") return factorsText.includes("tunnel") || factorsText.includes("design") || factorsText.includes("technical");
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            AI Risk Intelligence
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Infrastructure Risk Monitor
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time bottleneck detection, delay mitigation pathways, and severity breakdown.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Severity Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {severities.map((sev) => {
          const isActive = selectedSeverity === sev.id;
          const count = sev.id === "all"
            ? projects.length
            : projects.filter(p => p.risk_level === sev.id).length;

          return (
            <button
              key={sev.id}
              onClick={() => setSelectedSeverity(sev.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isActive
                  ? "bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-md"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {sev.label}
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {count}
              </div>
            </button>
          );
        })}
      </div>

      {/* Projects Risk Cards List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Projects Match Selected Filters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Try adjusting the risk category or severity filter above.
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.rank || project.project_name}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 rounded-2xl p-6 shadow-sm transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Project Basic Info */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-3">
                    <RiskBadge level={project.risk_level} />
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {project.sector} • {project.state}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {project.project_name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Executing Agency: <strong className="text-slate-700 dark:text-slate-300">{project.contractor || "N/A"}</strong>
                  </p>
                </div>

                {/* Key Metrics Pill Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center min-w-[100px]">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Cost Overrun</div>
                    <div className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      +{project.cost_overrun_pct || 0}%
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center min-w-[100px]">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Delay</div>
                    <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      +{project.delay_months || 0} Months
                    </div>
                  </div>

                  <button
                    onClick={() => openProject(project.rank)}
                    className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    View Project
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Identified Risk Factors Checklist */}
              {project.risk_factors && project.risk_factors.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    Identified Bottlenecks & Risk Causes
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {project.risk_factors.map((factor, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RiskMonitor;
