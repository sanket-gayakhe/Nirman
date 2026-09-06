import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Database,
  ShieldAlert,
  WalletCards,
  MapPin
} from "lucide-react";
import RiskBadge from "../common/RiskBadge";
import { formatCurrency, formatDate } from "../../utils/formatters";

export function ProjectDetails({ project, goBack }) {
  if (!project) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
        <Database className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No Project Selected
        </h3>
        <button
          onClick={goBack}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Explorer
        </button>
      </div>
    );
  }

  const originalCost = project.original_cost || 0;
  const latestCost = project.latest_cost || originalCost;
  const overrunCost = latestCost - originalCost;
  const overrunPct = project.cost_overrun_pct || 0;
  const delayMonths = project.delay_months || 0;
  const physicalProgress = project.physical_progress || 0;

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </button>

        <RiskBadge level={project.risk_level} />
      </div>

      {/* Main Title Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <span>{project.sector}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {project.state}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {project.project_name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Executing Agency: <strong className="text-slate-700 dark:text-slate-300">{project.contractor || "National Infrastructure Division"}</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center min-w-[140px]">
            <div className="text-[10px] text-slate-400 uppercase font-bold">AI Risk Score</div>
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {project.risk_score || 75}<span className="text-sm font-normal text-slate-400">/100</span>
            </div>
          </div>
        </div>

        {/* Progress Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-500">Physical Progress Execution</span>
              <span className="text-slate-900 dark:text-white font-bold">{physicalProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(physicalProgress, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-500">Financial Disbursement</span>
              <span className="text-slate-900 dark:text-white font-bold">{project.financial_progress || physicalProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(project.financial_progress || physicalProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Schedule Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Metrics Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <WalletCards className="w-5 h-5 text-indigo-500" />
            Financial & Cost Overrun Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500">Original Approved Cost</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(originalCost)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500">Revised / Latest Cost</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(latestCost)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-rose-600 dark:text-rose-400 font-medium">Additional Cost Variance</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                +{formatCurrency(overrunCost)} ({overrunPct}%)
              </span>
            </div>
          </div>
        </div>

        {/* Schedule & Timeline Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            Timeline & Completion Deadlines
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500">Start / Sanction Date</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatDate(project.start_date)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500">Original Scheduled Target (DoC)</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatDate(project.original_doc)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-600 dark:text-amber-400 font-medium">Estimated Revised Target</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {formatDate(project.revised_doc)} (+{delayMonths} months)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Identified Risk Factors Card */}
      {project.risk_factors && project.risk_factors.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Active Risk Drivers & Mitigations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.risk_factors.map((factor, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
              >
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Risk Factor #{i + 1}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {factor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
