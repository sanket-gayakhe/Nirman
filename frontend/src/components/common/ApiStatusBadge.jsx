import { Database, RefreshCw } from "lucide-react";

export function ApiStatusBadge({ isConnected, onRetry }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isConnected ? "bg-emerald-400" : "bg-rose-400"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isConnected ? "bg-emerald-500" : "bg-rose-500"
          }`}
        />
      </span>
      <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
        <Database className="w-3.5 h-3.5" />
        {isConnected ? "API Live" : "API Offline (Mock Mode)"}
      </span>
      {!isConnected && onRetry && (
        <button
          onClick={onRetry}
          className="ml-1 p-0.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          title="Retry Connection"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export default ApiStatusBadge;
