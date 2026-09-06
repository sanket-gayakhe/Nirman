import {
  AlertTriangle,
  BarChart3,
  ChevronRight,
  CircleAlert,
  Database,
  ShieldAlert,
  TrendingUp,
  WalletCards,
  ArrowUpRight,
  Activity
} from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import StatCard from "../common/StatCard";
import RiskBadge from "../common/RiskBadge";
import { formatCurrency, formatNumber } from "../../utils/formatters";

export function Dashboard({ summary, projects, setPage, openProject }) {
  const total = summary?.total_projects || 0;
  const critical = summary?.risk_distribution?.CRITICAL || 0;
  const high = summary?.risk_distribution?.HIGH || 0;
  const medium = summary?.risk_distribution?.MEDIUM || 0;
  const low = summary?.risk_distribution?.LOW || 0;
  const attention = critical + high;

  const riskData = [
    { name: "Critical", value: critical, color: "#ef4444" },
    { name: "High", value: high, color: "#f59e0b" },
    { name: "Medium", value: medium, color: "#3b82f6" },
    { name: "Low", value: low, color: "#10b981" },
  ].filter(item => item.value > 0);

  const sectorData = summary?.sector_breakdown || [
    { sector: "Highways", count: 18, cost: 68500 },
    { sector: "Metro & Rail", count: 14, cost: 54200 },
    { sector: "Power & Energy", count: 10, cost: 42000 },
    { sector: "Airports & Ports", count: 6, cost: 19800 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              National Project Intelligence
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              Infrastructure Risk Command Center
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Consolidated real-time monitoring of mega-projects across India. Track cost overruns, timeline delays, land acquisition roadblocks, and AI risk projections.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setPage("risk")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-150 shadow-lg shadow-indigo-600/30 active:scale-95"
            >
              <ShieldAlert className="w-4 h-4" />
              Risk Monitor
            </button>
            <button
              onClick={() => setPage("explorer")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-all duration-150 active:scale-95"
            >
              <Database className="w-4 h-4" />
              Explore All Projects
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Projects"
          value={formatNumber(total)}
          subtext="Active infrastructure portfolio"
          icon={Database}
          color="indigo"
        />
        <StatCard
          title="Requires Attention"
          value={formatNumber(attention)}
          subtext={total ? `${((attention / total) * 100).toFixed(1)}% of portfolio` : "High/Critical risk"}
          icon={ShieldAlert}
          color="amber"
          trend={{ positive: false, value: `${attention} flagged` }}
        />
        <StatCard
          title="Critical Interventions"
          value={formatNumber(critical)}
          subtext="Immediate action required"
          icon={CircleAlert}
          color="rose"
        />
        <StatCard
          title="Total Budget Tracked"
          value={formatCurrency(summary?.total_budget || 184500)}
          subtext="Capital investment pool"
          icon={WalletCards}
          color="emerald"
        />
      </div>

      {/* Main Charts & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Portfolio Risk Classification
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Risk severity distribution
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Capital Allocation Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Sector-wise Investment & Risk Exposure
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total expenditure tracked per sector
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="sector" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`₹${value} Cr`, "Capital"]}
                />
                <Bar dataKey="cost" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority High-Risk Projects Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              High Priority Attention List
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Projects exhibiting highest risk score and cost/delay variance
            </p>
          </div>

          <button
            onClick={() => setPage("explorer")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View All Projects
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Rank</th>
                <th className="py-3 px-4 font-semibold">Project Name</th>
                <th className="py-3 px-4 font-semibold">Sector</th>
                <th className="py-3 px-4 font-semibold">Risk Level</th>
                <th className="py-3 px-4 font-semibold">Physical Progress</th>
                <th className="py-3 px-4 font-semibold">Cost Overrun</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {projects.slice(0, 5).map((project, idx) => (
                <tr
                  key={project.rank || idx}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-400">
                    #{project.rank || idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {project.project_name}
                    <span className="block text-xs font-normal text-slate-400">
                      {project.state}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {project.sector}
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={project.risk_level} />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="w-36">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {project.physical_progress || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(project.physical_progress || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-rose-600 dark:text-rose-400">
                    +{project.cost_overrun_pct || 0}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openProject(project.rank)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all"
                    >
                      Details
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
