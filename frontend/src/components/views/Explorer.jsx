import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Grid,
  List,
  Search,
  ExternalLink
} from "lucide-react";
import RiskBadge from "../common/RiskBadge";
import { formatCurrency } from "../../utils/formatters";

export function Explorer({ projects = [], openProject }) {
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [sortBy, setSortBy] = useState("rank");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique sectors & states
  const sectors = useMemo(() => {
    const set = new Set(projects.map((p) => p.sector).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [projects]);

  const states = useMemo(() => {
    const set = new Set(projects.map((p) => p.state).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [projects]);

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          !search ||
          p.project_name?.toLowerCase().includes(search.toLowerCase()) ||
          p.state?.toLowerCase().includes(search.toLowerCase()) ||
          p.contractor?.toLowerCase().includes(search.toLowerCase());

        const matchesSector = selectedSector === "all" || p.sector === selectedSector;
        const matchesState = selectedState === "all" || p.state === selectedState;

        return matchesSearch && matchesSector && matchesState;
      })
      .sort((a, b) => {
        if (sortBy === "rank") return (a.rank || 0) - (b.rank || 0);
        if (sortBy === "overrun") return (b.cost_overrun_pct || 0) - (a.cost_overrun_pct || 0);
        if (sortBy === "delay") return (b.delay_months || 0) - (a.delay_months || 0);
        if (sortBy === "name") return (a.project_name || "").localeCompare(b.project_name || "");
        return 0;
      });
  }, [projects, search, selectedSector, selectedState, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-500" />
              National Project Directory
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore {filteredProjects.length} infrastructure projects across sectors
            </p>
          </div>

          {/* View Switcher Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 self-start md:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
              Grid View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
              Table View
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by name..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500"
            />
          </div>

          {/* Sector Select */}
          <select
            value={selectedSector}
            onChange={(e) => {
              setSelectedSector(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
          >
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec === "all" ? "All Sectors" : sec}
              </option>
            ))}
          </select>

          {/* State Select */}
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
          >
            {states.map((st) => (
              <option key={st} value={st}>
                {st === "all" ? "All States" : st}
              </option>
            ))}
          </select>

          {/* Sort By Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300"
          >
            <option value="rank">Sort by Rank</option>
            <option value="overrun">Sort by Cost Overrun</option>
            <option value="delay">Sort by Delay</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Grid View Rendering */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedProjects.map((project) => (
            <div
              key={project.rank || project.project_name}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <RiskBadge level={project.risk_level} />
                  <span className="text-[11px] font-bold text-slate-400">
                    #{project.rank || "-"}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors line-clamp-2 mb-1">
                  {project.project_name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {project.sector} • {project.state}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 my-3">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Physical Execution</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {project.physical_progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${Math.min(project.physical_progress || 0, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Cost</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatCurrency(project.latest_cost || project.original_cost)}
                  </div>
                </div>

                <button
                  onClick={() => openProject(project.rank)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
                >
                  View
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View Rendering */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Delay</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedProjects.map((project) => (
                  <tr key={project.rank || project.project_name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-400">#{project.rank}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {project.project_name}
                      <span className="block text-[10px] font-normal text-slate-400">{project.state}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{project.sector}</td>
                    <td className="py-3 px-4"><RiskBadge level={project.risk_level} /></td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{project.physical_progress || 0}%</td>
                    <td className="py-3 px-4 text-amber-600 font-semibold">+{project.delay_months || 0}m</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openProject(project.rank)}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          Showing page <strong className="text-slate-900 dark:text-white">{currentPage}</strong> of {totalPages}
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Explorer;
