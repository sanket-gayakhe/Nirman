import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ChevronRight
} from "lucide-react";
import RiskBadge from "../common/RiskBadge";
import { formatDate } from "../../utils/formatters";

export function Timeline({ projects = [], openProject }) {
  const [selectedSector, setSelectedSector] = useState("all");

  const sectors = ["all", ...Array.from(new Set(projects.map((p) => p.sector).filter(Boolean)))];

  const filteredProjects = selectedSector === "all"
    ? projects
    : projects.filter((p) => p.sector === selectedSector);

  const getMilestones = (project) => {
    return [
      {
        title: "Sanction & Approval",
        date: project.start_date || "2021-01-01",
        completed: true,
        status: "Completed",
      },
      {
        title: "Land Acquisition & Environment",
        date: "2022-06-15",
        completed: (project.physical_progress || 0) > 30,
        status: (project.physical_progress || 0) > 30 ? "Completed" : "In Progress",
      },
      {
        title: "Civil & Structural Engineering",
        date: "2024-03-31",
        completed: (project.physical_progress || 0) > 70,
        status: (project.physical_progress || 0) > 70 ? "Completed" : "In Progress",
      },
      {
        title: "Final Target Completion (Revised)",
        date: project.revised_doc || project.original_doc || "2025-12-31",
        completed: (project.physical_progress || 0) >= 100,
        status: (project.physical_progress || 0) >= 100 ? "Completed" : "Targeted",
        delayed: (project.delay_months || 0) > 0,
      },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            Milestone Gantt Tracker
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Project Timelines & Delays
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track phase progress, scheduled target dates vs estimated delay extensions.
          </p>
        </div>

        {/* Sector Filter dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Sector:</span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300 font-medium"
          >
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec === "all" ? "All Sectors" : sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Timeline List */}
      <div className="space-y-6">
        {filteredProjects.map((project) => {
          const milestones = getMilestones(project);
          return (
            <div
              key={project.rank || project.project_name}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <RiskBadge level={project.risk_level} />
                    <span className="text-xs text-slate-400">
                      {project.sector} • {project.state}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {project.project_name}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Delay Extension</div>
                    <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
                      +{project.delay_months || 0} Months
                    </div>
                  </div>
                  <button
                    onClick={() => openProject(project.rank)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
                  >
                    Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Milestones Visual Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {milestones.map((ms, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border relative transition-all ${
                      ms.completed
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : ms.delayed
                        ? "bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                        Phase 0{idx + 1}
                      </span>
                      {ms.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Clock3 className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                      {ms.title}
                    </div>
                    <div className="text-[11px] font-medium opacity-80">
                      {formatDate(ms.date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Timeline;
